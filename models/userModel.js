const {Schema, model} = require('mongoose'); //importing specific libraries from mongoose, instead of mongoose.Schema etc

let user = new Schema({
    userName: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: false}
}, {
    toObject: {
        virtuals: true
    }
})
module.exports = model('users', user);