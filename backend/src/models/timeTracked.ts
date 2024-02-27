const mongoose = require("mongoose");
const { Schema } = mongoose;

const TimeTrackedSchema = new Schema({
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
    durationDay: { // in minutes
        type: Number,
        required: true,
        default: 0
    },
    lastTask: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("TimeTracked", TimeTrackedSchema, "TimeTracked");


// add this to advice cannot redeclare block-scoped variable error
export { }