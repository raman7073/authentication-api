import UserModel from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password-utils';
import { generateToken } from '../utils/jwt-utils';
import logger from '../utils/logger';

export default class UserService {
  private user = UserModel;

  public registerUser = async (
    email: string,
    phone: string,
    password: string,
    name: string,
    bio?: string
  ): Promise<any> => {
    try {
      const existingUser = await this.user.findOne({ email });
      if (existingUser != null) {
        logger.info("User already exist with Email ID - " + email);
        return {
          status: 409,
          message: "Email already Exists.Please Login",
        };
      }
      const hashedPassword = await hashPassword(password);
      const newUser = await this.user.create({
        email,
        phone,
        password: hashedPassword,
        name,
        bio,
      });
      logger.info("User Registered with Email ID - " + email);
      return {
        status: 201,
        message: "User Registered Successfully",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public loginUser = async (email: string, password: string): Promise<any> => {
    try {
      const existingUser = await this.user.findOne({ email });
      if (!existingUser) {
        logger.info("Account not exist for Email Id - " + email);
        return {
          status: 404,
          message: "Account not exist. Please register first.",
        };
      }
      console.log(existingUser.password);
      const isPasswordMatch = await comparePassword(password, existingUser.password);
      if (!isPasswordMatch) {
        logger.info("Authentication failed.Invalid credentials for Email Id - " + email);
        return {
          status: 401,
          message: "Authentication failed.Invalid credentials",
        };
      }
      //generate JWT token
      const token = generateToken(existingUser._id, existingUser.role);
      //logger.info("Login successfully");
      return {
        status: 200,
        message: "Login successful",
        user: existingUser,
        accessToken: token,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  public loginWithGoogle = async (email: string): Promise<any> => {
    try {
      const existingUser = await this.user.findOne({ email });
      if (!existingUser) {
        logger.info("Account not exist for Email Id - " + email);
        return {
          status: 404,
          message: "Account not exist. Please register first.",
        };
      }



    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public signOutUser = async (userId: string): Promise<any> => {
    // Implement user sign out logic here
    try {

    } catch (error: any) {
      throw new Error(error.message);
    }

  }
  public updateUserProfile =
    async (
      userId: string,
      email: string,
      phone: string,
      name: string,
      bio: string,
      password: string
    ): Promise<any> => {
      try {
        const user = await this.user.findById(userId);
        if (!user) {
          return {
            status: 404,
            message: "User not found",
          };
        }
        const existingEmailUser = await this.user.findOne({ email });
        if (existingEmailUser && existingEmailUser._id.toString() !== userId) {
          return {
            status: 409,
            message: "Email already exists for another user",
          };
        }
        user.email = email;
        user.phone = phone;
        user.name = name;
        user.bio = bio;
        user.password = await hashPassword(password);
        await user.save();
        return {
          status: 200,
          message: "User profile updated successfully",
        };
      } catch (error: any) {
        throw new Error(error.message);
      }
    }

  public uploadPhotos = async (
    userId: string,
    files: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[]; }
  ): Promise<any> => {
    try {
      const user = await this.user.findById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      //save in db and update user
      user.photos = files;

      await user.save();
      return {
        status: 200,
        message: "Photos uploaded successfully",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public setProfilePrivacy = async (
    userId: string,
    isPublic: boolean
  ): Promise<any> => {
    try {
      console.log(userId);
      const user = await this.user.findById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      user.isPublic = isPublic;
      await user.save();
      return {
        status: 200,
        message: "Privacy settings updated successfully",
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  public viewMyProfile = async (userId: string): Promise<any> => {

    try {
      const user = await this.user.findById(userId);
      if (!user) {
        return {
          status: 404,
          message: "User not found",
        };
      }
      return {
        status: 200,
        message: "User profile retrieved successfully",
        user: user,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
  public viewUserProfiles = async (
    userId: string,
    role: string
  ): Promise<any> => {
    try {
      let users;
      if (role === 'admin') {
        users = await this.user.find({});
      } else {
        users = await this.user.find({ isPublic: true });
      }
      return {
        status: 200,
        message: "User profiles retrieved successfully",
        users: users,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
