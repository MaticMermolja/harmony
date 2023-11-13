const mongoose = require('mongoose');
const validator = require('validator');
const Utils = require('../utils/passwordUtils.js');
const Schema = mongoose.Schema;

/**
 * @openapi
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        properties:
 *          firstName:
 *            type: string
 *            description: First name of the user
 *            example: Janez
 *          lastName:
 *            type: string
 *            description: Last name of the user
 *            example: Novak
 *            writeOnly: true
 *          email:
 *            type: string
 *            format: email 
 *            description: Email of the user
 *            example: valid email
 *          password:
 *            type: string
 *            description: Password of the user
 *            example: admin
 *        required:
 *          - firstName
 *          - lastName
 *          - email
 *          - password
 */
const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.']
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Email is not valid.']
    },
    password: {
        type: String,
        required: [true, 'Password is required.']
    },
    body: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    mind: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    sense: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    relations: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    journey: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    love: {
        type: Schema.Types.Number,
        required: false,
        min: 0,
        max: 100,
        default: 0
    },
    boardingLevel: {
        type: Schema.Types.Number,
        required: true,
        min: 1,
        max: 5,
        default: 1
    },
    permissionLevel: Schema.Types.Number
}, { timestamps: true });


const UserModel = mongoose.model('User', userSchema)

exports.createUser = (userData) => {
    const user = new UserModel(userData);
    return user.save();
};

exports.findById = async (id) => {
    try {
        const user = await UserModel.findById(id).lean();
        if (user) {
            delete user.password;
            return user;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

exports.findByEmail = async (email) => {
    try {
        const user = await UserModel.findOne({ email });
        if (user) {
            const userId = user._id;
            console.log('User ID:', userId);
            return user;
        } else {
            // No user found with the specified email
            console.log('User not found');
            return null; // Return null or throw an error to handle the case where the user is not found
        }
    } catch (err) {
        console.error(err);
        throw err; // Rethrow the error to be handled by the calling code
    }
};

exports.changePassword = (_id, userData) => {
    return UserModel.findOneAndUpdate({ _id }, userData);
};

exports.listAllUsers = (limit) => {
    return new Promise((resolve, reject) => {
        UserModel.find()
            .limit(limit)
            .then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.deleteById = (_id) => {
    return new Promise((resolve, reject) => {
        console.log(_id);
        UserModel.deleteOne({ _id })
            .then((result) => {
                resolve(result);
            })
            .catch ((err) => {
                reject(err);
            })
    });
};

exports.findByIdAndUpdate = async (id, updateData) => {
    try {
        const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true });
        if (user) {
            return user;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

exports.initInsertAdmin = async () => {
    try {
        // Check if a question with the same shortcode already exists
        const existingAdmin = await UserModel.findOne({ email: 'admin@admin.com' });

        if (!existingAdmin ) {
            const hashedPassword = Utils.hashPassword('admin');
            // Create a new user object by spreading properties from the request body
            // and modifying the password and permissionLevel        
            const userData = {
                firstName: 'Admin',
                lastName: 'Admin',
                email: 'admin@admin.com',
                password: hashedPassword,
                permissionLevel: 2
            };
    
            const user = new UserModel(userData);
            await user.save();
            console.log('Admin user created.');
        } else {
            console.log('Admin user already added in DB.');
        }
    } catch (error) {
        console.error('Error adding admin user to the database:', error);
    }

};

exports.deleteAll = () => {
    return UserModel.deleteMany({});
};