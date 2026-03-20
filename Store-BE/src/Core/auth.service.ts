import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import type { TPromisableFunc } from './utils.types.js';
import moment from 'moment';
import type { ITelegramUser, ITelegramUserNested } from '../Models/user.model.js';

export class AuthService {

    private static instance: AuthService;

    tgBotId: string | undefined = process.env.TG_BOT_ID;
    expireIn: string | undefined = process.env.EXPIRE_IN;
    secretJWT: string | undefined = process.env.SECRET_JWT;

    client: jwksClient.JwksClient = jwksClient({
        jwksUri: 'https://oauth.telegram.org/.well-known/jwks.json',
    });

    private constructor() {
        // intentionally empty
    }

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getKey = (header: any, callback: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.client.getSigningKey(header.kid, (err: (Error | null), key?: any) => {
            if (key === undefined) {
                throw new Error('Key not found');
            }
            const signingKey = key.publicKey || key.rsaPublicKey;
            callback(null, signingKey);
        });
    };

    async verify(user: ITelegramUser): Promise<string | null> {
        const result: jwt.JwtPayload | null =
            await new Promise((resolve: TPromisableFunc<jwt.JwtPayload | null>) => {
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
        user.exp = moment().add(Number(this.expireIn ?? '0'), 'days')
            .endOf('day')
            .unix() * 1000;
        return jwt.sign(user, this.secretJWT);
    }

    verifyOwnToken(token: string) {
        if (!this.secretJWT) {
            throw new Error('Secret JWT is not defined');
        }
        return new Promise((resolve: TPromisableFunc<jwt.JwtPayload | null>) => {
            jwt.verify(token, this.secretJWT!, (err: jwt.VerifyErrors | null, decoded?: string | jwt.JwtPayload) => {
                this.verificationConditions(resolve, err, decoded);
            });
        });
    }

    verificationConditions(
        resolve: TPromisableFunc<jwt.JwtPayload | null>,
        err: jwt.VerifyErrors | null,
        decoded?: string | jwt.JwtPayload,
    ) {
        if (err) {
            console.error('JWT verification failed:', err);
            resolve(null);
            return;
        }
        if (!decoded) {
            console.error('Invalid JWT: Empty');
            resolve(null);
            return;
        }
        if (typeof decoded === 'string') {
            console.error('Invalid JWT: String');
            resolve(null);
            return;
        }
        if (decoded.iss !== 'https://oauth.telegram.org') {
            console.error('Invalid JWT: Issuer mismatch');
            resolve(null);
            return;
        }
        if (!decoded?.aud || decoded.aud !== this.tgBotId) {
            console.error('Invalid JWT: ID mismatch');
            resolve(null);
            return;
        }
        if (moment(decoded.exp).isAfter(moment(Date.now()))) {
            console.error('Invalid JWT: Expired');
            resolve(null);
            return;
        }
        resolve(decoded);
    }

}

export const authService = AuthService.getInstance();
