// Imports the Google Cloud client library
const textToSpeech = require("@google-cloud/text-to-speech");

// Import other required libraries
const fs = require("fs");
const util = require("util");
const { promisify } = require("util");
const exec = promisify(require("child_process").exec);

// Creates a client
const client = new textToSpeech.TextToSpeechClient();

async function tts(text = "no text provided") {
  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: "en-GB", ssmlGender: "MALE" },
    // select the type of audio encoding
    audioConfig: { audioEncoding: "MP3" }
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);

  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile("response.mp3", response.audioContent, "binary");
  console.log("Audio content written to file: output.mp3");

  await exec("/usr/bin/python src/play.py");
}

module.exports = tts;
