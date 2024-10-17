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
    fromDate: { type: String },
    toDate: { type: String },
    days: { type: String },
    currentTime: { type: String },
    passType:{
        type:String,
        default:"yellow"
    }
});

const Leave = mongoose.model('Pass', leaveSchema);

module.exports = {Leave};
