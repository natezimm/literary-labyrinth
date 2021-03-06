const mongoose    = require("mongoose");

// SCHEMA SETUP
const bookSchema = new mongoose.Schema({
    name: String,
    writer: String,
    price: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});

module.exports = mongoose.model("Book", bookSchema);