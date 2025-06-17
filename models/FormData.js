// models/FormData.js
import mongoose from 'mongoose';

const formDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true }, // e.g. "acme"
  formType: { type: String, required: true }, // e.g. "character-creator"
  data: { type: Object, required: true }, // dynamic form data
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

formDataSchema.index({ userId: 1, formType: 1 }); // for faster lookups

export default mongoose.model('FormData', formDataSchema);
