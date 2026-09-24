import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Bid } from "../model/bid.model.js";
import { Gig } from "../model/gig.model.js";
import { io, connectedUsers } from "../index.js";

const createBid = asyncHandler(async(req, res)=>{
  const {gigId, message, proposedPrice} = req.body;
  const freelancerId = req.user._id;

  if(!gigId || !message || !proposedPrice){
    throw new ApiError(400, "All the fields are required");
  }

  if(typeof message === 'string' && message.trim() === ""){
    throw new ApiError(400, "Message cannot be empty");
  }

  if(!freelancerId){
    throw new ApiError(404, "Freelancer Id was not received");
  }

  const gig = await Gig.findById(gigId);
  if(!gig){
    throw new ApiError(404, "Gig not found");
  }

  if(gig.status !== "open"){
    throw new ApiError(400, "Cannot bid on a gig that is not open");
  }

  if(gig.ownerId.toString() === freelancerId.toString()){
    throw new ApiError(400, "You cannot bid on your own gig");
  }

  const existingBid = await Bid.findOne({ gigId, freelancerId });
  if(existingBid){
    throw new ApiError(400, "You have already placed a bid on this gig");
  }

  const createdBid = await Bid.create({
    gigId,
    freelancerId,
    message,
    proposedPrice,
    status:"pending"
  });

  const populatedBid = await Bid.findById(createdBid._id)
    .populate('freelancerId', 'name username email')
    .populate('gigId', 'title ownerId');

  if (populatedBid.gigId && populatedBid.gigId.ownerId) {
    const ownerSocketId = connectedUsers.get(populatedBid.gigId.ownerId.toString());
    if (ownerSocketId) {
      io.to(ownerSocketId).emit('newBid', {
        bid: populatedBid,
        message: `${populatedBid.freelancerId.name} placed a bid of $${proposedPrice} on your gig "${populatedBid.gigId.title}"`
      });
    }
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      createdBid,
      "New Bid created successfully"
    )
  )
})

const updateBid = asyncHandler(async(req, res)=>{
  const bidId = req.params.id;
  const {message, proposedPrice} = req.body;
  const freelancerId = req.user._id;

  if(!bidId){
    throw new ApiError(400, "Bid ID is required");
  }

  if(!message || !proposedPrice){
    throw new ApiError(400, "All the fields are required");
  }

  if(typeof message === 'string' && message.trim() === ""){
    throw new ApiError(400, "Message cannot be empty");
  }

  if(!freelancerId){
    throw new ApiError(404, "Freelancer Id was not received");
  }

  const bid = await Bid.findById(bidId);

  if(!bid){
    throw new ApiError(404, "Bid not found");
  }

  if(bid.freelancerId.toString() !== freelancerId.toString()){
    throw new ApiError(403, "Access denied. Only the bid owner can update this bid");
  }

  if(bid.status !== "pending"){
    throw new ApiError(400, `Cannot update a bid that has already been ${bid.status}`);
  }

  bid.message = message;
  bid.proposedPrice = proposedPrice;
  await bid.save();

  const updatedBid = await Bid.findById(bidId)
    .populate("gigId", "title description slug budget ownerId")
    .populate({
      path: "gigId",
      populate: {
        path: "ownerId",
        select: "name username email"
      }
    });

  if(!updatedBid){
    throw new ApiError(500, "Unable to update the bid");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedBid,
      "Bid updated Successfully"
    )
  )
})

const deleteBid = asyncHandler(async(req, res)=>{
  const bidId = req.params.id;
  const freelancerId = req.user._id;

  if(!bidId){
    throw new ApiError(400, "Bid ID is required");
  }

  const bid = await Bid.findById(bidId);

  if(!bid){
    throw new ApiError(404, "Bid not found");
  }

  if(bid.freelancerId.toString() !== freelancerId.toString()){
    throw new ApiError(403, "Access denied. Only the bid owner can delete this bid");
  }

  if(bid.status === "hired"){
    throw new ApiError(400, "Cannot delete a bid that has already been hired");
  }

  const deletedBid = await Bid.findByIdAndDelete(bidId);

  if(!deletedBid){
    throw new ApiError(500, "Unable to delete the bid");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedBid,
      "Bid deleted successfully"
    )
  )
})

const getUserBid = asyncHandler(async(req, res)=>{
  const freelancerId = req.user._id;
  const {page = 1, limit = 10} = req.query;

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const totalBids = await Bid.countDocuments({freelancerId: freelancerId});
  const bidsByUser = await Bid.find({freelancerId: freelancerId})
    .populate("gigId", "title description slug budget ownerId")
    .populate({
      path: "gigId",
      populate: {
        path: "ownerId",
        select: "name username email"
      }
    })
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limitNumber);

  if(!bidsByUser){
    throw new ApiError(404, "No bids has been posted by the user");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bids: bidsByUser,
        total: totalBids,
        totalPages: Math.ceil(totalBids / limitNumber),
        currentPage: pageNumber,
        count: bidsByUser.length
      },
      "Bids posted by user found successfully"
    )
  )
})

const getGigBid = asyncHandler(async(req, res)=>{
  const gigId = req.params.gigId;
  const userId = req.user._id;
  const {page = 1, limit = 10} = req.query;

  const gig = await Gig.findById(gigId);

  if(!gig){
    throw new ApiError(404, "Gig not found");
  }

  if (gig.ownerId.toString() !== userId.toString()) {
    throw new ApiError(403, "Access denied. Only the gig owner can view bids");
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const totalBids = await Bid.countDocuments({gigId: gigId});
  const bidsForGig = await Bid.find({gigId: gigId})
    .populate("freelancerId", "name username email")
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limitNumber);

  if(!bidsForGig){
    throw new ApiError(404, "No bid found for the gig");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        bids: bidsForGig,
        total: totalBids,
        totalPages: Math.ceil(totalBids / limitNumber),
        currentPage: pageNumber,
        count: bidsForGig.length
      },
      "All the bids for the gig fetched successfully"
    )
  )
})

export {createBid, updateBid, deleteBid, getUserBid, getGigBid}