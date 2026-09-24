import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserBids, deleteBid, updateBid } from "../service/service";
import { useSocket } from "../context/socketContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Notification from "../components/Notification";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [allBids, setAllBids] = useState([]); // Store all bids for filtering
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBids, setTotalBids] = useState(0);
  const itemsPerPage = 6;
  const { socket } = useSocket();

  const [editingBid, setEditingBid] = useState(null);
  const [editFormData, setEditFormData] = useState({ message: "", proposedPrice: "" });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, bidId: null, gigTitle: "" });

  useEffect(() => {
    fetchUserBids();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleBidAccepted = () => {
      fetchUserBids();
    };

    const handleBidRejected = () => {
      fetchUserBids();
    };

    socket.on('bidAccepted', handleBidAccepted);
    socket.on('bidRejected', handleBidRejected);

    return () => {
      socket.off('bidAccepted', handleBidAccepted);
      socket.off('bidRejected', handleBidRejected);
    };
  }, [socket]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchUserBids = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getUserBids(1, 1000);
      const fetchedBids = response.data.bids || response.data;
      setAllBids(fetchedBids);
      setBids(fetchedBids);
      setTotalBids(fetchedBids.length);
      setTotalPages(Math.ceil(fetchedBids.length / itemsPerPage));
    } catch (err) {
      console.error("Error fetching user bids:", err);
      setError(err.response?.data?.message || "Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBid = (bidId, gigTitle) => {
    setConfirmDialog({ isOpen: true, bidId, gigTitle });
  };

  const confirmDeleteBid = async () => {
    const { bidId } = confirmDialog;
    setConfirmDialog({ isOpen: false, bidId: null, gigTitle: "" });

    try {
      await deleteBid(bidId);
      const updatedBids = allBids.filter((bid) => bid._id !== bidId);
      setAllBids(updatedBids);
      setBids(updatedBids);
      setNotification({ message: "Bid deleted successfully!", type: "success" });
      const filteredBids = getFilteredBids(updatedBids);
      setTotalBids(filteredBids.length);
      setTotalPages(Math.ceil(filteredBids.length / itemsPerPage));
    } catch (err) {
      console.error("Error deleting bid:", err);
      setNotification({ message: err.response?.data?.message || "Failed to delete bid", type: "error" });
    }
  };

  const handleEditBid = (bid) => {
    setEditingBid(bid._id);
    setEditFormData({
      message: bid.message,
      proposedPrice: bid.proposedPrice,
    });
    setEditError("");
  };

  const handleCancelEdit = () => {
    setEditingBid(null);
    setEditFormData({ message: "", proposedPrice: "" });
    setEditError("");
  };

  const handleUpdateBid = async (bidId, gigId) => {
    if (!editFormData.message || !editFormData.proposedPrice) {
      setEditError("Please fill all fields");
      return;
    }

    if (editFormData.message.trim().length < 20) {
      setEditError("Message must be at least 20 characters long");
      return;
    }

    if (Number(editFormData.proposedPrice) <= 0) {
      setEditError("Proposed price must be greater than 0");
      return;
    }

    try {
      setEditLoading(true);
      setEditError("");
      const response = await updateBid(bidId, gigId, editFormData.message, Number(editFormData.proposedPrice));
      const updatedBids = allBids.map((bid) => (bid._id === bidId ? response.data : bid));
      setAllBids(updatedBids);
      setBids(updatedBids);
      setEditingBid(null);
      setEditFormData({ message: "", proposedPrice: "" });
    } catch (err) {
      console.error("Error updating bid:", err);
      setEditError(err.response?.data?.message || "Failed to update bid");
    } finally {
      setEditLoading(false);
    }
  };

  const getFilteredBids = (bidsList = allBids) => {
    if (filter === "all") return bidsList.filter(bid => bid && bid.status);
    return bidsList.filter((bid) => bid && bid.status === filter);
  };

  const getPaginatedBids = () => {
    const filtered = getFilteredBids();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getBidCount = (status) => {
    if (status === "all") return allBids.filter(bid => bid && bid.status).length;
    return allBids.filter((bid) => bid && bid.status === status).length;
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const filtered = getFilteredBids();
    setTotalBids(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [filter, allBids]);

  const getStatusDisplay = (status) => {
    if (status === "pending") return "Pending";
    if (status === "hired") return "✓ Hired";
    if (status === "rejected") return "Rejected";
    return status;
  };

  const getStatusStyle = (status) => {
    if (status === "hired") return "bg-green-100 text-green-700";
    if (status === "rejected") return "bg-red-100 text-red-700";
    return "bg-bone text-royal-blue";
  };

  const getBorderStyle = (status) => {
    if (status === "hired") return "border-green-200 hover:border-green-400";
    if (status === "rejected") return "border-red-200 hover:border-red-300 opacity-75";
    return "border-powder-blue hover:border-royal-blue";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Bid"
        message={`Are you sure you want to delete your bid for "${confirmDialog.gigTitle}"? This action cannot be undone.`}
        onConfirm={confirmDeleteBid}
        onCancel={() => setConfirmDialog({ isOpen: false, bidId: null, gigTitle: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      <div className="min-h-screen flex flex-col">
      <section className="bg-gradient-to-r from-royal-blue to-royal-blue/90 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-bone mb-4">My Bids</h1>
          <p className="text-xl text-powder-blue">
            Track all your submitted bids and their status
          </p>
        </div>
      </section>

      <section className="flex-1 bg-bone py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="mb-6">
              <ErrorMessage message={error} />
            </div>
          )}

          <div className="flex space-x-4 mb-8 border-b-2 border-powder-blue">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 font-bold transition-opacity ${
                filter === "all"
                  ? "text-royal-blue border-b-4 border-royal-blue -mb-0.5"
                  : "text-royal-blue opacity-70 hover:opacity-100"
              }`}
            >
              All Bids ({getBidCount("all")})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-3 font-bold transition-opacity ${
                filter === "pending"
                  ? "text-royal-blue border-b-4 border-royal-blue -mb-0.5"
                  : "text-royal-blue opacity-70 hover:opacity-100"
              }`}
            >
              Pending ({getBidCount("pending")})
            </button>
            <button
              onClick={() => setFilter("hired")}
              className={`px-6 py-3 font-bold transition-opacity ${
                filter === "hired"
                  ? "text-royal-blue border-b-4 border-royal-blue -mb-0.5"
                  : "text-royal-blue opacity-70 hover:opacity-100"
              }`}
            >
              Hired ({getBidCount("hired")})
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className={`px-6 py-3 font-bold transition-opacity ${
                filter === "rejected"
                  ? "text-royal-blue border-b-4 border-royal-blue -mb-0.5"
                  : "text-royal-blue opacity-70 hover:opacity-100"
              }`}
            >
              Rejected ({getBidCount("rejected")})
            </button>
          </div>

          {getFilteredBids().length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-powder-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-royal-blue mb-3">No bids found</h3>
              <p className="text-royal-blue opacity-70 mb-6">
                Start bidding on projects that match your skills and expertise
              </p>
              <Link to="/gigs">
                <button className="bg-royal-blue text-bone px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200">
                  Browse Available Gigs
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-royal-blue opacity-70">
                  Showing {getPaginatedBids().length} of {totalBids} {filter === "all" ? "" : filter} bids
                </p>
              </div>
              <div className="space-y-6">
                {getPaginatedBids().map((bid) => (
                <div key={bid._id} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getBorderStyle(bid.status)} transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(bid.status)}`}>
                          {getStatusDisplay(bid.status)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-royal-blue mb-2">
                        {bid.gigId?.title || 'Untitled Gig'}
                      </h3>
                      <p className="text-royal-blue opacity-70 mb-3">
                        Client: {bid.gigId?.ownerId?.name || 'Unknown'} • Bid submitted {new Date(bid.createdAt).toLocaleDateString()}
                      </p>
                      {bid.status === "hired" && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-3">
                          <p className="text-green-700 font-bold mb-2">🎉 Congratulations! You've been hired!</p>
                          <p className="text-green-600 text-sm">
                            The client has selected you for this project. Get started and deliver amazing work!
                          </p>
                        </div>
                      )}
                      {bid.status === "rejected" && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mb-3">
                          <p className="text-red-600 text-sm">
                            The client has selected another freelancer for this project.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <p className="text-3xl font-bold text-royal-blue mb-1">${bid.proposedPrice}</p>
                      <p className="text-sm text-royal-blue opacity-70">Your Bid</p>
                      <p className={`text-xs mt-2 ${bid.status === "hired" ? "text-green-600" : "text-royal-blue opacity-60"}`}>
                        vs ${bid.gigId?.budget || 0} budget
                      </p>
                    </div>
                  </div>
                  
                  {editingBid === bid._id ? (
                    <div className="pt-4 border-t-2 border-powder-blue">
                      {editError && (
                        <div className="mb-4">
                          <ErrorMessage message={editError} />
                        </div>
                      )}
                      {editLoading ? (
                        <LoadingSpinner />
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-royal-blue font-semibold mb-2">Proposed Price</label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-royal-blue font-bold">$</span>
                              <input
                                type="number"
                                value={editFormData.proposedPrice}
                                onChange={(e) => setEditFormData({ ...editFormData, proposedPrice: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-royal-blue font-semibold mb-2">Cover Letter</label>
                            <textarea
                              rows="4"
                              value={editFormData.message}
                              onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                              className="w-full px-4 py-2 border-2 border-powder-blue rounded-lg focus:border-royal-blue focus:outline-none resize-none"
                            ></textarea>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={handleCancelEdit}
                              className="flex-1 border-2 border-royal-blue text-royal-blue py-2 rounded-lg font-semibold hover:bg-powder-blue transition-all duration-200"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleUpdateBid(bid._id, bid.gigId?._id)}
                              className="flex-1 bg-royal-blue text-bone py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pt-4 border-t-2 border-powder-blue">
                      <p className="text-royal-blue text-sm mb-3">
                        <strong>Your Proposal:</strong> {bid.message.length > 100 ? bid.message.substring(0, 100) + "..." : bid.message}
                      </p>
                      <div className="flex items-center space-x-3">
                        <Link to={`/gigs/${bid.gigId?._id}`} className="flex-1">
                          <button className="w-full bg-powder-blue text-royal-blue py-3 rounded-lg font-semibold hover:bg-royal-blue hover:text-bone transition-all duration-200 border-2 border-royal-blue">
                            View Project Details
                          </button>
                        </Link>
                        {bid.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleEditBid(bid)}
                              className="flex-1 border-2 border-royal-blue text-royal-blue py-3 rounded-lg font-semibold hover:bg-powder-blue transition-all duration-200"
                            >
                              Edit Bid
                            </button>
                            <button
                              onClick={() => handleDeleteBid(bid._id, bid.gigId?.title || 'this gig')}
                              className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
      </div>
    </>
  );
};

export default MyBids;
