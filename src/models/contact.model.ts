import { IContact } from "../interfaces/contact.interface";
import { sequelize } from "../db";
import { DataTypes, Model } from "sequelize";
import { Op } from 'sequelize';

export class Contact extends Model implements IContact {
    public id!: number;
    public phoneNumber?: string;
    public email?: string;
    public linkedId?: number;
    public linkedPrecedence: "primary" | "secondary" = "primary";
    public createdAt!: Date;
    public updatedAt!: Date;
    public deletedAt?: Date;

    static async createContact(email?: string, phoneNumber?: string): Promise<Contact> {
        return await Contact.create({ email, phoneNumber });
    }
    static async findByEmail(email: string): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                email
            }
        });
    }
    static async findByPhoneNumber(phoneNumber: string): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                phoneNumber
            }
        });
    }
    static async findByEmailOrPhoneNumber(email: string, phoneNumber: string): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { phoneNumber }
                ]
            }
        });
    }
    static async findByEmailAndPhoneNumber(email: string | null, phoneNumber: string | null): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                email,
                phoneNumber
            }
        });
    }
    static async findByEmailAndPhoneNull(email: string): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                email,
                phoneNumber: null
            }
        });
    }
    static async findByPhoneAndEmailNull(phoneNumber: string): Promise<Contact | null> {
        return await Contact.findOne({
            where: {
                phoneNumber,
                email: null
            }
        });
    }
    static async findAllByEmailOrPhoneNumber(email?: string, phoneNumber?: string): Promise<Contact[]> {
        return await Contact.findAll({
            where: {
                [Op.or]: [
                    { email: email },
                    { phoneNumber: phoneNumber }
                ],
            },
            order: [["createdAt", "ASC"]],
        });
    }
    static async updateLinkedPrecedence(linkedId: number, secondaryContactIds: number[]): Promise<[affected: number]> {
        const res = await Contact.update({ linkedId }, {
            where: {
                id: {
                    [Op.in]: secondaryContactIds
                }
            }
        });
        return res;
    }
}

Contact.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    linkedId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    linkedPrecedence: {
        type: DataTypes.ENUM("primary", "secondary"),
        defaultValue: "primary",
        set(value: string) {
            if (this.linkedId) {
                this.setDataValue("linkedPrecedence", "secondary");
            } else {
                this.setDataValue("linkedPrecedence", "primary");
            }
        },
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: "Contact",
});

Contact.beforeCreate(async (contact) => {
    try {
        let result: Contact | null;
        if (contact.email && contact.phoneNumber === null) {
            result = await Contact.findByEmail(contact.email);
        } else if (contact.phoneNumber && contact.email === null) {
            result = await Contact.findByPhoneNumber(contact.phoneNumber);
        } else {
            result = await Contact.findByEmailOrPhoneNumber(contact.email!, contact.phoneNumber!);
        }

        if (result) {
            contact.linkedPrecedence = "secondary";
            contact.linkedId = result.dataValues.linkedPrecedence === "primary" ? result.dataValues.id : result.dataValues.linkedId;
        }
    } catch (error) {
        console.error("Error executing query:", error);
    }
});
