const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxLength: [200, "Description cannot exceed 200 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

//mongoose hook to change name to slug
categorySchema.pre("save", async function () {
  this.slug = this.name
    .toLowerCase()
    .replace(/ /g, "-") // spaces → hyphens
    .replace(/[^\w-]+/g, "");
});

module.exports = mongoose.model("Category", categorySchema);
