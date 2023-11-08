const UserModel = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../env.js').jwt_secret;

exports.isPasswordAndUserMatch = async (request, response, next) => {
    try {
        const user = await UserModel.findByEmail(request.body.email);

        if (!user) {
            return response.status(404).send('User with this email not found.');
        }
        const [salt, storedHash] = user.password.split('$');
        const hash = crypto.createHmac('sha512', salt)
            .update(request.body.password)
            .digest('base64');

        
        if (hash !== storedHash) {
            return response.status(400).send({ errors: ['Invalid password'] });
        }

        request.body = {
            userId: user._id,
            email: user.email,
            permissionLevel: user.permissionLevel,
            provider: 'email',
            name: `${user.firstName} ${user.lastName}`,
        };

        return next();
    } catch (error) {
        console.error(error);
        return response.status(500).send('Internal Server Error');
    }
};

exports.hasAuthValidFields = (request, response, next) => {
    let errors = [];

    if (request.body) {
        if (!request.body.email) {
            errors.push('Missing email field');
        }
        if (!request.body.password) {
            errors.push('Missing password field');
        }

        if (errors.length) {
            return response.status(400).send({ errors: errors.join(',') });
        } else {
            return next();
        }
    } else {
        return response.status(400).send({ errors: 'Missing email and password fields' });
    }
};

exports.validateSession = (minPermissionLevel) => {
    return (request, response, next) => {
        try {
            const authHeader = request.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return response.status(401).send('Access token is missing or invalid');
            }

            const accessToken = authHeader.substring(7, authHeader.length); // Remove "Bearer " from the string
            console.log('[verifyUser Middleware] > validateSession received accessToken (With Bearer string removed)', accessToken);

            jwt.verify(accessToken, secret, (err, decoded) => {
                if (err) {
                    console.log('[verifyUser Middleware] > validateSession NOT_VALID = ', err);
                    return response.status(401).send('Invalid access token');
                }

                request.userData = decoded;
                console.log('[verifyUser Middleware] > validateSession decoded userData = ', request.userData);
                if (request.userData.permissionLevel >= minPermissionLevel) {
                    return next();
                } else {
                    return response.status(403).send('Forbidden');
                }
            });
        } catch (error) {
            console.error(error);
            return response.status(500).send('Internal Server Error');
        }
    };
};


/**
 * If the user permission level and the required permission level coincide 
 * in at least one bit, the result will be greater than zero, 
 * and we can let the action proceed; otherwise, the HTTP code 403 will be returned.
 * 
 * @param {*} required_permission_level 
 * @returns 
 */
exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (request, response, next) => {
        console.log('jwt', request.jwt);
        const user_permission_level = parseInt(request.jwt.permission_level);
        console.log('user_permission_level', user_permission_level);
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return response.status(403).send();
        }
    };
 };

 exports.getUserFromSession = (request) => {
    return new Promise((resolve, reject) => {
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            reject('Access token is missing or invalid');
            return;
        }

        const accessToken = authHeader.substring(7, authHeader.length); 
        jwt.verify(accessToken, secret, (err, decoded) => {
            if (err) {
                reject('Invalid access token');
                return;
            }

            const userId = decoded.userId;
            UserModel.findById(userId)
                .then((user) => {
                    if (!user) {
                        reject('User not found');
                        return;
                    }
                    resolve(user);
                })
                .catch((error) => {
                    console.error('Error fetching user from the database:', error);
                    reject('Internal server error');
                });
        });
    });
};
