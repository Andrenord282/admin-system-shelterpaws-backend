const { errorHandler } = require('../shared/utilities/errorHandler');
const { encryptPassword, checkPassword } = require('../shared/utilities/passwordHandler');
const userModel = require('../models/user');
const getUserDto = require('../dto/getUserDto');
const jwtServices = require('../services/jwtService');

class AuthServices {
    logUp = async (body) => {
        const { 'user-name': userName, 'user-email': userEmail, 'user-password': userPassword } = body;

        const userEmailExists = await userModel.findOne({ userEmail });
        const userNameExists = await userModel.findOne({ userName });
        const errorLog = [];

        if (userEmailExists) {
            errorLog.push({ name: 'userEmailExists', field: 'user-email', message: 'mail is already registered.' });
        }

        if (userNameExists) {
            errorLog.push({ name: 'userNameExists', field: 'user-name', message: 'user name already exists.' });
        }

        if (errorLog.length > 0) {
            throw errorHandler.errorRequest('Error log-up', 'Failed to register a user', errorLog);
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
}

module.exports = new AuthServices();
