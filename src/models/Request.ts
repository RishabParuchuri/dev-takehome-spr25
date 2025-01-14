import mongoose, { Schema, model, models } from 'mongoose';

const requestSchema = new mongoose.Schema({
    requestorName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    itemRequested: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 100,
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed', 'approved', 'rejected'],
        default: 'pending',
    }
}, { timestamps: true });

const Request = mongoose.models.Request || model('Request', requestSchema);

export default Request;