# aws-transcribe-interpreter
A simple script that turns AWS Transcribe JSON output into human readable text files.

Takes audio with exactly two speakers and outputs a text file with the following format:

```
(HH:mm:ss) Speaker One: The transcribed text of the first thing said by the first speaker.

(HH:mm:ss) Speaker Two: The transcribed text of the first thing said by the second speaker.

... etc.
```

This script currently has no error handling and the code can probably be optimised a lot more, but it gets the job done.
