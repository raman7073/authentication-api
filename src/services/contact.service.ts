import { Op } from "sequelize";
import { Contact } from "../models/contact.model";
import { IdentifyResponse } from "../interfaces/contact.interface";
export default class ContactService {
  public async addContact(
    email?: string,
    phoneNumber?: string
  ): Promise<IdentifyResponse> {
    try {
      if (!email && !phoneNumber) {
        throw new Error("Email or Phone Number is required");
      } else if (email && phoneNumber === null) {
        const contact = await Contact.findByEmail(email);
        if (!contact) {
          await Contact.createContact(email, phoneNumber);
        }
      } else if (phoneNumber && email === null) {
        const contact = await Contact.findByPhoneNumber(phoneNumber);
        if (!contact) {
          await Contact.createContact(email, phoneNumber);
        }
      } else {
        const existingContact = await Contact.findByEmailAndPhoneNumber(email!, phoneNumber!);
        if (!existingContact) {
          const [ifEmailExists, ifPhoneNumberExists] = await Promise.all([
            Contact.findByEmail(email!),
            Contact.findByPhoneNumber(phoneNumber!)
          ]);
          if (!ifEmailExists || !ifPhoneNumberExists) {
            await Contact.createContact(email, phoneNumber);
          }
          const ifSeperateContact = await Contact.findAllByEmailOrPhoneNumber(email!, phoneNumber!);
          if (ifSeperateContact.length >= 2) {
            const linkedId = ifSeperateContact[0].dataValues.id;
            const secondaryContactIds = ifSeperateContact.slice(1).map((contact: Contact) => contact.id);
            await Contact.updateLinkedPrecedence(linkedId, secondaryContactIds);
          }
        }
      }
      return await this.getLinkedContacts(email, phoneNumber);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  private async getLinkedContacts(
    email?: string,
    phoneNumber?: string
  ): Promise<IdentifyResponse> {
    try {
      let linkedContact: Contact | null;
      if (email && phoneNumber) {
        linkedContact = await Contact.findByEmailOrPhoneNumber(email, phoneNumber);
      } else if (email) {
        linkedContact = await Contact.findByEmail(email);
      } else {
        linkedContact = await Contact.findByPhoneNumber(phoneNumber!);
      }
      const primaryContactId: number = linkedContact!.dataValues.linkedPrecedence === "primary" ? linkedContact!.dataValues.id : linkedContact!.dataValues.linkedId;
      const contacts = await Contact.findAll({
        where: {
          [Op.or]: [{ id: primaryContactId }, { linkedId: primaryContactId }]
        },
        order: [["createdAt", "ASC"]],
      });

      const emails: string[] = [...new Set(contacts.filter((contact: Contact) => contact.email !== null).map((contact: Contact) => contact.email!))];
      const phoneNumbers: string[] = [...new Set(contacts.filter((contact: Contact) => contact.phoneNumber).map((contact: Contact) => contact.phoneNumber!))];
      const secondaryContactIds: number[] = contacts.filter((contact: Contact) => contact.linkedPrecedence === "secondary").map((contact: Contact) => contact.id);

      const contact: IdentifyResponse = {
        primaryContactId,
        emails,
        phoneNumbers,
        secondaryContactIds
      }

      return contact;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
