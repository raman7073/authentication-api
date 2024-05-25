import e, { Request, NextFunction, Response } from "express";
import ContactService from "../services/contact.service";
export class ContactController {
  private contactService = new ContactService();
  public addContact = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const {
        phoneNumber,
        email,
      } = req.body;
      const contact = await this.contactService.addContact(email, phoneNumber);
      res.status(200).json({ contact });
    } catch (error) {
      next(error);
    }
  };
}