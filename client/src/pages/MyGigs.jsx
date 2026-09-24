import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllGigs, deleteGig } from "../service/service";
import useAuth from "../context/authContext";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";

const MyGigs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [gigs, setGigs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGigs, setTotalGigs] = useState(0);
  const itemsPerPage = 10;
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, gigId: null, gigTitle: "" });

  const fetchMyGigs = async (page = 1) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await getAllGigs("", page, 100, true);
      const myGigs = response.data.gigs.filter(
        (gig) => gig.ownerId._id === user._id
      );
      
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedGigs = myGigs.slice(startIndex, endIndex);
      
      setGigs(paginatedGigs);
      setTotalGigs(myGigs.length);
      setTotalPages(Math.ceil(myGigs.length / itemsPerPage));
      setCurrentPage(page);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch your gigs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyGigs(currentPage);
  }, [currentPage]);

  const handleDelete = (gigId, gigTitle) => {
    setConfirmDialog({ isOpen: true, gigId, gigTitle });
  };

  const confirmDelete = async () => {
    const { gigId } = confirmDialog;
    setConfirmDialog({ isOpen: false, gigId: null, gigTitle: "" });

    try {
      await deleteGig(gigId);
      fetchMyGigs(currentPage);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete gig");
    }
  };

  const handleViewBids = (gigId) => {
    navigate(`/gigs/${gigId}/bids`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title="Delete Gig"
        message={`Are you sure you want to delete "${confirmDialog.gigTitle}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, gigId: null, gigTitle: "" })}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      <div className="min-h-screen flex flex-col">
      <section className="bg-gradient-to-r from-royal-blue to-royal-blue/90 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-bone mb-4">
                My Gigs
              </h1>
              <p className="text-xl text-powder-blue">
                Manage all jobs you've posted
              </p>
            </div>
            <button
              onClick={() => navigate("/create-gig")}
              className="bg-bone text-royal-blue px-6 py-3 rounded-lg font-bold hover:bg-powder-blue transition-all duration-200 shadow-lg cursor-pointer"
            >
              + Post New Job
            </button>
          </div>
        </div>
      </section>

      <section className="flex-1 bg-bone py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {error && <ErrorMessage message={error} />}

          {isLoading ? (
            <LoadingSpinner />
          ) : gigs.length === 0 && totalGigs === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <p className="text-2xl text-royal-blue opacity-70 mb-4">
                You haven't posted any gigs yet
              </p>
              <button
                onClick={() => navigate("/create-gig")}
                className="bg-royal-blue text-bone px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200 cursor-pointer"
              >
                Post Your First Gig
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-royal-blue opacity-70">
                  Showing {gigs.length} of {totalGigs} gigs
                </p>
              </div>
              <div className="space-y-6">
                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="bg-white rounded-xl shadow-lg p-6 border-2 border-powder-blue hover:border-royal-blue transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-royal-blue">
                            {gig.title}
                          </h3>
                          <span className="bg-powder-blue text-royal-blue px-3 py-1 rounded-full text-xs font-semibold capitalize">
                            {gig.status}
                          </span>
                        </div>
                        <p className="text-royal-blue mb-3 line-clamp-2">
                          {gig.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-royal-blue opacity-70">
                          <span className="font-bold text-xl text-royal-blue opacity-100">
                            ${gig.budget}
                          </span>
                          <span>
                            Posted{" "}
                            {new Date(gig.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleViewBids(gig._id)}
                          className="bg-royal-blue text-bone px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 cursor-pointer"
                        >
                          View Bids
                        </button>
                        <button
                          onClick={() => navigate(`/gigs/${gig._id}`)}
                          className="border-2 border-powder-blue text-royal-blue px-6 py-2 rounded-lg font-semibold hover:bg-powder-blue transition-all duration-200 cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(gig._id, gig.title)}
                          className="border-2 border-red-500 text-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
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

export default MyGigs;

