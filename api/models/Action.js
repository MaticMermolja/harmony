const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *   schemas:
 *     Action:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the action.
 *           example: Take a Walk in Nature
 *         desc:
 *           type: string
 *           description: A description of the action.
 *           example: Spend time in nature to relax and rejuvenate.
 *         changeBody:
 *           type: number
 *           description: Change in the body attribute (0-5).
 *           example: 2
 *         changeMind:
 *           type: number
 *           description: Change in the mind attribute (0-5).
 *           example: 3
 *         changeSense:
 *           type: number
 *           description: Change in the sense attribute (0-5).
 *           example: 4
 *         changeRelations:
 *           type: number
 *           description: Change in the relations attribute (0-5).
 *           example: 1
 *         changeJourney:
 *           type: number
 *           description: Change in the journey attribute (0-5).
 *           example: 2
 *         changeLove:
 *           type: number
 *           description: Change in the love attribute (0-5).
 *           example: 1
 *       required:
 *         - name
 *         - desc
 *         - changeBody
 *         - changeMind
 *         - changeSense
 *         - changeRelations
 *         - changeJourney
 *         - changeLove
 */
const actionSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Shortcode is required.'],
        unique: true

    },
    desc: {
        type: String,
        required: [true, 'Desc is required.']
    },
    pictureUrl: {
        type: String,
        required: false
    },
    changeBody: {
        type: Schema.Types.Number,
        required: [true, 'Change body is required.'],
        min: 0,
        max: 5
    },
    changeMind: {
        type: Schema.Types.Number,
        required: [true, 'Change mind is required.'],
        min: 0,
        max: 5
    },
    changeSense: {
        type: Schema.Types.Number,
        required: [true, 'Change sense is required.'],
        min: 0,
        max: 5
    },
    changeRelations: {
        type: Schema.Types.Number,
        required: [true, 'Change relations is required.'],
        min: 0,
        max: 5
    },
    changeJourney: {
        type: Schema.Types.Number,
        required: [true, 'Change journey is required.'],
        min: 0,
        max: 5
    },
    changeLove: {
        type: Schema.Types.Number,
        required: [true, 'Change love is required.'],
        min: 0,
        max: 5
    }
}, { timestamps: true });

const ActionModel = mongoose.model('Action', actionSchema);

