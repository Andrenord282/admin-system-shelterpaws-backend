const authService = require('../services/authService');

class AuthController {
    signUp = async (req, res, next) => {
        try {
            const { body } = req;
            const user = await authService.signUp(body);

            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                Partitioned: true,
            });

            delete user.refreshToken;

            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    signIn = async (req, res, next) => {
        try {
            const { body } = req;

            const user = await authService.signIn(body);

            res.cookie('refreshToken', user.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                Partitioned: true,
            });

            delete user.refreshToken;

            res.json(user);
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;

            const refreshUser = await authService.refresh(refreshToken);
            res.cookie('refreshToken', refreshUser.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                Partitioned: true,
            });
            delete refreshUser.refreshToken;

            res.json(refreshUser);
        } catch (error) {
            console.log(error);
            next(error);
        }
    };

    signOut = async (req, res, next) => {
        try {
            const { refreshToken } = req.cookies;
            await authService.signOut(refreshToken);
            res.clearCookie('refreshToken');

            res.json({ message: 'Пользователь вышел' });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new AuthController();
