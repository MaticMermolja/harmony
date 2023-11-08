const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * @openapi
 * components:
 *   schemas:
 *     Question:
 *       type: object
 *       properties:
 *         shortcode:
 *           type: string
 *           description: The unique code of the question.
 *           example: Q1
 *         desc:
 *           type: string
 *           description: A detailed description of the question.
 *           example: Do you workout, run, or exercise on a regular basis?
 *         changeBody:
 *           type: number
 *           description: Change in the body attribute (1-50).
 *           example: 50
 *           minimum: 1
 *           maximum: 50
 *         changeMind:
 *           type: number
 *           description: Change in the mind attribute (1-50).
 *           example: 1
 *           minimum: 1
 *           maximum: 50
 *         changeSense:
 *           type: number
 *           description: Change in the sense attribute (1-50).
 *           example: 1
 *           minimum: 1
 *           maximum: 50
 *         changeRelations:
 *           type: number
 *           description: Change in the relations attribute (1-50).
 *           example: 2.5
 *           minimum: 1
 *           maximum: 50
 *         changeJourney:
 *           type: number
 *           description: Change in the journey attribute (1-50).
 *           example: 1
 *           minimum: 1
 *           maximum: 50
 *         changeLove:
 *           type: number
 *           description: Change in the love attribute (1-50).
 *           example: 1
 *           minimum: 1
 *           maximum: 50
 *       required:
 *         - shortcode
 *         - desc
 *         - changeBody
 *         - changeMind
 *         - changeSense
 *         - changeRelations
 *         - changeJourney
 *         - changeLove
 *       additionalProperties:
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the question was created.
 *           example: '2023-10-09T08:02:17Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the question was last updated.
 *           example: '2023-10-09T08:02:17Z'
 */
const questionSchema = new Schema({
    shortcode: {
        type: String,
        required: [true, 'Shortcode is required.']
    },
    desc: {
        type: String,
        required: [true, 'Desc is required.']
    },
    changeBody: {
        type: Schema.Types.Number,
        required: [true, 'Change body is required.'],
        min: 1,
        max: 50
    },
    changeMind: {
        type: Schema.Types.Number,
        required: [true, 'Change mind is required.'],
        min: 1,
        max: 50
    },
    changeSense: {
        type: Schema.Types.Number,
        required: [true, 'Change sense is required.'],
        min: 1,
        max: 50
    },
    changeRelations: {
        type: Schema.Types.Number,
        required: [true, 'Change relations is required.'],
        min: 1,
        max: 50
    },
    changeJourney: {
        type: Schema.Types.Number,
        required: [true, 'Change journey is required.'],
        min: 1,
        max: 50
    },
    changeLove: {
        type: Schema.Types.Number,
        required: [true, 'Change love is required.'],
        min: 1,
        max: 50
    }
}, { timestamps: true });

const QuestionModel = mongoose.model('Question', questionSchema);

const questionsData = [
    {
        "shortcode": "Q1",
        "desc": "Do you workout, run, or exercise on a regular basis?",
        "changeBody": 50,
        "changeMind": 1,
        "changeSense": 1,
        "changeRelations": 2.5,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q2",
        "desc": "Do you eat healthy?",
        "changeBody": 50,
        "changeMind": 1,
        "changeSense": 1,
        "changeRelations": 1,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q3",
        "desc": "Do you feel like having enough energy for daily activities?",
        "changeBody": 50,
        "changeMind": 50,
        "changeSense": 1,
        "changeRelations": 1,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q4",
        "desc": "Do you often talk to people you like?",
        "changeBody": 10,
        "changeMind": 40,
        "changeSense": 50,
        "changeRelations": 1,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q5",
        "desc": "Do you have an active social life?",
        "changeBody": 20,
        "changeMind": 20,
        "changeSense": 30,
        "changeRelations": 30,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q6",
        "desc": "Do you have good relations with your friends and family?",
        "changeBody": 20,
        "changeMind": 20,
        "changeSense": 20,
        "changeRelations": 40,
        "changeJourney": 1,
        "changeLove": 1
    },
    {
        "shortcode": "Q7",
        "desc": "Do you enjoy what you are working on at your job?",
        "changeBody": 10,
        "changeMind": 20,
        "changeSense": 20,
        "changeRelations": 10,
        "changeJourney": 40,
        "changeLove": 1
    },
    {
        "shortcode": "Q8",
        "desc": "Do you have hobbies you like to follow?",
        "changeBody": 10,
        "changeMind": 10,
        "changeSense": 20,
        "changeRelations": 10,
        "changeJourney": 10,
        "changeLove": 40
    },
    {
        "shortcode": "Q9",
        "desc": "Do you feel loved?",
        "changeBody": 20,
        "changeMind": 10,
        "changeSense": 10,
        "changeRelations": 10,
        "changeJourney": 20,
        "changeLove": 20
    },
    {
        "shortcode": "Q10",
        "desc": "Do you want to learn new things?",
        "changeBody": 10,
        "changeMind": 20,
        "changeSense": 10,
        "changeRelations": 20,
        "changeJourney": 10,
        "changeLove": 30
    },
    {
        "shortcode": "Q11",
        "desc": "Do you have your own projects you work on?",
        "changeBody": 10,
        "changeMind": 20,
        "changeSense": 20,
        "changeRelations": 20,
        "changeJourney": 10,
        "changeLove": 10
    },
    {
        "shortcode": "Q12",
        "desc": "Do you enjoy yourself?",
        "changeBody": 10,
        "changeMind": 10,
        "changeSense": 10,
        "changeRelations": 10,
        "changeJourney": 10,
        "changeLove": 10
    }
];

exports.initInsertQuestions = async () => {
    for (const questionData of questionsData) {
        try {
            const existingQuestion = await QuestionModel.findOne({ shortcode: questionData.shortcode });
            if (existingQuestion) {
                continue; 
            }

            const question = new QuestionModel(questionData);
            await question.save();
        } catch (error) {
            console.error('Error adding question to the database:', error);
        }
    }
    console.log('Question collection initialized.');
};

exports.listAllQuestions = (limit) => {
    return new Promise((resolve, reject) => {
        QuestionModel.find()
            .limit(limit)
            .then((question) => {
                resolve(question);
            })
            .catch((err) => {
                reject(err);
            })
    });
};

exports.findByShortcode = async (shortcode) => {
    try {
        const question = await QuestionModel.findOne({ shortcode: shortcode }).lean();
        if (question) {
            return question;
        } else {
            return null;
        }
    } catch (err) {
        console.error(err);
    }
};

exports.deleteAll = () => {
    return QuestionModel.deleteMany({});
};