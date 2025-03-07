const mongoose = require("mongoose");
const StudentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  cours: { type: [String], default: [] },
});

module.exports = mongoose.model("Student", StudentSchema);