const actionsData = [
    {
        name: 'Take a Walk in Nature',
        desc: 'Spend time in nature to relax and rejuvenate.',
        pictureUrl: 'take_a_walk_in_nature.jpg',
        changeBody: 2,
        changeMind: 3,
        changeSense: 4,
        changeRelations: 1,
        changeJourney: 2,
        changeLove: 1,
    },
    {
        name: 'Read a Book',
        desc: 'Immerse yourself in a good book to stimulate your mind.',
        pictureUrl: 'read_a_book.jpg',
        changeBody: 1,
        changeMind: 4,
        changeSense: 3,
        changeRelations: 2,
        changeJourney: 1,
        changeLove: 1,
    },
    {
        name: 'Call a Friend',
        desc: 'Connect with a friend to improve your relations.',
        pictureUrl: 'call_a_friend.jpg',
        changeBody: 1,
        changeMind: 2,
        changeSense: 1,
        changeRelations: 3,
        changeJourney: 1,
        changeLove: 2,
    },
    {
        name: 'Meditate',
        desc: 'Calm your mind and relax your body through meditation.',
        pictureUrl: 'meditate.jpg',
        changeBody: 1,
        changeMind: 3,
        changeSense: 2,
        changeRelations: 1,
        changeJourney: 2,
        changeLove: 1,
    },
    {
        name: 'Exercise',
        desc: 'Stay physically fit and energized through exercise.',
        pictureUrl: 'exercise.jpg',
        changeBody: 4,
        changeMind: 2,
        changeSense: 2,
        changeRelations: 1,
        changeJourney: 1,
        changeLove: 1,
    },
    {
        name: 'Cook a Healthy Meal',
        desc: 'Prepare a nutritious meal to nourish your body.',
        pictureUrl: 'cook_a_healthy_meal.jpg',
        changeBody: 2,
        changeMind: 2,
        changeSense: 4,
        changeRelations: 2,
        changeJourney: 1,
        changeLove: 2,
    },
    {
        name: 'Practice Gratitude',
        desc: 'Express gratitude to enhance your sense of love and happiness.',
        pictureUrl: 'practice_gratitude.jpg',
        changeBody: 1,
        changeMind: 1,
        changeSense: 1,
        changeRelations: 3,
        changeJourney: 2,
        changeLove: 4,
    },
    {
        name: 'Learn Something New',
        desc: 'Expand your knowledge and stimulate your mind.',
        pictureUrl: 'learn_something_new.jpg',
        changeBody: 1,
        changeMind: 4,
        changeSense: 2,
        changeRelations: 2,
        changeJourney: 1,
        changeLove: 1,
    },
    {
        name: 'Take a Relaxing Bath',
        desc: 'Relax your body and mind with a soothing bath.',
        pictureUrl: 'take_a_relaxing_bath.jpg',
        changeBody: 3,
        changeMind: 3,
        changeSense: 4,
        changeRelations: 1,
        changeJourney: 1,
        changeLove: 1,
    },
    {
        name: 'Listen to Music',
        desc: 'Enjoy music to uplift your spirits and stimulate your sense of love.',
        pictureUrl: 'listen_to_music.jpg',
        changeBody: 1,
        changeMind: 2,
        changeSense: 4,
        changeRelations: 1,
        changeJourney: 2,
        changeLove: 3,
    },
    {
        name: 'Volunteer for a Cause',
        desc: 'Contribute to a cause to enhance your sense of love and relations.',
        pictureUrl: 'volunteer_for_a_cause.jpg',
        changeBody: 1,
        changeMind: 2,
        changeSense: 1,
        changeRelations: 4,
        changeJourney: 2,
        changeLove: 4,
    },
    {
        name: 'Spend Time in Silence',
        desc: 'Meditate or simply enjoy the peace and quiet.',
        pictureUrl: 'spend_time_in_silence.jpg',
        changeBody: 1,
        changeMind: 3,
        changeSense: 2,
        changeRelations: 2,
        changeJourney: 2,
        changeLove: 1,
    },
    {
        name: 'Explore Nature',
        desc: 'Get outside and explore the beauty of nature.',
        pictureUrl: 'explore_nature.jpg',
        changeBody: 4,
        changeMind: 3,
        changeSense: 4,
        changeRelations: 2,
        changeJourney: 3,
        changeLove: 1,
    },
    {
        name: 'Set Goals',
        desc: 'Set and work toward goals for a sense of purpose and journey.',
        pictureUrl: 'set_goals.jpg',
        changeBody: 1,
        changeMind: 4,
        changeSense: 1,
        changeRelations: 2,
        changeJourney: 4,
        changeLove: 2,
    },
    {
        name: 'Travel to New Places',
        desc: 'Explore new destinations to enhance your journey and sense of love.',
        pictureUrl: 'travel_to_new_places.jpg',
        changeBody: 3,
        changeMind: 3,
        changeSense: 4,
        changeRelations: 2,
        changeJourney: 5,
        changeLove: 3,
    },
];

exports.initInsertActions = async () => {
    for (const actionData of actionsData) {
        try {
            // Check if a question with the same shortcode already exists
            const existingAction = await ActionModel.findOne({ name: actionData.name });

            if (existingAction) {
                continue; // Skip inserting this question
            }

            const action = new ActionModel(actionData);
            await action.save();
        } catch (error) {
            console.error('Error adding questactionion to the database:', error);
        }
    }
    console.log('Action collection initialized.');
};

exports.createAction = (actionData) => {
    if ('_id' in actionData) {
        delete actionData._id; // Remove the _id field if it's present in the actionData
    }
    const action = new ActionModel(actionData);
    return action.save();
};

exports.updateAction = async (actionId, updatedAction) => {
    try {
      const updated = await ActionModel.findByIdAndUpdate(actionId, updatedAction, { new: true });
      if (!updated) {
        throw new Error('Action not found');
      }
      return updated;
    } catch (error) {
      throw error;
    }
};

exports.findById = async (id) => {
    try {
        const action = await ActionModel.findById(id).lean();
        if (action) {
            return action;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

exports.listAllActions = (limit) => {
    return new Promise((resolve, reject) => {
        ActionModel.find()
            .limit(limit)
            .then((actions) => {
                resolve(actions);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.deleteAll = () => {
    return ActionModel.deleteMany({});
};