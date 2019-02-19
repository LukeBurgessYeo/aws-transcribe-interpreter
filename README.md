# aws-transcribe-interpreter

A simple script that turns AWS Transcribe JSON output into human readable text files.

Takes transcribed JSON and outputs a text file with the following format:

```
(HH:mm:ss) Speaker One: The transcribed text of the first thing said by the first speaker.

(HH:mm:ss) Speaker Two: The transcribed text of the first thing said by the second speaker.

... etc.
```

TODO: error handling, optimise code, add additional options.
