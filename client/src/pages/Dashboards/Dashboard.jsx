import { Mic, Pause, Play, Sidebar, Square, Trash2, Upload, ArrowBigDownDash } from "lucide-react";
import { useRef, useState } from "react";
import{ AnimatePresence, motion, useAnimate } from "motion/react";
import { SidebarDemo } from "../../components/Sidebar.jsx";
import {StatusCard, Card, PopUp} from "../../components/exports.js";
import { LoaderOne, LoaderTwo } from "../../components/ui/loader.jsx";
import { PulsatingButton } from "../../components/ui/pulsating-button.jsx";
import {Spinner} from "@heroui/spinner";

export default function Dashboard() {
	const [recordingState, setRecordingState] = useState("idle"); // idle, recording, paused, stopped
	const [recordingUrl, setRecordingUrl] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [loading, isLoading] = useState(true);
	const [isVisible, setIsVisible] = useState(false);
	const audioRef = useRef(null);
	const mediaRecorderRef = useRef(null);
	const chunksRef = useRef([]);
	

	setTimeout(() => {
		isLoading(false);
	}, 3000);

	// const startRecording = async () => {
	// 	try {
	// 		// Check if MediaRecorder is supported
	// 		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
	// 			alert(
	// 				"Your browser doesn't support audio recording. Please use Chrome, Firefox, or Edge.",
	// 			);
	// 			return;
	// 		}

	// 		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

	// 		// Check for supported MIME types
	// 		let mimeType = "audio/webm";
	// 		if (!MediaRecorder.isTypeSupported("audio/webm")) {
	// 			if (MediaRecorder.isTypeSupported("audio/mp4")) {
	// 				mimeType = "audio/mp4";
	// 			} else if (MediaRecorder.isTypeSupported("audio/ogg")) {
	// 				mimeType = "audio/ogg";
	// 			}
	// 		}

	// 		mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
	// 		chunksRef.current = [];

	// 		mediaRecorderRef.current.ondataavailable = (e) => {
	// 			if (e.data.size > 0) {
	// 				chunksRef.current.push(e.data);
	// 			}
	// 		};

	// 		mediaRecorderRef.current.onstop = () => {
	// 			const blob = new Blob(chunksRef.current, { type: mimeType });
	// 			const url = URL.createObjectURL(blob);
	// 			setRecordingUrl(url);
	// 			stream.getTracks().forEach((track) => track.stop());
	// 		};

	// 		mediaRecorderRef.current.start(1000); // Collect data every second
	// 		setRecordingState("recording");
	// 	} catch (err) {
	// 		console.error("Error accessing microphone:", err);
	// 		if (
	// 			err.name === "NotAllowedError" ||
	// 			err.name === "PermissionDeniedError"
	// 		) {
	// 			alert(
	// 				"Microphone access denied. Please allow microphone permissions and try again.",
	// 			);
	// 		} else if (err.name === "NotFoundError") {
	// 			alert(
	// 				"No microphone found. Please connect a microphone and try again.",
	// 			);
	// 		} else {
	// 			alert("Could not access microphone: " + err.message);
	// 		}
	// 	}
	// };

	// const pauseRecording = () => {
	// 	if (mediaRecorderRef.current && recordingState === "recording") {
	// 		mediaRecorderRef.current.pause();
	// 		setRecordingState("paused");
	// 	}
	// };

	// const resumeRecording = () => {
	// 	if (mediaRecorderRef.current && recordingState === "paused") {
	// 		mediaRecorderRef.current.resume();
	// 		setRecordingState("recording");
	// 	}
	// };

	// const stopRecording = () => {
	// 	if (mediaRecorderRef.current) {
	// 		mediaRecorderRef.current.stop();
	// 		mediaRecorderRef.current.stream
	// 			.getTracks()
	// 			.forEach((track) => track.stop());
	// 		setRecordingState("stopped");
	// 	}
	// };

	// const discardRecording = () => {
	// 	if (recordingUrl) {
	// 		URL.revokeObjectURL(recordingUrl);
	// 	}
	// 	setRecordingUrl(null);
	// 	setRecordingState("idle");
	// 	setIsPlaying(false);
	// };

	// const uploadRecording = () => {
	// 	alert("Upload functionality would be implemented here!");
	// 	// Implement your upload logic
	// };

	// const togglePlayPause = () => {
	// 	if (audioRef.current) {
	// 		if (isPlaying) {
	// 			audioRef.current.pause();
	// 		} else {
	// 			audioRef.current.play();
	// 		}
	// 		setIsPlaying(!isPlaying);
	// 	}
	// };

	const onExpand = () => {
		setIsVisible(!isVisible)
	}

	

	const NoteCard = [
		{
			title: "Note 1",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was “Bon,” which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend’s chosen trade, and mostly my own, too–Mark Twain’s observation undoubtedly applies: “I didn’t have time to write a short letter, so I wrote a long one instead.” The principle holds across genres, in letters, reporting, and other writing. It’s harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",

		},

		{
			title: "Note 2",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was “Bon,” which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend’s chosen trade, and mostly my own, too–Mark Twain’s observation undoubtedly applies: “I didn’t have time to write a short letter, so I wrote a long one instead.” The principle holds across genres, in letters, reporting, and other writing. It’s harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",

		},

		{
			title: "Note 3",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was “Bon,” which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend’s chosen trade, and mostly my own, too–Mark Twain’s observation undoubtedly applies: “I didn’t have time to write a short letter, so I wrote a long one instead.” The principle holds across genres, in letters, reporting, and other writing. It’s harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq content: A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was “Bon,” which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend’s chosen trade, and mostly my own, too–Mark Twain’s observation undoubtedly applies: “I didn’t have time to write a short letter, so I wrote a long one instead.” The principle holds across genres, in letters, reporting, and other writing. It’s harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",

		},

	];

	const StatCard = [{
		title: "Total Notes",
		value: "150",
	},
	{
		title: "Total Recordings",
		value: "35",
	},
	{
		title: "Time Saved",
		value: "5hrs",
	}
]

	return (
		
		<motion.div>
			
			{/* <SidebarDemo> */}
				{/* Main Content */}
				<main className="min-h-screen flex flex-col gap-6 p-8 w-full ml-[30px] ">
					<div className="isolate">
						<div className="flex w-full h-auto justify-between items-start gap-8 mix-blend-multiply">
							<div className="">
								<motion.h1 
								initial = {{ opacity: 0, y: 20 }}
								animate = {{ opacity: 1, y: 0 }}
								transition = {{ delay: 0.5, duration: 0.5 }}
								className="text-lg font-headings font-medium tracking-widest">HOME</motion.h1>
								<div className="font-body tracking-wider mt-8">
									<motion.h2 
									initial={{ opacity: 0, x: -20 }} 
									animate={{ opacity: 1, x: 0 }} 
									transition={{ delay: 0.7, duration: 0.5 }} 
									className="text-6xl font-normal">
										Welcome Back, 
									<motion.span 
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.9, duration: 0.5 }}
									className="italic font-accent"> Abhinav!</motion.span></motion.h2>

									{loading ? <LoaderOne  /> : 
									<motion.h4 
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 1.1, duration: 0.5 }}
									className="text-lg italic m-2 opacity-50">- last note created 2 hrs ago</motion.h4>}
									
								</div>
							</div>

							<div className="grid grid-row-3 gap-3">

								{StatCard.map((stat, index) => {
										return(
											<motion.div
												initial={{ opacity: 0, y: -30 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{ delay: 0.4 + index * 0.2, duration: 0.5 }}
												key={index}
											>

												<StatusCard title = {stat.title} value={stat.value} className="max-w-lg w-full h-fit shadow-lg backdrop-blur-xl bg-white rounded-lgm-2 px-4 py-5" />
											</motion.div>
										)
									})}
							</div>
						</div>

						<div className="flex flex-col gap-8 items-center w-full font-body tracking-wider mix-blend-multiply -mt-20 ">
							<motion.div
								initial = {{opacity: 0, scale: 0}}
								animate = {{opacity: 1, scale: 1}}
								transition={{
									duration: 0.6,
									scale: {type: 'spring', visualDuration: 0.4, bounce: 0.3}
								}}
							>
								<button className="bg-gradient-to-r from bg-brand-accent/40 via-transparent to-brand-accent/40 h-75 w-75 rounded-full items-center flex justify-center">
									<svg 
										xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="2" 
										stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mic-icon lucide-mic"><path d="M12 19v3"/><path 
										d="M19 10v2a7 7 0 0 1-14 0v-2"/><rect x="9" y="2" width="6" height="13" rx="3"/>
									</svg>
								</button>
							</motion.div>
							
							<motion.p
							intial = {{opacity: 0, y:-20}}
							animate = {{opacity: 1, y:0}}
							transition = {{delay: 0.8, duration: 1}}
							className="text-lg italic opacity-50"
							>One tap to start thinking out loud</motion.p>
						</div>
					</div>

					<div className="w-full">
						<div className="flex flex-row justify-between items-center">
							{NoteCard.map((note, index) => {
								return(
									<motion.div
										key={index}
										initial={{ opacity: 0, x: 30 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 + index * 0.2 }}
									>
										<Card title={note.title} content={note.content} onExpand={onExpand} className="max-w-lg h-50 text-justify" />
									</motion.div>
								)
							})}
						</div>
					</div>

					<div className="self-center">
						<AnimatePresence>
							{isVisible && (
								<>
								{/* Backdrop */}
								<motion.div
									transition={{duration: 0.5}}
									exit = {{opacity: 0}}
									className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
									
								/>

								{/* Modal container */}
								<motion.div
									className="fixed inset-0 z-50 flex items-center justify-center p-4"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									
									exit={{ opacity: 0, scale: 0.9 }}
								>
									<PopUp
									title="Note 1"
									recordDate="Recorded 2 hours ago"
									content="Full transcription text here..."
									removePopUp={onExpand}
									/>
								</motion.div>
								</>
							)}
						</AnimatePresence>

					</div>
				</main>

				

  			{/* </SidebarDemo> 	 */}
		</motion.div>
		
	);
}














