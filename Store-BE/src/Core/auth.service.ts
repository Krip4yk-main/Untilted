import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import type { TPromisableFunc } from './utils.types.js';
import moment from 'moment';
import type { ITelegramUser, ITelegramUserNested } from '../Models/user.model.js';

class AuthService {

    tgBotId: string | undefined = process.env.TG_BOT_ID;
    expireIn: string | undefined = process.env.EXPIRE_IN;
    secretJWT: string | undefined = process.env.SECRET_JWT;

    client: jwksClient.JwksClient = jwksClient({
        jwksUri: 'https://oauth.telegram.org/.well-known/jwks.json',
    });

    getKey = (header: any, callback: any) => {
        this.client.getSigningKey(header.kid, (err: (Error | null), key?: any) => {
            if (key === undefined) {
                throw new Error('Key not found');
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    async verify(user: ITelegramUser): Promise<string | null> {
        const result: boolean =
            await new Promise((resolve: TPromisableFunc<boolean>) => {
                jwt.verify(
                    user.id_token,
                    this.getKey,
                    { algorithms: ['RS256'] },
                    (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
                        this.verificationConditions(resolve, err, decoded);
                    },
                );
            });
        if (!result) {
            return null;
        }
        return this.createOwnToken(user.user);
    }

    createOwnToken(user: ITelegramUserNested) {
        if (!this.secretJWT) {
            throw new Error('Secret JWT is not defined');
        }
        user.exp = moment().add(Number(this.expireIn ?? '1'), 'hours')
            .unix();
        return jwt.sign(user, this.secretJWT);
    }

    verifyOwnToken(token: string) {
        if (!this.secretJWT) {
            throw new Error('Secret JWT is not defined');
        }
        return new Promise((resolve: TPromisableFunc<boolean>) => {
            jwt.verify(token, this.secretJWT!, (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
                this.verificationConditions(resolve, err, decoded);
            });
        });
    }

    verificationConditions(resolve: TPromisableFunc<boolean>, err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) {
        if (err) {
            console.error('JWT verification failed:', err);
            resolve(false);
            return;
        }
        if (!decoded) {
            console.error('Invalid JWT: Empty');
            resolve(false);
            return;
        }
        if (typeof decoded === 'string') {
            console.error('Invalid JWT: String');
            resolve(false);
            return;
        }
        if (decoded.iss !== 'https://oauth.telegram.org') {
            console.error('Invalid JWT: Issuer mismatch');
            resolve(false);
            return;
        }
        if (!decoded?.aud || decoded.aud !== this.tgBotId) {
            console.error('Invalid JWT: ID mismatch');
            resolve(false);
            return;
        }
        if (moment(decoded.exp).isAfter(moment(Date.now()))) {
            console.error('Invalid JWT: Expired');
            resolve(false);
            return;
        }
        resolve(true);
    }

}

export const authService = new AuthService();
