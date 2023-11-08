const UserModel = require('../models/User');
const QuestionModel = require('../models/Question');
const ActionModel = require('../models/Action');
const UserRatingsModel = require('../models/UserRatings');
const Utils = require('../utils/passwordUtils');

/**
 * @openapi
 * /db:
 *   get:
 *     summary: Render Database Initialization Page
 *     tags:
 *       - Data Management
 *     description: |
 *       Endpoint to render the database initialization page.
 *     responses:
 *       '200':
 *         description: Database initialization page rendered successfully.
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               description: HTML content for the database initialization page.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   example: 'Detailed error message'
 */
exports.showDBInit = (request, response) => {
    try {
        response.render('db');
    } catch (error) {
        console.error('Error rendering DB init page:', error);
        return response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/**
 * @openapi
 * /db/init:
 *   post:
 *     summary: Initialize Application Data
 *     tags:
 *       - Data Management
 *     description: |
 *       Endpoint to initialize application data. Creates an admin user, and initializes questions and actions data.
 *     responses:
 *       '201':
 *         description: Application data initialized successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'App data initialized successfully.'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Internal Server Error'
 *                 error:
 *                   type: string
 *                   example: 'Detailed error message'
 */
exports.initAppData = async (request, response) => {
    try {
        const hashedPassword = Utils.hashPassword("admin");      

        await UserModel.createUser({
            email: 'admin@admin.com',
            password: hashedPassword,
            permissionLevel: 2,
            firstName: 'admin',
            lastName: 'admin'
        });

        await QuestionModel.initInsertQuestions();
        await ActionModel.initInsertActions();

        console.log('App data initialized successfully.');
        return response.status(201).json({ message: 'App data initialized successfully.' });
    } catch (error) {
        console.error('Error initializing app data:', error);
        return response.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};

/**
 * @openapi
 * /db/delete:
 *   delete:
 *     summary: Delete All Database Data
 *     tags:
 *       - Data Management
 *     description: |
 *       Endpoint to delete all data from various models including QuestionModel, UserModel, UserRatingsModel, and ActionModel.
 *     responses:
 *       '200':
 *         description: All data deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 'Data deleted successfully'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: 'Internal server error'
 */
exports.deleteAllDbData = async (request, response) => {
    try {
        await QuestionModel.deleteAll();
        await UserModel.deleteAll();
        await UserRatingsModel.deleteAll();
        await ActionModel.deleteAll();
        console.log(`Deleted collections from QuestionModel, UserModel, ActionModel, UserRatingsModel.`);
        response.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        console.error('Error deleting data:', error);
        response.status(500).json({ error: 'Internal server error' });        
    }
};
