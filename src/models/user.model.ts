import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import validator from 'validator';

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    bio: {
        type: String
    },
    photos: {
        type: Array<File>,
    }
});

const UserModel: Model<IUser & Document<any, any, any>> = mongoose.model<IUser & Document<any, any, any>>('User', userSchema as unknown as Schema<IUser & Document<any, any, any>>);

export default UserModel;
