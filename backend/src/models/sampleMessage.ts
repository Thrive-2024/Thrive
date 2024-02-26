const mongoose = require("mongoose");
const { Schema } = mongoose;

const SampleMessageSchema = new Schema({
    message: {
        type: String,
    },
});

module.exports = mongoose.model("SampleMessage", SampleMessageSchema, "SampleMessage");


// add this to advice cannot redeclare block-scoped variable error
export { }