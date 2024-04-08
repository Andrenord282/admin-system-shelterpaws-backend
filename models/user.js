const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        userName: {
            type: String,
            require: true,
            unique: true,
        },
        passwordHashed: {
            type: String,
            require: true,
        },
        userEmail: {
            type: String,
            require: true,
            lowercase: true,
            unique: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = model('User', userSchema);
