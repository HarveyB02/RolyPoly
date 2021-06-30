const mongoose = require('mongoose');

module.exports = mongoose.model('ban', new mongoose.Schema({
    userID: { type: String },
    guildID: { type: String },
    expires: { type: Date }
}));