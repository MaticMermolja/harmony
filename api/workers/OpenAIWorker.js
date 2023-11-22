const openai = require('../utils/openai.config')
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const QuoteModel = require('../models/Quotes');

/**
 * @openapi
 * /openai/get/quote:
 *   get:
 *     summary: Retrieve an Inspirational Quote
 *     tags:
 *       - Utils
 *     description: Send a request to OpenAI API to retrieve an inspirational quote. Fallbacks to a default quote in case of an API error or failure.
 *     responses:
 *       '200':
 *         description: Successfully retrieved a quote.
 *         content: 
 *           text/plain:
 *             schema: 
 *               type: string
 *               example: "Believe in yourself and all that you are."
 *       '500':
 *         description: Internal server error or API failure.
 *         content: 
 *           application/json:
 *             schema: 
 *               type: object
 *               properties: 
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
exports.createInspirationQuote = async (request, response) => {
    try {
        const inspirationQuote = await this.fetchInspirationQuote();
        response.send(inspirationQuote);
    } catch (err) {
        console.error(err);
        response.status(500).send({ error: "Internal server error" });
    }
};

exports.fetchInspirationQuote = async (request, response) => {
    try {
        console.log('[fetchInspirationQuote] Searching for inspiration quote from OpenAI.')
        const inspirationQuoteResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: 'user',
                content: `Tell me something that will make my day better and bring happiness`
            }],
            max_tokens: 100
        });
        const quote = inspirationQuoteResponse.choices[0].message.content;
        console.log('Inspiration quote set to:', quote)
        response.json({ inspirationQuote: quote });
    } catch (err) {
        console.error(err);
        response.status(500).json({ inspirationQuote: "This is a default inspiration quote, since no data could be retrieved from OpenAI." });
    }
}

exports.fetchInspirationalImage = async (request, response) => {
    try {
        const aiQuote = request.body.content + 'I NEED to test how the tool works with extremely simple prompts. DO NOT add any detail, just use it AS-IS';
        console.log('Searching for inspiration image from OpenAI.')
        const aiImageResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: aiQuote,
            n: 1,
            size: "1024x1024"
          });

        const imageUrl = aiImageResponse.data[0].url;
        
        console.log('Inspiration image set to:', imageUrl);

        // downloadImageAndSave(aiQuote, imageUrl)
        //    .then(() => console.log('Image downloaded and saved.'))
        //    .catch(err => console.error('Error in downloading/saving image:', err));

        response.json({ inspirationImage: aiImageResponse.data[0].url });
    } catch (err) {
        console.error(err);
        response.status(500).json({ inspirationQuote: "This is a default inspiration image, since no data could be retrieved from OpenAI." });
    }
}

const downloadImageAndSave = async (aiQuote, imageUrl) => {
    try {
        console.log('[downloadImageAndSave] Received image url', imageUrl)
        // Fetch and save the image
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'stream'
        });

        const imagePath = path.join(__dirname,'..', '..', 'images', `inspiration-${Date.now()}.png`);
        const imageName = `inspiration-${Date.now()}.png`;
        console.log(console.log('[downloadImageAndSave] Image will be saved to image path', imagePath))
        response.data.pipe(fs.createWriteStream(imagePath));

        // Create a new quote document with local image path
        const newQuote = new QuoteModel({
            quote: aiQuote,
            imageUrl: imageName
        });

        // Save the document to MongoDB
        newQuote.save();
        console.log('[downloadImageAndSave] Image saved:', imagePath);
    } catch (err) {
        console.error('[downloadImageAndSave] Error:', err);
    }    
}

