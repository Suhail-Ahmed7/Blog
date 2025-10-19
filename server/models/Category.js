const moongose = require("mongoose");

const categorySchema = moongose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: String,
    updateBy: {
      type: moongose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Category = moongose.model("category", categorySchema);

module.exports = Category;
