const mongoose = require('mongoose');
const config = require('../../config');

module.exports = mongoose.model('guild', new mongoose.Schema({
    id: { type: String },
    prefix: { type: String, default: config.prefix },
    roleColour: { type: String, default: config.subjectRoleColour },
    modChannelName: { type: String, default: config.modChannelName },
    botChannelNames: { type: [String] },
    allowListToggle: { type: Boolean, default: false },
    courses: { type: [String] }
}));