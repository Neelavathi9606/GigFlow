const BidCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-powder-blue hover:border-royal-blue transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-14 h-14 bg-powder-blue rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-royal-blue font-bold text-xl">JS</span>
          </div>
          
          {/* Info */}
          <div>
            <h4 className="text-lg font-bold text-royal-blue">Jane Smith</h4>
            <p className="text-sm text-royal-blue opacity-70">Frontend Specialist</p>
          </div>
        </div>

        {/* Status Badge */}
        <span className="bg-bone text-royal-blue px-3 py-1 rounded-full text-xs font-semibold">
          Pending
        </span>
        {/* <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
          Hired
        </span> */}
        {/* <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
          Rejected
        </span> */}
      </div>

      {/* Bid Amount */}
      <div className="bg-powder-blue rounded-lg p-4 mb-4">
        <p className="text-sm text-royal-blue opacity-80 mb-1">Proposed Price</p>
        <p className="text-3xl font-bold text-royal-blue">$4,500</p>
      </div>

      {/* Message */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-royal-blue mb-2">Cover Letter:</p>
        <p className="text-royal-blue leading-relaxed">
          I have over 5 years of experience in full stack development with expertise in React, 
          Node.js, and MongoDB. I've successfully delivered 20+ similar projects. I can complete 
          this within the timeline and budget.
        </p>
      </div>

      {/* Footer - Actions (Only visible to gig owner) */}
      <div className="flex items-center space-x-3 pt-4 border-t-2 border-powder-blue">
        <button className="flex-1 bg-royal-blue text-bone py-3 rounded-lg font-bold hover:bg-opacity-90 transition-all duration-200 cursor-pointer">
          Hire Freelancer
        </button>
        <button className="flex-1 border-2 border-royal-blue text-royal-blue py-3 rounded-lg font-bold hover:bg-powder-blue transition-all duration-200 cursor-pointer">
          View Profile
        </button>
      </div>

      {/* When bid is hired */}
      {/* <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
        <p className="text-green-700 font-bold">✓ This freelancer has been hired</p>
      </div> */}
    </div>
  );
};

export default BidCard;