// <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 flex flex-col">
		// 	{/* Header */}
		// 	<header className="p-8">
		// 		<div className="flex items-center gap-4">
		// 			<div className="text-4xl font-extralight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700">
		// 				VOXAIDE
		// 			</div>
		// 			<div className="flex-1" />
		// 		</div>
		// 	</header>

		// 	{/* Main Content */}
		// 	<main className="flex-1 flex items-center justify-center p-8">
		// 		<div className="w-full max-w-2xl">
		// 			{/* Idle State - Start Recording Button */}
		// 			{recordingState === "idle" && (
		// 				<div className="flex flex-col items-center gap-8">
		// 					<div className="relative">
		// 						<button
		// 							onClick={startRecording}
		// 							className="group relative w-48 h-48 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center"
		// 						>
		// 							<div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-400/20 to-slate-500/20 blur-xl group-hover:blur-2xl transition-all" />
		// 							<Mic className="w-20 h-20 text-slate-700 relative z-10" />
		// 						</button>
		// 					</div>
		// 					<p className="text-slate-600 text-lg font-light">
		// 						Click to start recording
		// 					</p>
		// 				</div>
		// 			)}

		// 			{/* Recording/Paused State - Control Buttons */}
		// 			{(recordingState === "recording" || recordingState === "paused") && (
		// 				<div className="flex flex-col items-center gap-12">
		// 					{/* Visual Indicator */}
		// 					<div className="relative">
		// 						<div
		// 							className={`w-32 h-32 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center ${
		// 								recordingState === "recording" ? "animate-pulse" : ""
		// 							}`}
		// 						>
		// 							<Mic className="w-16 h-16 text-slate-700" />
		// 						</div>
		// 						{recordingState === "recording" && (
		// 							<>
		// 								<div className="absolute inset-0 rounded-full bg-slate-400/30 animate-ping" />
		// 								<div className="absolute -top-4 -left-4 w-40 h-40 bg-slate-400/20 rounded-full blur-2xl animate-pulse" />
		// 							</>
		// 						)}
		// 					</div>

		// 					<p className="text-slate-700 text-xl font-light">
		// 						{recordingState === "recording" ? "Recording..." : "Paused"}
		// 					</p>

		// 					{/* Control Buttons */}
		// 					<div className="flex gap-6">
		// 						{recordingState === "recording" ? (
		// 							<button
		// 								onClick={pauseRecording}
		// 								className="px-8 py-4 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
		// 							>
		// 								<Pause className="w-5 h-5" />
		// 								Pause
		// 							</button>
		// 						) : (
		// 							<button
		// 								onClick={resumeRecording}
		// 								className="px-8 py-4 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
		// 							>
		// 								<Mic className="w-5 h-5" />
		// 								Resume
		// 							</button>
		// 						)}

		// 						<button
		// 							onClick={stopRecording}
		// 							className="px-8 py-4 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
		// 						>
		// 							<Square className="w-5 h-5" />
		// 							Stop
		// 						</button>
		// 					</div>
		// 				</div>
		// 			)}

		// 			{/* Stopped State - Audio Player and Actions */}
		// 			{recordingState === "stopped" && recordingUrl && (
		// 				<div className="flex flex-col items-center gap-8">
		// 					{/* Audio Player Card */}
		// 					<div className="w-full bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-2xl p-8 border border-slate-200/50">
		// 						<div className="flex flex-col gap-6">
		// 							<div className="flex items-center gap-4">
		// 								<button
		// 									onClick={togglePlayPause}
		// 									className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
		// 								>
		// 									{isPlaying ? (
		// 										<Pause className="w-6 h-6" />
		// 									) : (
		// 										<Play className="w-6 h-6 ml-1" />
		// 									)}
		// 								</button>

		// 								<div className="flex-1">
		// 									<audio
		// 										ref={audioRef}
		// 										src={recordingUrl}
		// 										onEnded={() => setIsPlaying(false)}
		// 										className="w-full"
		// 										controls
		// 									/>
		// 								</div>
		// 							</div>
		// 						</div>
		// 					</div>

		// 					{/* Action Buttons */}
		// 					<div className="flex gap-4">
		// 						<button
		// 							onClick={discardRecording}
		// 							className="px-8 py-4 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 hover:from-slate-300 hover:to-slate-400 text-slate-700 font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
		// 						>
		// 							<Trash2 className="w-5 h-5" />
		// 							Discard
		// 						</button>

		// 						<button
		// 							onClick={uploadRecording}
		// 							className="px-8 py-4 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
		// 						>
		// 							<Upload className="w-5 h-5" />
		// 							Upload Recording
		// 						</button>
		// 					</div>
		// 				</div>
		// 			)}
		// 		</div>
		// 	</main>

		// 	{/* Decorative Background Elements */}
		// 	<div className="fixed top-20 left-20 w-64 h-64 bg-slate-400/10 rounded-full blur-3xl pointer-events-none" />
		// 	<div className="fixed bottom-20 right-20 w-96 h-96 bg-slate-500/10 rounded-full blur-3xl pointer-events-none" />
		// </div>