import express from "express";
import { ContactController } from "../controllers/contact.controller";
import contactValidation from "../validators/contact.validation";
import { validationMiddleware } from "../middlewares";
const contactRouter = express.Router();
const contactController = new ContactController();


contactRouter.post(
  "/identify",
  validationMiddleware(contactValidation.contact),
  contactController.addContact
);


export default contactRouter;
