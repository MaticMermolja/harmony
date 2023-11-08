const env = require('../env.js')
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: env.openai_api_key,
});

module.exports = openai