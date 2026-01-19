import axios from "axios";
import { CirclePause, Play, Upload } from "lucide-react";
import React, { useRef, useState } from "react";

const Recorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [recordedUrl, setRecordedUrl] = useState("");
	const [seconds, setSeconds] = useState(0);
	const [recordedBlob, setRecordedBlob] = useState(null);
	const [uploadStatus, setUploadStatus] = useState("");

	//useRef either refers to a dom element or stores an initial mutable value to its only property 'current'  doesnt re-render like useState

	const mediaStream = useRef(null); //Ref to access a Dom element
	const mediaRecorder = useRef(null); // Ref to access a Dom element
	const chunks = useRef([]); // Ref to store recorded chunks mutable value

	const startRecording = async () => {
		setIsRecording(true);

		try {
			setSeconds(0);
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaStream.current = stream; // sets mediastream current property value
			mediaRecorder.current = new MediaRecorder(stream); // same
			mediaRecorder.current.ondataavailable = (e) => {
				// event listener for dataavailable(event handler) event
				if (e.data.size > 0) {
					chunks.current.push(e.data); // push to chunks current
				}
			};

			const timer = setInterval(() => {
				setSeconds((prev) => prev + 1);
			}, 1000);

			mediaRecorder.current.onstop = () => {
				const blob = new Blob(chunks.current, { type: "audio/webm" });
				setRecordedBlob(blob);
				const url = URL.createObjectURL(blob);
				console.log(url);
				setRecordedUrl(url);

				chunks.current = [];
				clearInterval(timer); //cancels a pending timer created by setInterval
			};

			mediaRecorder.current.start();
		} catch (error) {
			console.log(error);
		}
	};

	const stopRecording = () => {
		setIsRecording(false);
		if (mediaRecorder.current) {
			mediaRecorder.current.stop();
			mediaStream.current.getTracks().forEach((track) => track.stop());
		}
	};

	const uploadBlob = async () => {
		if (!recordedBlob) return;
		try {
			setUploadStatus("Uploading");
			const fd = new FormData();
			fd.append("audioFile", recordedBlob, "recoding.webm");
			const response = await axios.post(
				"http://localhost:5000/api/v1/notes/uploadVoice",
				fd,
			);
			setUploadStatus("Upload Successful");
			console.log("Manual upload done", response.data);
		} catch (error) {
			setUploadStatus("Error");
			console.error("Error uploading file", error);
		}
	};

	const formatTime = (totalSeconds) => {
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const secs = totalSeconds % 60;

		return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	return (
		<div className="flex flex-col items-center justify-center bg-gradient-to-r ">
			{/* <h2 className='text-[100px] text-white bg-black p-4 rounded-lg mx-4'>
            {formatTime(seconds)}
        </h2> */}

			{isRecording ? (
				<button
					onClick={stopRecording}
					className="flex items-center justify-center text-[60px] bg-red-500 rounded-full p-4 text-white w-[100px] h-[100px]"
				>
					<CirclePause />
				</button>
			) : (
				<button
					onClick={startRecording}
					className="flex items-center justify-center  bg-blue-500 rounded-full p-4 text-white w-[100px] h-[100px]"
				>
					<Play /> <span>Sart Recording</span>
				</button>
			)}

			{recordedUrl && <audio controls src={recordedUrl} />}
			<button
				onClick={uploadBlob}
				disabled={!recordedBlob || uploadStatus === "Uploading"}
				className="flex items-center justify-center text-[60px] bg-green-500 rounded-full p-4 text-white w-[100px] h-[100px]"
			>
				<Upload />
			</button>

			{uploadStatus && <p className="text-white text-[20px]">{uploadStatus}</p>}
		</div>
	);
};

export default Recorder;
