const rootPrefix = "..",
  openAIConstants = require(rootPrefix + "/lib/globalConstant/openAI"),
  openAIProvider = require(rootPrefix + "/lib/providers/openAI");

class OpenAI {
  constructor({ projectDetails, resoucesList }) {
    const oThis = this;

    oThis.projectDetails = projectDetails;
    oThis.resoucesList = resoucesList;
  }

  async getSuggestion() {
    const oThis = this;

    oThis._preparePrompt();

    const response = await openAIProvider
      .getInstance()
      .chat.completions.create({
        model: "gpt-3.5-turbo-16k", // NOTE: gpt-3.5-turbo was giving insufficient tokens error.
        messages: [
          {
            role: "user",
            content: oThis.prompt,
          },
        ],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

    const relevantResponse = JSON.parse(
      (response.choices[0] || {}).message.content || ""
    );

    console.log(JSON.stringify(relevantResponse, null, 4));

    return relevantResponse;
  }

  _preparePrompt() {
    const oThis = this;

    let prompt = `
    You are an excellent and efficient human resource software. You efficiently allocate human resources to different projects depending upon project skill requirements, estimated delivery time, and available human resources with relevant skills.
I will provide you with project details and a list of resources with their skill sets and their ongoing projects in the sample format given below.
Project Details:
`;

    prompt += oThis.projectDetails;

    prompt += `List of resources with their skill sets and their ongoing projects:`;

    prompt += oThis.resoucesList;

    oThis.prompt = prompt;
  }
}

module.exports = OpenAI;
