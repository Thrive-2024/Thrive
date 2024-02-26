const mongoose = require("mongoose");
const { Schema } = mongoose;

const MotivationSchema = new Schema({
    receiver: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    createdDateTime: {
        type: String,
        required: true
    },
    x: {
        type: Number,
        required: true,
        default: 0
    },  
    y: {
        type: Number,
        required: true,
        default: 0
    },

});

module.exports = mongoose.model("Motivation", MotivationSchema, "Motivation");


// add this to advice cannot redeclare block-scoped variable error
export { }