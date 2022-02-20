import * as mongoose from 'mongoose';
import * as config from 'config';
import * as crypto from 'crypto';
import * as uuid from 'uuid';

import { IUser } from '../types/user.type';
import { IUserModel } from '../types/models/user-model.type';
import { IAccessTokens } from '../types/tokens.type';
import { CacheService } from '../services/cache.service';
import { AUTH_TOKEN_KEY, ONE_HOUR_IN_SECONDS } from '../consts/system';

const schema: mongoose.Schema<IUser> = new mongoose.Schema({
    _id: { type: String, default: uuid.v4 },

    login: { type: String, required: true },

    _accessToken: { type: String },
    refreshToken: { type: String },
    passwordHash: { type: String },
    salt: { type: String },

    createdAt: { type: Number, default: Date.now },
    updatedAt: { type: Number, default: Date.now },
});

schema
    .virtual('password')
    .set(function (this: IUser, password: string) {
        this._plainPassword = password;

        if (password) {
            this.salt = crypto.randomBytes(4).toString('hex');
            this.passwordHash = crypto
                .pbkdf2Sync(
                    password,
                    Buffer.from(this.salt, 'binary'),
                    10000,
                    64,
                    'sha1',
                )
                .toString('base64');
        } else {
            this.salt = '';
            this.passwordHash = '';
        }
    })

    .get(function (this: IUser) {
        return this._plainPassword;
    });

schema.methods.checkPassword = function (
    this: IUser,
    password: string,
): boolean {
    if (!password) {
        return false;
    }

    if (!this.passwordHash) {
        return false;
    }

    return (
        crypto
            .pbkdf2Sync(
                password,
                Buffer.from(this.salt, 'binary'),
                10000,
                64,
                'sha1',
            )
            .toString('base64') === this.passwordHash
    );
};

schema.methods.generateAccessTokens = async function (
    this: IUser,
): Promise<IAccessTokens> {
    const cacheService = CacheService.getInstance();

    await cacheService.clear(`${AUTH_TOKEN_KEY}_${this._accessToken}`);

    this._accessToken = crypto.randomBytes(36).toString('hex');
    this.refreshToken = crypto.randomBytes(48).toString('hex');

    await this.save();

    await cacheService.save(
        `${AUTH_TOKEN_KEY}_${this._accessToken}`,
        this.toSafeObject(),
        ONE_HOUR_IN_SECONDS,
    );

    return {
        accessToken: this._accessToken,
        refreshToken: this.refreshToken,
    };
};

schema.methods.generateRefreshToken = async function (
    this: IUser,
): Promise<string> {
    this.refreshToken = crypto.randomBytes(48).toString('hex');

    await this.save();

    return this.refreshToken;
};

schema.methods.toSafeObject = function (this: IUser): Partial<IUser> {
    return {
        id: this._id,
        login: this.login,
    };
};

schema.methods.logout = async function (this: IUser): Promise<void> {
    const cacheService = CacheService.getInstance();

    await cacheService.clear(`${AUTH_TOKEN_KEY}_${this._accessToken}`);

    this._accessToken = '';
    this.refreshToken = '';

    await this.save();
};

/**
 * Проверка существования пользователя с таким логином
 * @param {String} login логин пользователя
 */
schema.statics.loginExists = async (login: string): Promise<boolean> => {
    const user = await UserModel.findOne({ login }).lean();

    return !!user;
};

/**
 * Поиск пользователя по логину
 * @param {String} login логин пользователя
 */
schema.statics.findByLogin = async (login: string): Promise<IUser> => {
    const user = await UserModel.findOne({ login });

    if (!user) {
        throw {
            status: 404,
            message: 'Пользователя с таким логином не существует',
        };
    }

    return user;
};

/**
 * Обновление токенов доступа
 * @param {String} refreshToken email пользователя
 */
schema.statics.updateTokens = async (
    refreshToken: string,
): Promise<IAccessTokens> => {
    if (!refreshToken || refreshToken.length < 20) {
        throw {
            status: 401,
            message: 'Неверный токен',
        };
    }

    const user = await UserModel.findOne({ refreshToken });

    if (!user) {
        throw {
            status: 401,
            message: 'Неверный токен',
        };
    }

    return user.generateAccessTokens();
};

const UserModel = mongoose.model<IUser, IUserModel>(
    `${config.get('db.prefix')}Users`,
    schema,
);

export default UserModel;
