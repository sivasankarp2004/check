const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    photo: {
        type: String,
    },
    wardenName: {
        type: String,
    },
    wardenPhone: {
        type: String,
        match: /^[0-9]{10}$/
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'both']
    },
    hostel: {
        type: String,
        enum: ['boyshostel', 'girlshostel']
    },
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,
    }
});

const Warden = mongoose.model('Warden', userSchema);

module.exports = {Warden};
