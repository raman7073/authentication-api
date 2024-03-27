import Joi from "joi";

const registerUser = Joi.object({
    email: Joi.string().required().email(),
    name: Joi.string().required().max(30),
    phone: Joi.string().required().max(30),
    password: Joi.string().required().min(6),
});
const loginUser = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
});

const setProfilePrivacy = Joi.object({
    userId: Joi.string().required(),
    isPublic: Joi.boolean().required(),
});
const uploadPhotos = Joi.object({
    userId: Joi.string().required(),
});
export default {
    registerUser,
    loginUser,
    setProfilePrivacy,
    uploadPhotos,
};
