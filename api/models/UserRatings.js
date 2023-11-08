const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *   schemas:
 *     UserRating:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the user.
 *           example: 507f1f77bcf86cd799439011
 *         ratingBody:
 *           type: number
 *           description: User's rating related to body (1-6).
 *           example: 6
 *           minimum: 1
 *           maximum: 6
 *         ratingMind:
 *           type: number
 *           description: User's rating related to mind (1-6).
 *           example: 4
 *           minimum: 1
 *           maximum: 6
 *         ratingSense:
 *           type: number
 *           description: User's rating related to sense (1-6).
 *           example: 3
 *           minimum: 1
 *           maximum: 6
 *         ratingRelations:
 *           type: number
 *           description: User's rating related to relations (1-6).
 *           example: 5
 *           minimum: 1
 *           maximum: 6
 *         ratingJourney:
 *           type: number
 *           description: User's rating related to journey (1-6).
 *           example: 2
 *           minimum: 1
 *           maximum: 6
 *         ratingLove:
 *           type: number
 *           description: User's rating related to love (1-6).
 *           example: 6
 *           minimum: 1
 *           maximum: 6
 *       required:
 *         - user
 *         - ratingBody
 *         - ratingMind
 *         - ratingSense
 *         - ratingRelations
 *         - ratingJourney
 *         - ratingLove
 *       additionalProperties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the rating was created.
 *           example: '2023-10-09T08:02:17Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the rating was last updated.
 *           example: '2023-10-09T08:02:17Z'
 */
const userRatingsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    ratingBody: {
        type: Number,
        required: [true, 'Rating body is required.'],
        min: 1,
        max: 6
    },
    ratingMind: {
        type: Number,
        required: [true, 'Rating mind is required.'],
        min: 1,
        max: 6
    },
    ratingSense: {
        type: Number,
        required: [true, 'Rating sense is required.'],
        min: 1,
        max: 6
    },
    ratingRelations: {
        type: Number,
        required: [true, 'Rating relations is required.'],
        min: 1,
        max: 6
    },
    ratingJourney: {
        type: Number,
        required: [true, 'Rating journey is required.'],
        min: 1,
        max: 6
    },
    ratingLove: {
        type: Number,
        required: [true, 'Rating love is required.'],
        min: 1,
        max: 6
    }                
}, { timestamps: true });

const UserRatingsModel = mongoose.model('UserRatings', userRatingsSchema)

exports.createUserRatings = (userRatingsData) => {
    const userRatings = new UserRatingsModel(userRatingsData);
    return userRatings.save();
};

exports.listAllUserRatings = (limit) => {
    return new Promise((resolve, reject) => {
        UserRatingsModel.find()
            .limit(limit)
            .then((userRatings) => {
                resolve(userRatings);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.deleteAll = () => {
    return UserRatingsModel.deleteMany({});
};
