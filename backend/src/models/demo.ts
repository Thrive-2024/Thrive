const mongoose = require("mongoose");
const { Schema } = mongoose;

const DemoSchema = new Schema({
    demoID: {
        type: String,
        required: true
    },
    dateTime: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },

});

module.exports = mongoose.model("Demo", DemoSchema, "Demo");


// add this to advice cannot redeclare block-scoped variable error
export { }