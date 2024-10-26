import React, { useState, useRef } from 'react';

const WhisperTranscription = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // Add file size limit (10MB)
  const MAX_FILE_SIZE = 10 * 1024 * 1024;

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm',  // More widely supported format
        audioBitsPerSecond: 128000  // Limit bitrate to reduce file size
      });
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size > MAX_FILE_SIZE) {
          setError('Audio file is too large. Please record a shorter message.');
          return;
        }
        setAudioBlob(audioBlob);
      };

      mediaRecorderRef.current.start(1000); // Record in 1-second chunks
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone. Please ensure microphone permissions are granted.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      
      // Check file type
      const validTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/webm', 'audio/ogg'];
      if (!validTypes.includes(file.type)) {
        setError('Invalid file type. Please upload a WAV, MP3, or WebM file.');
        return;
      }
      
      setAudioBlob(file);
      setError('');
    }
  };

  const transcribeAudio = async () => {
    if (!audioBlob) return;

    setIsLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, audioBlob.name || 'audio.webm'); // Use the original filename
      formData.append('model', 'whisper-1');

      // Add retry logic
      const maxRetries = 3;
      let retryCount = 0;
      let success = false;

      while (retryCount < maxRetries && !success) {
        try {
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer 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`, // Use environment variable for API key
              'Content-Type': 'multipart/form-data' // Set content type for multipart form
            },
            body: formData
          });

          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 5;
            await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
            retryCount++;
            continue;
          }

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Transcription failed');
          }

          const data = await response.json();
          setTranscription(data.text);
          success = true;

        } catch (err) {
          if (retryCount === maxRetries - 1) throw err;
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, 2000 * retryCount)); // Exponential backoff
        }
      }

    } catch (err) {
      if (err.message.includes('rate limit')) {
        setError('Rate limit exceeded. Please try again in a few seconds.');
      } else {
        setError(`Error transcribing audio: ${err.message}`);
      }
      console.error('Transcription error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      // Could add a temporary success message here
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Speech to Text Converter</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex-1 px-4 py-2 rounded-md text-white font-medium transition-colors ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            {isRecording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
          </button>

          <label className="flex-1">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isLoading}
            />
            <div className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-center cursor-pointer transition-colors">
              📁 Upload Audio
            </div>
          </label>
        </div>

        {audioBlob && (
          <div className="space-y-4">
            <audio controls className="w-full">
              <source src={URL.createObjectURL(audioBlob)} type={audioBlob.type} />
              Your browser does not support the audio element.
            </audio>

            <button
              onClick={transcribeAudio}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-md text-white font-medium transition-colors ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isLoading ? '⏳ Transcribing...' : '✨ Transcribe Audio'}
            </button>
          </div>
        )}
      </div>

      {transcription && (
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Transcription Result</span>
            <button
              onClick={copyToClipboard}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              📋 Copy
            </button>
          </div>
          <div className="p-4 bg-gray-50 rounded-md min-h-[100px] whitespace-pre-wrap border border-gray-200">
            {transcription}
          </div>
        </div>
      )}
    </div>
  );
};

export default WhisperTranscription;
