"use strict";

const convo = [];

function microphoneStream(encoding, sampleRateHertz, languageCode) {
  const recorder = require("node-record-lpcm16");
  const cb = require("cleverbot-free");
  const speech = require("@google-cloud/speech");
  const client = new speech.SpeechClient();

  const config = {
    encoding,
    sampleRateHertz,
    languageCode
  };

  const request = {
    config,
    interimResults: false
  };

  const recognizeStream = client
    .streamingRecognize(request)
    .on("error", console.error)
    .on("data", async (data) => {
      if (!data.results[0] && data.results[0].alternatives[0]) console.log("\n\nReached transcription time limit, press Ctrl+C\n");
      const transcript = data.results[0].alternatives[0].transcript;

      console.log(`[Transcript  ]: ${transcript}`);

      convo.push(transcript);
      setTimeout(() => convo.splice(convo.indexOf(transcript), 1), 60000);

      const res = await cb(transcript, convo);
      require("./tts")(res || "Oops. I missed that!");

      console.log(`[Response    ]: ${res}`);

      convo.push(res);
      setTimeout(() => convo.splice(convo.indexOf(res), 1), 60000);
    });

  recorder
    .record({
      sampleRateHertz,
      threshold: 0,
      recordProgram: "rec",
      silence: "5.0"
    })
    .stream()
    .on("error", console.error)
    .pipe(recognizeStream);

  console.log("Listening, press Ctrl+C to stop.");
}

require("yargs")
  .demand(1)
  .command("micStreamRecognize", "Streams audio input from microphone, translates to text", {}, (opts) => microphoneStream(opts.encoding, opts.sampleRateHertz, opts.languageCode))
  .options({
    encoding: {
      alias: "e",
      default: "LINEAR16",
      global: true,
      requiresArg: true,
      type: "string"
    },
    sampleRateHertz: {
      alias: "r",
      default: 16000,
      global: true,
      requiresArg: true,
      type: "number"
    },
    languageCode: {
      alias: "l",
      default: "en-US",
      global: true,
      requiresArg: true,
      type: "string"
    }
  })
  .example("node $0 micStreamRecognize")
  .wrap(120)
  .recommendCommands()
  .epilogue("For more information, see https://cloud.google.com/speech/docs")
  .help()
  .strict().argv;
