import Joi from "joi";

const contact = Joi.object({
    email: Joi.string().email().allow(null),
    phoneNumber: Joi.number().allow(null)
});
export default {
    contact,
};

