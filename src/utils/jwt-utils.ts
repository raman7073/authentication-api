import jwt from 'jsonwebtoken';

// Function to generate a JWT token
export function generateToken(userId: string, role: string): string {
    const payload = {
        userId,
        role,
    };

    // Replace 'your-secret-key' with your own secret key
    const token = jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });

    return token;
}

// Function to verify a JWT token
export function verifyToken(token: string): { userId: string, role: string } | null {
    try {
        // Replace 'your-secret-key' with your own secret key
        const decoded = jwt.verify(token, 'your-secret-key') as { userId: string, role: string };
        return decoded;
    } catch (error) {
        return null;
    }
}

// Function to extract the token from the Authorization header
export function extractTokenFromHeader(authorizationHeader: string): string | null {
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return authorizationHeader.substring(7);
    }
    return null;
}