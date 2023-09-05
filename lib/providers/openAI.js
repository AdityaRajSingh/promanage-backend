const { OpenAI: OpenAIClient } = require("openai");

class OpenAIProvider {
  getInstance() {
    return new OpenAIClient({
      apiKey: process.env.OPENAI_KEY,
    });
  }
}

module.exports = new OpenAIProvider();
