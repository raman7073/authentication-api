import express from "express";
import { UserController } from "../controllers/user.controller";
import userValidation from "../validators/user.validation";
import { authMiddleware, upload, validationMiddleware, errorMiddleware } from "../middlewares";
const userRouter = express.Router();
const userController = new UserController();

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     accessToken:
 *       type: apiKey
 *       in: header
 *       name: auth
 */
/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         isPublic:
 *           type: boolean
 *         bio:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - role
 *         - isPublic
 *         - bio
 */

/**
 * @openapi
 * /api/user/register:
 *   post:
 *     summary: register a new user
 *     tags: [User]
 *     description: Endpoint to create a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.post(
  "/register",
  validationMiddleware(userValidation.registerUser),
  userController.register
);

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *       required:
 *         - email
 *         - password
 *     LoginResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: number
 *           example: 200
 *         message:
 *           type: string
 *           example: "Login successful"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         accessToken:
 *           type: string
 *           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxMjIzNjU0MzQ1"
 */

/**
 * @openapi
 * /api/user/login:
 *   post:
 *     summary: login a user
 *     tags: [User]
 *     description: Endpoint to login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.post(
  "/login",
  validationMiddleware(userValidation.loginUser),
  userController.login
);

/**
 * @openapi
 * /api/user/upload-photos:
 *   patch:
 *     summary: upload user photos
 *     tags: [User]
 *     description: Endpoint to upload user photos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Photos uploaded successfully"
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.patch(
  "/upload-photos",
  authMiddleware,
  upload.array("photos"),
  validationMiddleware(userValidation.uploadPhotos),
  userController.uploadPhotos
);

/**
 * @openapi
 * /api/user/set-profile-privacy:
 *   patch:
 *     summary: set user profile privacy
 *     tags: [User]
 *     description: Endpoint to set user profile privacy.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                type: string
 *               isPublic:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Profile privacy updated successfully"
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */
userRouter.patch(
  "/set-profile-privacy",
  authMiddleware,
  validationMiddleware(userValidation.setProfilePrivacy),
  userController.setProfilePrivacy
);

/**
 * @openapi
 * /api/user/view-my-profile:
 *   get:
 *     summary: view user profile
 *     tags: [User]
 *     description: Endpoint to view user profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

userRouter.get(
  "/view-my-profile",
  authMiddleware,
  userController.viewMyProfile
);
/**
 * @openapi
 * /api/user/view-user-profiles:
 *   get:
 *     summary: view user profile
 *     tags: [User]
 *     description: Endpoint to view user profile.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

userRouter.get(
  "/view-user-profiles",
  authMiddleware,
  userController.viewUserProfiles
);


export default userRouter;
