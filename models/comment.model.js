const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    name: String,
    made_by: Schema.Types.ObjectId,
    made_about: Schema.Types.ObjectId,
    body: String
});
    
module.exports = mongoose.model('comments', CommentSchema);