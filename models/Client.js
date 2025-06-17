// models/Client.js
import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  // Store form data under "subjects"
  subjects: {
    type: mongoose.Schema.Types.Mixed, // Fully dynamic structure
    default: {},
  }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
