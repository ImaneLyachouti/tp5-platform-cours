const mongoose = require("mongoose");
const TeacherSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  bio: { type: String },
  cours: { type: [String], default: [] },
});
module.exports = mongoose.model("Teacher", TeacherSchema);
