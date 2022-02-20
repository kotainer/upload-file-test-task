import { Model } from 'mongoose';
import { IUser } from '../user.type';
import { IAccessTokens } from '../tokens.type';

export interface IUserModel extends Model<IUser> {
    findByLogin(login: string): Promise<IUser>;
    loginExists(login: string): Promise<boolean>;
    updateTokens(refreshToken: string): Promise<IAccessTokens>;
}