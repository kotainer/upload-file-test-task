import UserModel from '../models/user.model';
import { Context } from 'koa';

export class UsersController {
    public async me(ctx: Context) {
        ctx.body = ctx.user;
    }

    /**
     * Регистрация нового пользователя
     *
     * Если есть логин пригласившего:
     *  1. Проверяем логина пригласившего
     *  2. Создаем нового юзера
     *
     * Нет логина пригласившего:
     *  1. Случайно находим чувака который будет родителем
     *  2. Создаем нового юзера
     * @param {String} login логин пользователя
     * @param {String} password пароль пользователя
     */
    public async register(ctx: Context) {
        const params = {
            ...ctx.request.body,
        };

        const user = await UserModel.create(params);
        const tokens = await user.generateAccessTokens();

        ctx.body = {
            result: true,
            data: {
                ...user.toSafeObject(),
                ...tokens,
            },
        };
    }

    /**
     * Авторизация пользователя
     *
     * Делает запись в кэш с данными полученного токена, для дальнейшей авторизации по нему.
     * Время жизни кэша 1 день
     * @param {String} login логин пользователя
     * @param {String} password пароль пользователя
     */
    public async login(ctx: Context) {
        const login = ctx.request.body.login.trim().toLowerCase();
        const user = await UserModel.findByLogin(login);

        if (!user) {
            throw {
                status: 400,
                message: 'Такого пользователя не существует или пароль неверен',
            };
        }

        if (!user.checkPassword(ctx.request.body.password)) {
            throw {
                status: 400,
                message: 'Такого пользователя не существует или пароль неверен',
            };
        }

        const tokens = await user.generateAccessTokens();

        ctx.body = {
            result: true,
            data: {
                ...user.toSafeObject(),
                ...tokens,
            },
        };
    }

    /**
     * Выход
     */
    public async logout(ctx: Context) {
        const user = await UserModel.findByLogin(ctx.user.login);

        await user.logout();

        ctx.body = {
            result: true,
        };
    }

    /**
     * Обновление токена доступа
     */
    public async refreshToken(ctx: Context) {
        const tokens = await UserModel.updateTokens(
            ctx.request.body.refreshToken,
        );

        ctx.body = {
            result: true,
            data: tokens,
        };
    }
}
