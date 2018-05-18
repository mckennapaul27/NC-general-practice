const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    username: String
});
    
module.exports = mongoose.model('users', userSchema);