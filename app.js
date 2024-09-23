// Variables to store elements
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const downloadBtn = document.getElementById('download-btn');
const output = document.getElementById('output');
const errorElement = document.getElementById('error');

let finalTranscript = '';  // Stores the full transcription
let interimTranscript = '';  // Stores the ongoing partial transcription

let recognition;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    alert('Your browser does not support speech recognition.');
}

// Set initial button states
stopBtn.disabled = true;
downloadBtn.disabled = true;

if (recognition) {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = function(event) {
        interimTranscript = '';  // Reset interim transcript for each result

        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                // Append final recognized words to finalTranscript
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                // Append ongoing recognition to interimTranscript
                interimTranscript += event.results[i][0].transcript + ' ';
            }
        }

        // Update the text being displayed to the user:
        output.textContent = finalTranscript + interimTranscript;  // Show both final and interim results
    };

    recognition.onstart = function() {
        console.log("Speech recognition started.");
        errorElement.textContent = '';  // Clear any previous errors
    };

    recognition.onend = function() {
        console.log("Speech recognition ended.");
        stopBtn.disabled = true;
        startBtn.disabled = false;
        downloadBtn.disabled = false;  // Enable download button when recording ends
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error: ", event.error);
        errorElement.textContent = `Error: ${event.error}`;
    };
}

startBtn.addEventListener('click', () => {
    recognition.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.disabled = true;  // Disable download button during recording
    output.textContent = "Listening...";
});

stopBtn.addEventListener('click', () => {
    recognition.stop();
    stopBtn.disabled = true;
    startBtn.disabled = false;
});

// Download the transcription as a .txt file
downloadBtn.addEventListener('click', () => {
    if (finalTranscript.trim() !== '') {
        const blob = new Blob([finalTranscript], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'transcription.txt';
        link.click();
    } else {
        errorElement.textContent = 'No transcription available to download.';
    }
});
