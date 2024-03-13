const mongoose = require("mongoose");
const { Schema } = mongoose;

const SessionSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    year: { // yyyy
        type: Number,
        required: true
    },
    month: { // MM => 1 - 12 
        type: Number,
        required: true
    },
    day: { // dd => 1 - 31 
        type: Number,
        required: true
    },
    totalNumOfSession: { // 
        type: Number,
        required: true,
        default: 0
    },
    lastNumOfSession: {
        type: Number,
        required: true
    },
    lastUpdated: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Session", SessionSchema, "Session");


// add this to advice cannot redeclare block-scoped variable error
export { }