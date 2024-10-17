const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    Id:{type:String,require},
    name: { type: String},
    regNo: { type: String},
    gender: { type: String },
    year: { type: String },
    department: { type: String },
    roomNo: { type: String },
    phone: { type: String, },
    parentsno: { type: String },
    reason: { type: String },
    fromTime: { type: String },
    toTime: { type: String },
    Hours: { type: String },
    currentTime: { type: String },
    passType:{
        type:String,
        default:"Regular"
    }
});

const RLeave = mongoose.model('Regular', leaveSchema);

module.exports = {RLeave};
