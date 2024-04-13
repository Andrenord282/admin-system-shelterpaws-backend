const { errorHandler } = require('../shared/utilities/errorHandler');
const { encryptPassword, checkPassword } = require('../shared/utilities/passwordHandler');
const userModel = require('../models/user');
const getUserDto = require('../dto/getUserDto');
const jwtServices = require('../services/jwtService');

class AuthServices {
    signUp = async (body) => {
        const { 'user-name': userName, 'user-email': userEmail, 'user-password': userPassword } = body;

        const userEmailExists = await userModel.findOne({ userEmail });
        const userNameExists = await userModel.findOne({ userName });
        const errorLogList = [];

        if (userEmailExists) {
            errorLogList.push({
                type: 'Failed to register a user',
                name: 'user-email',
                message: 'email is already registered.',
            });
        }

        if (userNameExists) {
            errorLogList.push({
                type: 'Failed to register a user',
                name: 'user-name',
                message: 'user name already exists.',
            });
        }

        if (errorLogList.length > 0) {
            throw errorHandler.errorRequest('Error sign-up', 'Failed to register a user', errorLogList);
        }

        const hachingPassword = await encryptPassword(userPassword);

        const user = await userModel.create({
            userEmail,
            userName,
            passwordHashed: hachingPassword,
        });

        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });
        await jwtServices.saveRefreshJWT(userDto.userID, tokens.refreshToken);
        return { ...userDto, ...tokens };
    };

    signIn = async (body) => {
        const { 'user-email': userEmail, 'user-password': userPassword } = body;
        const user = await userModel.findOne({ userEmail });
        const errorLogList = [];
        if (!user) {
            errorLogList.push({
                type: 'Failed to sign in.',
                name: 'user-email',
                message: 'email address is not registered.',
            });
            throw errorHandler.errorRequest('Error sign-in', 'Failed to sign-in a user', errorLogList);
        }

        const isCorrectPassword = await checkPassword(userPassword, user.passwordHashed);

        if (!isCorrectPassword) {
            errorLogList.push({
                type: 'Failed to sign in.',
                name: 'user-password',
                message: 'email or password do not match.',
            });
            throw errorHandler.errorRequest('Error sign-in', 'Failed to sign-in a user', errorLogList);
        }
        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });

        await jwtServices.saveRefreshJWT(userDto.userID, tokens.refreshToken);
        return { ...tokens, ...userDto };
    };

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw errorHandler.errorRequest('Error refresh token', 'Refresh token not found');
        }
        const userData = jwtServices.validateRefreshToken(refreshToken);
        const tokenData = await jwtServices.searchToken(refreshToken);

        if (!userData) {
            throw errorHandler.errorRequest('Error refresh token', 'Refresh token failed validation');
        }

        if (!tokenData) {
            throw errorHandler.errorRequest('Error refresh token', 'Refresh token not found in database');
        }

        const user = await userModel.findById(userData.userID);
        const userDto = getUserDto(user);
        const tokens = jwtServices.generateJWT({ ...userDto });

        await jwtServices.saveRefreshJWT(userDto.userID, tokens.refreshToken);
        return { ...tokens, ...userDto };
    }

    signOut = async (refreshToken) => {
        const token = await jwtServices.removeToken(refreshToken);
        return token;
    };
}

module.exports = new AuthServices();
