const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  title: { type: String, required: true },
  firm: { type: mongoose.Schema.Types.ObjectId, ref: 'Firm', required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  description: { type: String },
  fee: { type: String },
  editorNotes: { type: String },
  contact: {
    phone: { type: String },
    email: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Tour', tourSchema);
