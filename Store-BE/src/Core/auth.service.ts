import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import type { TPromisableFunc } from './utils.types.js';

class AuthService {

    client: jwksClient.JwksClient = jwksClient({
        jwksUri: 'https://oauth.telegram.org/.well-known/jwks.json',
    });

    getKey = (header: any, callback: any) => {
        this.client.getSigningKey(header.kid, (err: (Error | null), key?: any) => {
            if (key === undefined) {
                callback(null, null);
                return;
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    verify(token: string): Promise<boolean> {
        return new Promise((resolve: TPromisableFunc<boolean>, reject: TPromisableFunc<boolean>) => {
            jwt.verify(
                token,
                this.getKey,
                { algorithms: ['RS256'] },
                (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
                    if (err) {
                        console.error('JWT verification failed:', err);
                        reject(false);
                    }
                    if (!decoded) {
                        console.error('Invalid JWT');
                        reject(false);
                        return;
                    }
                    if (typeof decoded === 'string') {
                        console.error('Invalid JWT string');
                        reject(false);
                        return;
                    }
                    if (decoded.iss !== 'https://oauth.telegram.org') {
                        console.error('Invalid JWT');
                        reject(false);
                        return;
                    }
                    if (!decoded?.aud || decoded.aud !== process.env.TG_BOT_ID) {
                        console.error('Invalid JWT');
                        reject(false);
                        return;
                    }
                    resolve(true);
                },
            );
        });
    }

}

export const authService = new AuthService();
