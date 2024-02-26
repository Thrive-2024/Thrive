const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    friends: {
        type: Array,
        default: []
    },

});
// Instance method to add a friend
UserSchema.methods.addFriend = function(friendId : any) {
    // Check if friendId already exists to avoid duplicates
    if (!this.friends.includes(friendId)) {
        this.friends.push(friendId); // Add friendId to the friends array
        return this.save(); // Save the document with the updated friends array
    }
    // Optionally, you could handle the case where the friend is already in the list
    // For simplicity, this example just returns the unchanged document
    return Promise.resolve(this);
};

module.exports = mongoose.model("User", UserSchema, "User");


// add this to advice cannot redeclare block-scoped variable error
export { }