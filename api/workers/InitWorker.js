const QuestionModel = require('../models/Question');

exports.showQuestions = async (request, response) => {
    try {
        // Find all questions in the database
        const questions = await QuestionModel.listAllQuestions();

        // Send the questions as a JSON response
        response.json(questions);
    } catch (error) {
        console.error('Error fetching questions from the database:', error);
        response.status(500).json({ error: 'Internal server error' });
    }
};

