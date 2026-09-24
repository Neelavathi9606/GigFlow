import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Gig } from "../model/gig.model.js";
import { Bid } from "../model/bid.model.js";
import mongoose from "mongoose";
import { io, connectedUsers } from "../index.js";

const createGig = asyncHandler(async (req, res)=>{
  const {title, description, budget, slug} = req.body;

  if(!title || !description || !budget){
    throw new ApiError(400, "All the fields are required");
  }

  if(typeof title === 'string' && title.trim() === ""){
    throw new ApiError(400, "Title cannot be empty");
  }

  if(typeof description === 'string' && description.trim() === ""){
    throw new ApiError(400, "Description cannot be empty");
  }

  const userId = req.user._id;

  if(!userId){
    throw new ApiError(500, "Error getting user Id");
  }

  const isSlugPresent = await Gig.findOne({slug: slug});

  if(isSlugPresent){
    throw new ApiError(400, "Slug already in use");
  }

  const createdGig = await Gig.create({
    title,
    description,
    budget,
    slug,
    ownerId: userId,
  });

  if(!createdGig){
    throw new ApiError(500, "Error creating new Gig");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      createdGig,
      "Gig created Successfully"
    )
  )
});


const updateGig = asyncHandler(async (req, res)=>{
  const {title, description, budget, slug} = req.body;
  const gigId = req.params._id;

  if(!gigId){
    throw new ApiError(404, "Gig id was not received");
  }

  if(!title || !description || !budget || !slug){
    throw new ApiError(400, "All the fields are required");
  }

  if(typeof title === 'string' && title.trim() === ""){
    throw new ApiError(400, "Title cannot be empty");
  }

  if(typeof description === 'string' && description.trim() === ""){
    throw new ApiError(400, "Description cannot be empty");
  }

  if(typeof slug === 'string' && slug.trim() === ""){
    throw new ApiError(400, "Slug cannot be empty");
  }

  const isSlugPresent = await Gig.findOne({slug: slug, _id: {$ne: gigId}});

  if(isSlugPresent){
    throw new ApiError(400, "Slug already in use");
  }

  const updatedGig = await Gig.findByIdAndUpdate(
    gigId,
    {
      title,
      description,
      budget,
      slug
    },
    { new: true, runValidators: true }
  );

  if(!updatedGig){
    throw new ApiError(500, "Error updating the gig");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      updatedGig,
      "Gig updated Successfully"
    )
  );
});


const getAllGig = asyncHandler(async (req, res)=>{
  const {search, page = 1, limit = 10, includeAssigned} = req.query;
  
  let filter = {};
  
  if (includeAssigned !== 'true') {
    filter.status = "open";
  }

  if(search){
    filter.title = {$regex: search, $options: 'i'};
  }

  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const totalGigs = await Gig.countDocuments(filter);
  const allGigs = await Gig.find(filter)
    .populate("ownerId", "name email")
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limitNumber);

  if(!allGigs){
    throw new ApiError(500, "Error fetching gig");
  }

  return res.status(200).json(
    new ApiResponse(
      200, 
      {
        count: allGigs.length,
        total: totalGigs,
        totalPages: Math.ceil(totalGigs / limitNumber),
        currentPage: pageNumber,
        gigs: allGigs
      }, 
      search 
        ? `Found ${totalGigs} gigs matching "${search}"`
        : "All gigs fetched successfully"
    )
  );
});


const getGigById = asyncHandler(async (req, res)=>{
  const gigId = req.params.id;

  if(!gigId){
    throw new ApiError(404, "Gig id was not received");
  }

  const foundGig = await Gig.findById(gigId).populate("ownerId", "name username email");

  if(!foundGig){
    throw new ApiError(404, "Gig with the provided id was not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      foundGig,
      "Gig found successfully"
    )
  );
});


const deleteGig = asyncHandler(async (req, res)=>{
  const gigId = req.params.id;

  if(!gigId){
    throw new ApiError(404, "Gig id was not received");
  }

  const deletedGig = await Gig.findByIdAndDelete(gigId);

  if(!deletedGig){
    throw new ApiError(404, "Gig with the provided id was not found");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      deletedGig,
      "Gig deleted successfully"
    )
  );
});


const acceptGigFreelancer = asyncHandler(async (req, res)=>{
  const gigId = req.params.id;
  const {bidId} = req.body;

  if(!gigId){
    throw new ApiError(404, "Gig id was not received");
  }

  if(!bidId){
    throw new ApiError(404, "Bid id was not received");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const hiredBid = await Bid.findById(bidId).session(session);

    const freelancerId = hiredBid.freelancerId;
  
    if(!hiredBid){
      throw new ApiError(404, "Bid not found");
    }

    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      throw new ApiError(404, "Gig not found");
    }
    if (gig.status === "assigned") {
      throw new ApiError(400, "This gig has already been assigned");
    }
  
    hiredBid.status = "hired";
    const saveHiredBid = await hiredBid.save({session});
  
    if(!saveHiredBid){
      throw new ApiError(500, "Error updating the selected bid as hired");
    }
  
    const updateOtherBids = await Bid.updateMany(
      {
        gigId: gigId,
        _id: {$ne: bidId}
      },
      {
        status: "rejected"
      },
      {session}
    );
  
    if(!updateOtherBids){
      throw new ApiError(500, "Error updating other bids as rejected");
    }
  
    const updatedGig = await Gig.findByIdAndUpdate(
      gigId,
      {
        hiredFreelancerId: freelancerId,
        status: "assigned"
      },
      {new: true, session}
    ).populate("hiredFreelancerId", "name email");
  
    if(!updatedGig){
      throw new ApiError(500, "Unable to update gig info");
    }
  
    await session.commitTransaction();

    const hiredBidPopulated = await Bid.findById(bidId)
      .populate('freelancerId', 'name username email')
      .populate('gigId', 'title budget');
    
    const hiredFreelancerSocketId = connectedUsers.get(freelancerId.toString());
    if (hiredFreelancerSocketId) {
      io.to(hiredFreelancerSocketId).emit('bidAccepted', {
        bid: hiredBidPopulated,
        message: `Congratulations! You've been hired for "${updatedGig.title}"`
      });
    }

    const rejectedBids = await Bid.find({
      gigId: gigId,
      _id: {$ne: bidId},
      status: 'rejected'
    }).populate('freelancerId', '_id name');

    rejectedBids.forEach(bid => {
      const rejectedFreelancerSocketId = connectedUsers.get(bid.freelancerId._id.toString());
      if (rejectedFreelancerSocketId) {
        io.to(rejectedFreelancerSocketId).emit('bidRejected', {
          bidId: bid._id,
          gigTitle: updatedGig.title,
          message: `Your bid for "${updatedGig.title}" was not selected`
        });
      }
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          gig: updatedGig,
          hiredBid: hiredBid,
        },
        "Freelancer hired successfully! Other bids have been rejected."
      )
    );
  } catch (error) {
    await session.abortTransaction();
    throw error
  } finally {
    session.endSession();
  }
});

export {createGig, updateGig, getAllGig, getGigById, deleteGig, acceptGigFreelancer}