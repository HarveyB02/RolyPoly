const mongoose = require('mongoose');
const config = require('../../config');

module.exports = mongoose.model('guild', new mongoose.Schema({
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    roleColour: { type: String, default: config.subjectRoleColour },
    modChannelID: { type: String },
    botChannelID: { type: String }
}));