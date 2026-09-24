import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuth from "../context/authContext";
import { useSocket } from "../context/socketContext";
import { getGigBids, hireFreelancer, getGigById } from "../service/service";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Notification from "../components/Notification";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";

const GigBids = () => {
  const { gigId } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const { socket } = useSocket();

  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hiringBidId, setHiringBidId] = useState(null);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, bidId: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBids, setTotalBids] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    fetchGigAndBids();
  }, [gigId, isLoggedIn, currentPage]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBid = (data) => {
      if (data.bid.gigId._id === gigId) {
        fetchGigAndBids();
      }
    };

    socket.on('newBid', handleNewBid);

    return () => {
      socket.off('newBid', handleNewBid);
    };
  }, [socket, gigId]);

  const fetchGigAndBids = async () => {
    try {
      setLoading(true);
      setError("");
      
      const gigResponse = await getGigById(gigId);
      const gigData = gigResponse.data;
      setGig(gigData);

      if (user && gigData.ownerId?._id !== user._id) {
        setError("You are not authorized to view bids for this gig");
        setLoading(false);
        return;
      }

      const bidsResponse = await getGigBids(gigId, currentPage, itemsPerPage);
      setBids(bidsResponse.data.bids || bidsResponse.data);
      setTotalPages(bidsResponse.data.totalPages || 1);
      setTotalBids(bidsResponse.data.total || (bidsResponse.data.bids || bidsResponse.data).length);
    } catch (err) {
      console.error("Error fetching gig bids:", err);
      setError(err.response?.data?.message || "Failed to load bids");
    } finally {
      setLoading(false);
    }
  };

  const handleHireFreelancer = async (bidId) => {
    setConfirmDialog({ isOpen: true, bidId });
  };

  const confirmHire = async () => {
    const { bidId } = confirmDialog;
    setConfirmDialog({ isOpen: false, bidId: null });

    try {
      setHiringBidId(bidId);
      await hireFreelancer(gigId, bidId);
      await fetchGigAndBids();
      setNotification({ message: "Freelancer hired successfully!", type: "success" });
    } catch (err) {
      console.error("Error hiring freelancer:", err);
      setNotification({ message: err.response?.data?.message || "Failed to hire freelancer", type: "error" });
    } finally {
      setHiringBidId(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    if (status === "hired") return "border-green-200";
    if (status === "rejected") return "border-red-200 opacity-75";
    return "border-powder-blue";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-bone px-6">
        <ErrorMessage message={error} />
        <Link to="/my-gigs" className="mt-4 text-royal-blue hover:text-blue-600 font-semibold">
          Back to My Gigs
        </Link>
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
        title="Hire Freelancer"
        message="Are you sure you want to hire this freelancer?"
        onConfirm={confirmHire}
        onCancel={() => setConfirmDialog({ isOpen: false, bidId: null })}
        confirmText="Hire"
        cancelText="Cancel"
        type="primary"
      />
      <div className="min-h-screen flex flex-col">
      <section className="bg-gradient-to-r from-royal-blue to-royal-blue/90 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Link to={`/gigs/${gigId}`} className="inline-flex items-center text-bone hover:text-blue-600 mb-4 font-semibold">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Gig Details
          </Link>
          {gig && (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-bone mb-4">{gig.title}</h1>
              <p className="text-xl text-powder-blue">
                Review and manage all bids for this project
              </p>
            </>
          )}
        </div>
      </section>

      <section className="flex-1 bg-bone py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {gig && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-2 border-powder-blue">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-royal-blue mb-2">Project Budget</h2>
                  <p className="text-4xl font-bold text-royal-blue">${gig.budget}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-royal-blue mb-2">Total Bids</h2>
                  <p className="text-4xl font-bold text-royal-blue">{totalBids}</p>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-royal-blue mb-2">Status</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${gig.status === "open" ? "bg-powder-blue text-royal-blue" : gig.status === "assigned" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                    {gig.status === "open" ? "Open" : gig.status === "assigned" ? "Assigned" : "Closed"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {bids.length === 0 && totalBids === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-powder-blue rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-royal-blue mb-3">No bids yet</h3>
              <p className="text-royal-blue opacity-70">
                Freelancers will be able to submit their bids for your project
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-royal-blue opacity-70">
                  Showing {bids.length} of {totalBids} bids
                </p>
              </div>
              <div className="space-y-6">
                {bids.map((bid) => (
                <div key={bid._id} className={`bg-white rounded-xl shadow-lg p-6 border-2 ${getBorderStyle(bid.status)} hover:border-royal-blue transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-powder-blue rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-royal-blue font-bold text-xl">
                          {bid.freelancerId.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-bold text-royal-blue">{bid.freelancerId.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(bid.status)}`}>
                            {getStatusDisplay(bid.status)}
                          </span>
                        </div>
                        <p className="text-sm text-royal-blue opacity-70">@{bid.freelancerId.username}</p>
                        <p className="text-sm text-royal-blue opacity-70">{bid.freelancerId.email}</p>
                        <p className="text-sm text-royal-blue opacity-70 mt-1">
                          Submitted {new Date(bid.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-6">
                      <div className="bg-powder-blue rounded-lg p-4">
                        <p className="text-sm text-royal-blue opacity-80 mb-1">Proposed Price</p>
                        <p className="text-3xl font-bold text-royal-blue">${bid.proposedPrice}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 bg-bone rounded-lg p-4">
                    <p className="text-sm font-semibold text-royal-blue mb-2">Cover Letter:</p>
                    <p className="text-royal-blue leading-relaxed">
                      {bid.message}
                    </p>
                  </div>

                  {bid.status === "hired" && (
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                      <p className="text-green-700 font-bold">✓ This freelancer has been hired for your project</p>
                    </div>
                  )}

                  {bid.status === "pending" && gig && gig.status === "open" && (
                    <div className="flex items-center space-x-3 pt-4 border-t-2 border-powder-blue">
                      <button
                        onClick={() => handleHireFreelancer(bid._id)}
                        disabled={hiringBidId === bid._id}
                        className="flex-1 bg-royal-blue text-bone py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {hiringBidId === bid._id ? "Hiring..." : "Hire Freelancer"}
                      </button>
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

export default GigBids;
