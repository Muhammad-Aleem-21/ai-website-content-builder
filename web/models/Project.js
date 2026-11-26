import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    input: { type: mongoose.Schema.Types.Mixed, required: true },      // the form data
    content: { type: mongoose.Schema.Types.Mixed, required: true },    // generated + edited content
    selections: { type: mongoose.Schema.Types.Mixed, default: {} },    // picked headline/description/etc.
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);