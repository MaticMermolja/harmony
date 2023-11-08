const ActionModel = require('../models/Action');

/**
 * @openapi
 * /admin/action/list:
 *   get:
 *     summary: List all actions
 *     description: Retrieve a list of all available actions.
 *     tags:
 *       - Admin
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: The maximum number of actions to return (default is 10, maximum is 100).
 *         schema:
 *           type: integer
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: A list of actions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Action'
 *         examples:
 *           example-1:
 *             value: |
 *               [
 *                 {
 *                   "_id": "65278f25c2653d87a5ae3fab",
 *                   "name": "Take a Walk in Nature",
 *                   "desc": "Spend time in nature to relax and rejuvenate.",
 *                   "changeBody": 2,
 *                   "changeMind": 3,
 *                   "changeSense": 4,
 *                   "changeRelations": 1,
 *                   "changeJourney": 2,
 *                   "changeLove": 1,
 *                   "createdAt": "2023-10-12T06:16:05.283Z",
 *                   "updatedAt": "2023-10-12T06:16:05.283Z",
 *                   "__v": 0
 *                 },
 *                 {
 *                   "_id": "65278f25c2653d87a5ae3faf",
 *                   "name": "Read a Book",
 *                   "desc": "Immerse yourself in a good book to stimulate your mind.",
 *                   "changeBody": 1,
 *                   "changeMind": 4,
 *                   "changeSense": 3,
 *                   "changeRelations": 2,
 *                   "changeJourney": 1,
 *                   "changeLove": 1,
 *                   "createdAt": "2023-10-12T06:16:05.603Z",
 *                   "updatedAt": "2023-10-12T06:16:05.603Z",
 *                   "__v": 0
 *                 },
 *                 {
 *                   "_id": "65278f25c2653d87a5ae3fb5",
 *                   "name": "Call a Friend",
 *                   "desc": "Connect with a friend to improve your relations.",
 *                   "changeBody": 1,
 *                   "changeMind": 2,
 *                   "changeSense": 1,
 *                   "changeRelations": 3,
 *                   "changeJourney": 1,
 *                   "changeLove": 2,
 *                   "createdAt": "2023-10-12T06:16:05.686Z",
 *                   "updatedAt": "2023-10-12T06:16:05.686Z",
 *                   "__v": 0
 *                 }
 *               ]
 *       500:
 *         description: Internal Server Error
 */
exports.listAllActions = async (request, response) => {
    try {
        const limit = request.query.limit 
            && request.query.limit <= 100 ? parseInt(request.query.limit) : 50;

        const result = await ActionModel.listAllActions(limit);
        response.status(200).send(result);
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};

/**
 * @openapi
 * /admin/action/create:
 *   put:
 *     summary: Create a new action
 *     description: Create a new action with the provided data.
 *     tags:
 *       - Admin
 *     security:
 *       - jwt: []
 *     requestBody:
 *       description: Action data to create a new action.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the action.
 *               desc:
 *                 type: string
 *                 description: A description of the action.
 *               changeBody:
 *                 type: number
 *                 description: Change in the body attribute.
 *               changeMind:
 *                 type: number
 *                 description: Change in the mind attribute.
 *               changeSense:
 *                 type: number
 *                 description: Change in the sense attribute.
 *               changeRelations:
 *                 type: number
 *                 description: Change in the relations attribute.
 *               changeJourney:
 *                 type: number
 *                 description: Change in the journey attribute.
 *               changeLove:
 *                 type: number
 *                 description: Change in the love attribute.
 *             required:
 *               - name
 *               - desc
 *               - changeBody
 *               - changeMind
 *               - changeSense
 *               - changeRelations
 *               - changeJourney
 *               - changeLove
 *     responses:
 *       201:
 *         description: Action created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 action:
 *                   $ref: '#/components/schemas/Action' # Reference to your Action schema
 *       500:
 *         description: Internal Server Error
 */
exports.putCreateNewAction = async (request, response) => {
    try {
        const result = await ActionModel.createAction(request.body);
        response.status(201).json({ message: 'Action created successfully', action: result });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @openapi
 * /admin/action/patch/{id}:
 *   patch:
 *     summary: Update an action by ID.
 *     tags: [Admin]
 *     security:
 *       - jwt: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The ID of the action to update.
 *         required: true
 *         schema:
 *           type: string
 *         example: 5f70d1f2fbb06c001c8c6310
 *     requestBody:
 *       description: Updated action details.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Going for a hikec
 *               desc:
 *                 type: string
 *                 example: Insert description here.
 *               changeBody:
 *                 type: number
 *                 example: 5
 *               changeMind:
 *                 type: number
 *                 example: 4
 *               changeSense:
 *                 type: number
 *                 example: 6
 *               changeRelations:
 *                 type: number
 *                 example: 2.5
 *               changeJourney:
 *                 type: number
 *                 example: 2.5
 *               changeLove:
 *                 type: number
 *                 example: 2.5
 *     responses:
 *       '200':
 *         description: Action updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Action updated successfully
 *                 action:
 *                   $ref: '#/components/schemas/Action'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
exports.patchUpdateAction = async (request, response) => {
    try {
        const actionId = request.params.id;
        const updatedAction = request.body;
        const result = await ActionModel.updateAction(actionId, updatedAction);
        response.status(200).json({ message: 'Action updated successfully', action: result });
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};
