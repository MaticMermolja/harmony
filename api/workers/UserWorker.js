const UserModel = require('../models/User.js');
const Utils = require('../utils/passwordUtils.js');
const OpenAIController = require('./OpenAIWorker.js');
const jwt = require('jsonwebtoken');
const jwtSecret = require('../env.js').jwt_secret;
const crypto = require('crypto');
const verifyUserMiddleware = require('../middlewares/verifyUser.js');
const ActionModel = require('../models/Action.js');


/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in a user and generate access and refresh tokens.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User login credentials.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: mySecurePassword
 *     responses:
 *       '200':
 *         description: User logged in successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token for authenticated user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userId:
 *                   type: string
 *                   description: ID of the logged-in user.
 *                   example: 12345
 *                 permissionLevel:
 *                   type: integer
 *                   description: Permission level of the user.
 *                   example: 1
 *                 boardingLevel:
 *                   type: integer
 *                   description: Boarding level of the user.
 *                   example: 3
 *       '400':
 *         description: Bad request, with error message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: An array of validation or login errors.
 *                   example: ["Invalid email or password."]
 *     security:
 *       - jwt: []
 */
exports.executeLoginUser = async (request, response) => {
    try {
        const user = await UserModel.findByEmail(request.body.email);
        const refreshId = user._id + jwtSecret;

        console.log('[UserController] executeLoginUser: userId =', user._id);
        console.log('[UserController] executeLoginUser: refreshId =', refreshId);

        // Generate a random salt for security
        const salt = crypto.randomBytes(16).toString('base64');
        console.log('[UserController] executeLoginUser: salt =', salt);

        // Create a hash of the refresh ID using SHA-512 and the salt
        const hash = crypto
            .createHmac('sha512', salt)
            .update(refreshId)
            .digest("base64");
        
        // Generate an access token using JWT and the request body
        const accessToken = jwt.sign({ userId: user._id, permissionLevel: user.permissionLevel }, jwtSecret, {
            expiresIn: 3600, // in seconds -> 1 hr
        });

        console.log('[UserController] executeLoginUser: accessToken', accessToken);

        // Encode the hash as base64 to create the refresh token
        // const refreshToken = Buffer.from(hash).toString('base64');

        const refreshToken = jwt.sign({ userId: user._id, salt }, jwtSecret, {
           expiresIn: '7d', // Refresh token expires in 7 days
        });

        console.log('[UserController] executeLoginUser: refreshToken', refreshToken);

        return response.status(200).send({ accessToken, userId: user._id, permissionLevel: user.permissionLevel, boardingLevel: user.boardingLevel });
    } catch (err) {
        console.log(err);
        return response.status(400).send({ errors: err });
    }
};

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user and generate an access token.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User registration information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name.
 *                 example: John
 *               lastName:
 *                 type: string
 *                 description: User's last name.
 *                 example: Doe
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: mySecurePassword
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Access token for the newly registered user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 userId:
 *                   type: string
 *                   description: ID of the newly registered user.
 *                   example: 12345
 *                 permissionLevel:
 *                   type: integer
 *                   description: Permission level of the newly registered user.
 *                   example: 1
 *       '400':
 *         description: Bad request, with error details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: object
 *                   description: Detailed error messages related to registration.
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: Error message related to the first name.
 *                       example: First name is required.
 *                     lastName:
 *                       type: string
 *                       description: Error message related to the last name.
 *                       example: Last name is required.
 *                     email:
 *                       type: string
 *                       description: Error message related to the email.
 *                       example: Email is already registered.
 *                     password:
 *                       type: string
 *                       description: Error message related to the password.
 *                       example: Password must be at least 8 characters long.
 *     security:
 *       - jwt: []
 */
exports.executeRegisterUser = async (request, response) => {
    try {
        console.log('Request body:', request.body);
        const hashedPassword = Utils.hashPassword(request.body.password);

        // Create a new user object by spreading properties from the request body
        // and modifying the password and permissionLevel        
        const user = {
            ...request.body,
            password: hashedPassword,
            permissionLevel: 1,
        };

        // Create the new user in the database using the UserModel and await the result
        const result = await UserModel.createUser(user);
        console.log('Created new user:', result);

        const accessToken = jwt.sign({ userId: result._id, permissionLevel: user.permissionLevel }, jwtSecret, {
            expiresIn: 3600, // in seconds -> 1 hr
        });


        // 201, status is OK and we have created new resource that are sending back
        return response.status(200).send({ accessToken, userId: result._id, permissionLevel: user.permissionLevel, boardingLevel: user.boardingLevel });
    } catch (err) {
        // We define a json that includes key:value of each User property
        // The err.errors object is provided by Mongoose when a validation error occurs
        let errors = { firstName: '', lastName: '', email: '', password: '' };
        console.log(err.code);
        console.log(errors);
        if (err.code === 11000) {
            // If user with this email already exists
            errors.email = 'Email is already registered.';
        } else {
            console.log('Defining errors');
            Object.values(err.errors).forEach(({ properties }) => {
                errors[properties.path] = properties.message;
            });;
        }
        response.status(400).json({ errors });
    }
};

