const OpenAi = require("openai");

class Suggest {
  constructor({ projectDetails, resoucesList }) {
    const oThis = this;

    oThis.projectDetails = projectDetails;
    oThis.resoucesList = resoucesList;
  }

  async getSuggestions() {
    const oThis = this;

    oThis._preparePrompt();

    const prompt = oThis.prompt;

    const openAi = new OpenAi({
      apiKey: process.env.OPENAI_API_KEY,
    });

    let suggestionResponse = null;
    try {
      suggestionResponse = await openAi.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
      });
    } catch (err) {
      throw new Error(`Error while getting suggestion from OpenAI: ${err}`);
    }

    const relevantResponse =
      (suggestionResponse.choices[0] || {}).message.content || "";
    console.log("Relevant Response: ", relevantResponse);

    return relevantResponse;
  }

  _preparePrompt() {
    const oThis = this;

    let prompt = `
    You are an excellent and efficient human resource software. You efficiently allocate human resources to different projects depending upon project skill requirements, estimated delivery time, and available human resources with relevant skills.
I will provide you with project details and a list of resources with their skill sets and their ongoing projects in the sample format given below.
Project Details:
`;

    prompt += JSON.stringify(oThis.projectDetails);

    prompt += `List of resources with their skill sets and their ongoing projects:`;

    prompt += JSON.stringify(oThis.resoucesList);

    prompt += `Every developer works for 6 hours daily.
Please suggest appropriate team members in JSON format from the available resouces for the given project. Give priority to people who are not involved in other ongoing projects and their  skill levels and years of experience. 
The answer should be strictly in the JSON format consisting of an array of objects with the following keys: userId, displayName, designation, yearsOfExperience, skills and noOfOngoingProjects and with no extra information.
`;
    oThis.prompt = prompt;
  }
}

module.exports = Suggest;
