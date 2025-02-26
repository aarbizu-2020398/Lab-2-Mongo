import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'USER_ROLE'], 
        default: 'USER_ROLE' 
    },
    estado: {
        type: Boolean,
        default: true 
    }
});

export default mongoose.model('User', userSchema);