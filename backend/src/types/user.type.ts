import * as mongoose from 'mongoose';
import { IAccessTokens } from './tokens.type';

export interface IUser extends mongoose.Document {
    _id: string;
    login: string;

    createdAt: number;
    updatedAt: number;

    passwordHash: string;
    salt: string;
    password: string;
    refreshToken: string;

    _plainPassword: string;
    _accessToken: string;

    checkPassword(this: IUser, password: string): boolean;
    generateAccessTokens(this: IUser): Promise<IAccessTokens>;
    generateRefreshToken(this: IUser): Promise<string>;
    logout(this: IUser): Promise<void>;
    toSafeObject(this: IUser): Partial<IUser>;
}
