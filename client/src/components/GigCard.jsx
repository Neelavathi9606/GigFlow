import { useNavigate } from "react-router-dom";

const GigCard = ({ gig }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/gigs/${gig._id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-powder-blue hover:border-royal-blue">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            onClick={handleViewDetails}
            className="text-xl font-bold text-royal-blue mb-2 hover:underline cursor-pointer"
          >
            {gig.title}
          </h3>
          <p className="text-sm text-royal-blue opacity-70">
            Posted by {gig.ownerId?.name || "Unknown"}
          </p>
        </div>
        <span className="bg-powder-blue text-royal-blue px-3 py-1 rounded-full text-xs font-semibold capitalize">
          {gig.status}
        </span>
      </div>

      <p className="text-royal-blue mb-4 line-clamp-3 leading-relaxed">
        {gig.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t-2 border-powder-blue">
        <div className="flex items-center space-x-4">
          <div className="text-royal-blue">
            <span className="font-bold text-2xl">${gig.budget}</span>
            <span className="text-sm ml-1 opacity-70">Budget</span>
          </div>
        </div>
        <button
          onClick={handleViewDetails}
          className="bg-royal-blue text-bone px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200 cursor-pointer"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default GigCard;
