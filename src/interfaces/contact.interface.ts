export interface IContact {
  id: number;
  phoneNumber?: string;
  email?: string;
  linkedId?: number;
  linkedPrecedence: "primary" | "secondary";
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IdentifyResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}
