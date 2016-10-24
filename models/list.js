var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ListSchema = new Schema({
    name: {type:String, required:true},
    items:[{name:String, category:String, completed:{type:Boolean, default:false, required:true}, note:String, modified:{type: Number, default:Date.now()}}],
    owner: Schema.Types.ObjectId,
    created: {type:Number, default: Date.now()},
    shared: {type:Boolean, default:false},
    sharedWith: [{type:Schema.Types.ObjectId, unique:true, ref:'User'}],
    selectedCategorySortOrder: {type:Schema.Types.ObjectId, ref:'SortOrder'}
});

ListSchema.pre('save', function (next) {
var list = this;
    if (list.isModified()){

    }

    next();
});

module.exports = mongoose.model('List',ListSchema);