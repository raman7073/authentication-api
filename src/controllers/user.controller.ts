import { Request, NextFunction, Response } from "express";
import UserService from "../services/user.service";
import logger from "../utils/logger";

export class UserController {
  private userService: UserService = new UserService();

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const { email, phone, password, name, bio } = req.body;
      const users = await this.userService.registerUser(
        email,
        phone,
        password,
        name,
        bio);
      //res.status(res.status).json(users);
      return res.status(201).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const users = await this.userService.loginUser(email, password);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public loginWithGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const { email } = req.body;
      const users = await this.userService.loginWithGoogle(email);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const { userId, email, phone, name, bio, password } = req.body;
      const users = await this.userService.updateUserProfile(userId, email, phone, name, bio, password);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public uploadPhotos = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { userId } = req.body;
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Please upload photos again" });
      }
      const users = await this.userService.uploadPhotos(userId, req.files);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  public setProfilePrivacy = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const { userId, isPublic } = req.body;
      const users = await this.userService.setProfilePrivacy(userId, isPublic);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public viewMyProfile = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const userId = (req.user as { id: string }).id;
      const users = await this.userService.viewMyProfile(userId);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  public viewUserProfiles = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<Response | void> => {
    try {
      const userId = (req.user as { id: string }).id;
      const role = (req.user as { role: string }).role;
      const users = await this.userService.viewUserProfiles(userId, role);
      return res.status(200).json(users);
    } catch (error) {
      logger.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

}