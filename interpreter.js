// Basic script to make AWS Transcribe output human readable.

const fs = require('fs');

// configurable options
const inputFile = 'transcriptions/Interview.json';
const outputFile = 'transcriptions/Transcribed.txt';
const speakers = ['Host', 'Guest_1', 'Guest_2']; // in the order that they speak

// read .json file into javascript object
const rawdata = fs.readFileSync(inputFile);
const data = JSON.parse(rawdata);

// get useful data from segments and items properties
const rawSegments = data.results.speaker_labels.segments.map(x => ({
  speaker: speakers[x.speaker_label.split('_')[1]],
  start: x.start_time,
  end: x.end_time
}));
const rawText = data.results.items.map(x => ({
  start: x.start_time,
  end: x.end_time,
  word: x.alternatives[0].content,
  punctuation: x.type === 'punctuation'
}));

// collapse segments with same speaker
const segments = rawSegments.reduce((acc, val) => {
  const currentSegment = acc[acc.length - 1];
  if (val.speaker === currentSegment.speaker) {
    acc[acc.length - 1] = {
      speaker: currentSegment.speaker,
      start: currentSegment.start,
      end: val.end
    }
    return acc;
  } else {
    acc.push({
      speaker: val.speaker,
      start: val.start,
      end: val.end
    });
    return acc;
  }
}, [rawSegments[0]]);

// create desired output as list of objects
const jsonOutput = segments.reduce((acc, val) => {
  const newText = rawText
    .filter(x => x.start >= Number(val.start) && x.end <= Number(val.end))
    .reduce((a, v) => {
      if (v.punctuation) {
        return a += v.word;
      } else {
        return a += ` ${v.word}`;
      }
    }, "");

  let date = new Date(null);
  date.setSeconds(val.start);
  const time = date.toISOString().substr(11, 8);

  acc.push({
    speaker: val.speaker,
    start: time,
    text: newText.toLowerCase().replace(/\w/, c => c.toUpperCase()).replace(/\bi\b/g, () => 'I')
  });
  return acc;
}, []);

// format text and write to file
const fileText = jsonOutput.map(x => `(${x.start}) ${x.speaker}:${x.text}`).join('. \n\n') + '.';

fs.writeFile(outputFile, fileText, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("The file was saved!");
});