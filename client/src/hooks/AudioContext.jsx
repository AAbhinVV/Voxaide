import { useEffect, useState, useContext, createContext, useRef, useCallback } from "react";

const AuthContext = createContext(null);

export const useAudioContext = () => useContext(AuthContext);

export const AudioProvider = ({ children }) => {
	const [recordingState, setRecordingState] = useState("idle");
	const [recordingUrl, setRecordingUrl] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [elapsed, setElapsed] = useState(0);
	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);
	const streamRef = useRef(null);
	const timerRef = useRef(null);

	// Timer for recording elapsed time
	useEffect(() => {
		if (recordingState === "recording") {
			timerRef.current = setInterval(() => {
				setElapsed((prev) => prev + 1);
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [recordingState]);

	const formatTime = useCallback((totalSeconds) => {
		const minutes = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}, []);

	const startRecording = async () => {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				alert(
					"Your browser doesn't support audio recording. Please use Chrome, Firefox, or Edge.",
				);
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			streamRef.current = stream;

			let mimeType = "audio/webm";
			if (!MediaRecorder.isTypeSupported("audio/webm")) {
				if (MediaRecorder.isTypeSupported("audio/mp4")) {
					mimeType = "audio/mp4";
				} else if (MediaRecorder.isTypeSupported("audio/ogg")) {
					mimeType = "audio/ogg";
				}
			}

			mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
			chunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (e) => {
				if (e.data.size > 0) {
					chunksRef.current.push(e.data);
				}
			};

			mediaRecorderRef.current.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: mimeType });
				const url = URL.createObjectURL(blob);
				setRecordingUrl(url);
			};

			mediaRecorderRef.current.start(1000);
			setElapsed(0);
			setRecordingState("recording");
		} catch (err) {
			console.error("Error accessing microphone:", err);
			if (
				err.name === "NotAllowedError" ||
				err.name === "PermissionDeniedError"
			) {
				alert(
					"Microphone access denied. Please allow microphone permissions and try again.",
				);
			} else if (err.name === "NotFoundError") {
				alert(
					"No microphone found. Please connect a microphone and try again.",
				);
			} else {
				alert("Could not access microphone: " + err.message);
			}
		}
	};

	const pauseRecording = () => {
		if (mediaRecorderRef.current && recordingState === "recording") {
			mediaRecorderRef.current.pause();
			setRecordingState("paused");
		}
	};

	const resumeRecording = () => {
		if (mediaRecorderRef.current && recordingState === "paused") {
			mediaRecorderRef.current.resume();
			setRecordingState("recording");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
			setRecordingState("stopped");
		}
	};

	const discardRecording = () => {
		if (recordingUrl) {
			URL.revokeObjectURL(recordingUrl);
		}
		setRecordingUrl(null);
		setRecordingState("idle");
		setIsPlaying(false);
		setElapsed(0);
		streamRef.current = null;
	};

	const uploadRecording = () => {
		alert("Upload functionality would be implemented here!");
		discardRecording();
	};

	const togglePlayPause = () => {
		if (audioRef.current) {
			if (isPlaying) {
				audioRef.current.pause();
			} else {
				audioRef.current.play();
			}
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<AuthContext.Provider
			value={{
				recordingState,
				recordingUrl,
				isPlaying,
				elapsed,
				audioRef,
				streamRef,
				startRecording,
				pauseRecording,
				resumeRecording,
				stopRecording,
				discardRecording,
				uploadRecording,
				togglePlayPause,
				formatTime,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};