/**
 * @openapi
 * /user/{id}:
 *   get:
 *     summary: Find a user by their ID.
 *     tags:
 *       - User Management
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to find.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *     responses:
 *       '200':
 *         description: User found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: ID of the user.
 *                   example: 12345
 *                 firstName:
 *                   type: string
 *                   description: First name of the user.
 *                   example: John
 *                 lastName:
 *                   type: string
 *                   description: Last name of the user.
 *                   example: Doe
 *                 email:
 *                   type: string
 *                   description: Email address of the user.
 *                   example: user@example.com
 *       '404':
 *         description: User not found.
 *     security:
 *       - jwt: []
 */
exports.findById = async (request, response) => {
    try {
        const result = await UserModel.findById(request.params.id);
        if (result === null) {
            response.status(404).send('User Not Found');
        } else {
            response.status(200).send(result);
        }
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users.
 *     tags:
 *       - User Management
 *     parameters:
 *       - name: limit
 *         in: query
 *         description: Maximum number of users to retrieve (default is 10).
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           example: 20
 *     responses:
 *       '200':
 *         description: List of users retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error.
 *     security:
 *       - jwt: []
 */
exports.listAllUsers = async (request, response) => {
    try {
        const limit = request.query.limit 
            && request.query.limit <= 100 ? parseInt(request.query.limit) : 10;

        const result = await UserModel.listAllUsers(limit);
        response.status(200).send(result);
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};

/**
 * @openapi
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user by their ID.
 *     tags:
 *       - User Management
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to delete.
 *         required: true
 *         schema:
 *           type: string
 *           example: 12345
 *     responses:
 *       '204':
 *         description: User deleted successfully.
 *       '404':
 *         description: User not found.
 *       '500':
 *         description: Internal Server Error.
 *     security:
 *       - jwt: []
 */
exports.deleteById = async (request, response) => {
    try {
        const result = await UserModel.deleteById(request.params.id);

        if (result.deletedCount === 1) {
            response.status(204).send({});
        } else {
            response.status(404).send('User Not Found');
        }
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};

/**
 * @openapi
 * /:
 *   get:
 *     summary: Render User View Page
 *     tags:
 *       - App
 *     description: |
 *       Endpoint to render the user view page. If the user's boarding level is 5, it will fetch
 *       all actions, an inspiration quote and render the main view. Otherwise, it redirects to the boarding page.
 *     responses:
 *       '200':
 *         description: User view page rendered successfully.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: HTML content for the user view page with user details, actions, and inspiration quote.
 *       '302':
 *         description: Redirect to the boarding page.
 *         headers:
 *           Location:
 *             description: URL to which the client should be redirected.
 *             schema:
 *               type: string
 *               example: '/boarding'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: 'Internal Server Error'
 *     security:
 *       - userSession: []
 */
exports.showUserView = async (request, response) => {
    try {
        const user = await verifyUserMiddleware.getUserFromSession(request, response);
        if(user.boardingLevel == 5) {
            const actions = await ActionModel.listAllActions(100);
            response.status(200).json({ user, actions });
        } else {
            response.status(403).json({ message: 'User boarding not completed' });
        }  
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};

/**
 * @openapi
 * /mark-as-done:
 *   post:
 *     summary: Mark an action as done
 *     tags:
 *       - Action Management
 *     requestBody:
 *       description: JSON payload containing the actionId to mark as done.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               actionId:
 *                 type: string
 *                 example: "60c73b2bf9d00c6bacc6f3e2"
 *     responses:
 *       '200':
 *         description: Action marked as done and user status updated.
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               properties: 
 *                 message:
 *                   type: string
 *                   example: "Action marked as done"
 *                 user:
 *                   type: object
 *                   properties:
 *                     body:
 *                       type: integer
 *                       example: 50
 *                     mind:
 *                       type: integer
 *                       example: 30
 *                     sense:
 *                       type: integer
 *                       example: 40
 *                     relations:
 *                       type: integer
 *                       example: 45
 *                     journey:
 *                       type: integer
 *                       example: 60
 *                     love:
 *                       type: integer
 *                       example: 70
 *       '404':
 *         description: Action not found.
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               properties: 
 *                 error:
 *                   type: string
 *                   example: "Action not found"
 *       '500':
 *         description: Internal server error.
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               properties: 
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 *     security:
 *       - jwt: []
 */
exports.markActionAsDone = async (request, response) => {
    try {
        const user = await verifyUserMiddleware.getUserFromSession(request, response);
        const { actionId } = request.body;

        const action = await ActionModel.findById(actionId);
        if (!action) {
            return response.status(404).json({ error: 'Action not found' });
        }

        user.body = Math.min(user.body + action.changeBody, 100);
        user.mind = Math.min(user.mind + action.changeMind, 100);
        user.sense = Math.min(user.sense + action.changeSense, 100);
        user.relations = Math.min(user.relations + action.changeRelations, 100);
        user.journey = Math.min(user.journey + action.changeJourney, 100);
        user.love = Math.min(user.love + action.changeLove, 100);

        await UserModel.findByIdAndUpdate(user._id, user);
        response.status(200).json({ message: 'Action marked as done', user });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

/* Not needed at the moment, implemented when learning jwt
exports.changePassword = async (request, response) => {
    try {
        console.log('Password change request received.');

        if (request.body.password) {
            request.body.password = Utils.hashPassword(request.body.password);
            console.log('New password prepared for db input.');
        }

        const result = await UserModel.changePassword(request.params.id, request.body);

        console.log('Password changed for user', result._id);
        response.status(204).send({});
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
}; 
*/