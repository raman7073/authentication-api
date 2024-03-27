import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import HttpException from '../utils/exceptions/http.exception';

async function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    // Extract the JWT token from the request headers or cookies
    const accessToken = req.headers.auth as string;
    console.log('accessToken', accessToken);

    if (accessToken == null) {
        return next(new HttpException(401, "Unauthorised"));
    }
    if (accessToken) {
        try {
            // Verify and decode the JWT token
            const decodedToken = jwt.verify(accessToken, 'your-secret-key') as JwtPayload;

            // Add the role and id to the req.user object
            req.user = {
                role: decodedToken.role,
                id: decodedToken.userId,
            };
            console.log('req.user', req.user);
            // Check if user role is allowed
            //const userRole = (req.user as User).role;

            //  if (allowedRoles.includes(userRole)) {
            // User role is allowed, proceed to the next middleware or route handler
            next();
            //} else {
            // User role is not allowed, return 403 Forbidden status
            //   res.sendStatus(403);
            //}
        } catch (error) {
            // Invalid token, return 401 Unauthorized status
            res.sendStatus(401);
        }
    } else {
        // Token not found, return 401 Unauthorized status
        res.sendStatus(401);
    }
};
export default authMiddleware;