const mongoose = require("mongoose");

const listSchema = new mongoose.Schema(
  {
    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    name: {
      type: String,
      required: [true, "List name is required"],
      trim: true,
      maxlength: [40, "List name cannot exceed 40 characters"],
    },
    // Fractional ordering: new lists get maxOrder + 1000. Reordering a list
    // sets its order to the midpoint of its new neighbors — this lets the
    // frontend move a card between any two others with a single write and
    // no need to touch every other document in the board (Trello's approach).
    order: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

listSchema.index({ board: 1, order: 1 });

module.exports = mongoose.model("List", listSchema);
