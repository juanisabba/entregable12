const mongoose = require("mongoose");

//MONGODB CONFIG
const db = mongoose.connect(process.env.MONGODB, 
{ useNewUrlParser: true })

const chatSchema = new mongoose.Schema({
    author: {type: Object, required: true },
    text: {type: String, required: true},
    time: {type: String, required: true}
}, {
    versionKey: false 
})
const msgsModel = mongoose.model("Msgs", chatSchema);

module.exports = {db, msgsModel}
