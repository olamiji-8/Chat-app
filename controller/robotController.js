const robotResponses = require("../models/robotResponses");

const getRandomResponse = (req, res) => {
  try {
    const { message } = req.body; 
    console.log("User's message:", message);

    const randomIndex = Math.floor(Math.random() * robotResponses.length);
    const response = robotResponses[randomIndex];

    res.status(200).json({ reply: response });
  } catch (error) {
    console.error(error); // Log errors for debugging
    res.status(500).json({ error: "Something went wrong!" });
  }
};

module.exports = { getRandomResponse };
