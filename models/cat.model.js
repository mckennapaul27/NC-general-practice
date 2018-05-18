const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CatSchema = new Schema({
    name: String,
    breed: String
});
    
module.exports = mongoose.model('cats', CatSchema);