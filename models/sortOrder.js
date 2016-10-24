var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sortOrderSchema = new Schema({
    name:{type:String, required:true},
    owner: Schema.Types.ObjectId,
    order:[String]
});

module.exports = mongoose.model('SortOrder', sortOrderSchema);