var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName:{type:String,required:true},
    lastName: {type:String, required:true},
    name: String,
    email: {type:String, required:true, index:{unique:true}},
    password:{type:String,required:true, select:false}
});

UserSchema.pre('save', function(next) {
    var user = this;

    // hash the password only if the password has been changed or user is new
    if (!user.isModified('password')) return next();

    // generate the hash
    bcrypt.hash(user.password, null, null, function(err, hash) {
        if (err) return next(err);

        // change the password to the hashed version
        user.password = hash;
        next();
    });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
    var user = this;
    console.log(JSON.stringify(user));
    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);