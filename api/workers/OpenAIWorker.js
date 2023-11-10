const openai = require('../utils/openai.config')

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
        console.log('Searching for inspiration quote from OpenAI.')
        const inspirationQuoteResponse = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: 'user',
                content: `Tell application user something that will make his day better and motivate him.`
            }],
            max_tokens: 250
        });
        const quote = inspirationQuoteResponse.choices[0].message.content;
        console.log('Inspiration quote set to:', quote)
        response.json({ inspirationQuote: quote });
    } catch (err) {
        console.error(err);
        response.status(500).json({ inspirationQuote: "This is a default inspiration quote, since no data could be retrieved from OpenAI." });
    }
}


