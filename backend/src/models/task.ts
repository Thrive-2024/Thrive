const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema({
    ownerEmail: {
        type: String,
        required: true,
    },
    taskName: {
        type: String,
        required: true,
    },
    subjectName: {
        type: String,
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    status : {
        type : String,
        required : true,
        default : "pending" //Type : pending, progress, done
    },
    notes : {
        type : String,
        default : ""
    }

});

module.exports = mongoose.model("Task", TaskSchema, "Task");


// add this to advice cannot redeclare block-scoped variable error
export { }