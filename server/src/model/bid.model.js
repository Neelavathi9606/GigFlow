import mongoose, {Schema} from "mongoose";

const bidSchema = new Schema({
  gigId: {
    type: Schema.Types.ObjectId,
    ref: "Gig",
    required: true
  },
  freelancerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  proposedPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "hired", "rejected"],
    default: "pending"
  }
}, {timestamps: true});

export const Bid = mongoose.model("Bid", bidSchema);