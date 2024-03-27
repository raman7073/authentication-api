export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: string;
  isPublic: boolean;
  bio?: string;
  photos: { [fieldname: string]: Express.Multer.File[]; } | Express.Multer.File[];
}