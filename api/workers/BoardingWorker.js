const UserModel = require('../models/User');
const QuestionModel = require('../models/Question');
const UserRatingsModel = require('../models/UserRatings');
const verifyUserMiddleware = require('../middlewares/verifyUser');

/**
* @openapi
* /boarding:
*   get:
*     summary: Returns user boarding level.
*     tags:
*       - Boarding
*     security:
*       - jwt: []
*     responses:
*       200:
*         description: Return appropriate boardingLevel
*/
exports.getBoardingLevel = async (request, response) => {
    const user = await verifyUserMiddleware.getUserFromSession(request, response);
    console.log('user.boardingLevel', user.boardingLevel); 
    response.status(200).json({ boardingLevel: user.boardingLevel });
};

/**
 * @openapi
 * /boarding/{step}:
 *   post:
 *     summary: Calculate onboarding step for a user.
 *     tags:
 *       - Boarding
 *     parameters:
 *       - in: path
 *         name: step
 *         description: The onboarding step to calculate.
 *         required: true
 *         schema:
 *           type: integer
 *     security:
 *       - jwt: []
 *     requestBody:
 *       description: JSON data containing questionnaire responses.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Q1:
 *                 type: integer
 *               Q2:
 *                 type: integer
 *               Q3:
 *                 type: integer
 *               Q4:
 *                 type: integer 
 *             required:
 *               - Q1
 *               - Q2
 *               - Q3
 *               - Q4
 *     responses:
 *       200:
 *         description: Success. User's onboarding step calculated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                   example: Data received successfully
 *       400:
 *         description: Bad Request. Invalid or missing data in the request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Question with shortcode Question KEY not found in the database
 *       500:
 *         description: Internal Server Error. An error occurred during the calculation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal server error
 */
exports.calculateBoarding = async (request, response) => {
    try {
        const formData = request.body;
        console.log('[calculateBoarding] Received JSON data:', formData);
        const user = await verifyUserMiddleware.getUserFromSession(request, response);

        if (request.params.step <= 3) {
            for (const key in formData) {
                if (formData.hasOwnProperty(key)) {
                    const existingQuestion = await QuestionModel.findByShortcode(key);

                    if (!existingQuestion) {
                        return response.status(400).json({ error: `Question with shortcode ${key} not found in the database` });
                    }

                    const effectFactor = 0.1;
                    const bodyEffect = existingQuestion.changeBody * effectFactor;
                    const mindEffect = existingQuestion.changeMind * effectFactor;
                    const senseEffect = existingQuestion.changeSense * effectFactor;
                    const relationsEffect = existingQuestion.changeRelations * effectFactor;
                    const journeyEffect = existingQuestion.changeJourney * effectFactor;
                    const loveEffect = existingQuestion.changeLove * effectFactor;

                    user.body += bodyEffect;
                    user.mind += mindEffect;
                    user.sense += senseEffect;
                    user.relations += relationsEffect;
                    user.journey += journeyEffect;
                    user.love += loveEffect;

                    user.boardingLevel = request.params.step;
                }
            }
            user.boardingLevel++;
            console.log('[calculateBoarding]', user.boardingLevel);
            await UserModel.findByIdAndUpdate(user._id, user, { new: true });
            response.status(200).json({ message: 'Data received successfully' });
        } else if (request.params.step === '4') {
            const userUpdates = {
                body: user.body + formData.Body,
                mind: user.mind + formData.Mind,
                sense: user.sense + formData.Sense,
                relations: user.relations + formData.Relations,
                journey: user.journey + formData.Journey,
                love: user.love + formData.Love,
                boardingLevel: 5,
            };

            await UserModel.findByIdAndUpdate(user._id, userUpdates, { new: true });

            const newUserRatings = {
                user: user._id,
                ratingBody: formData.Body,
                ratingMind: formData.Mind,
                ratingSense: formData.Sense,
                ratingRelations: formData.Relations,
                ratingJourney: formData.Journey,
                ratingLove: formData.Love,
            };
            await UserRatingsModel.createUserRatings(newUserRatings);

            response.status(200).json({ message: 'Data received successfully', boardingLevel: user.boardingLevel });
        } else {
            response.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @openapi
 * /ratings/get/all:
 *   get:
 *     summary: List user ratings.
 *     description: Retrieve a list of user ratings, with an optional limit.
 *     tags:
 *       - Utils
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: |
 *           Maximum number of user ratings to retrieve (default: 10).
 *     responses:
 *       '200':
 *         description: A list of user ratings.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserRating'
 *       '500':
 *         description: Internal server error.
 */
exports.listAllUserRatings = async (request, response) => {
    try {
        const limit = request.query.limit 
            && request.query.limit <= 100 ? parseInt(request.query.limit) : 50;

        const result = await UserRatingsModel.listAllUserRatings(limit);
        response.status(200).send(result);
    } catch (err) {
        console.error(err);
        response.status(500).send('Internal Server Error');
    }
};
