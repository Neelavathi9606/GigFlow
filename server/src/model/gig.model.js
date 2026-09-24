import mongoose, {Schema} from "mongoose";

const gigSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  slug:{
    type: String,
    required: true,
    unique: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  hiredFreelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  status: {
    type: String,
    enum: ["open", "assigned"],
    default: "open"
  }
}, {timestamps: true});

gigSchema.index(
  {status: 1, hiredFreelancerId: 1, slug: 1},
  {
    unique: true,
    partialFilterExpression: {status: "assigned"}
  }
)

export const Gig = mongoose.model("Gig", gigSchema);