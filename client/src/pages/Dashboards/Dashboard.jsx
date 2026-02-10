import { Mic, Pause, Play, Sidebar, Square, Trash2, Upload, ArrowBigDownDash } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SidebarDemo } from "../../components/Sidebar.jsx";
import { StatusCard, Card, PopUp } from "../../components/exports.js";
import { LoaderOne, LoaderTwo } from "../../components/ui/loader.jsx";
import { PulsatingButton } from "../../components/ui/pulsating-button.jsx";
import { Spinner } from "@heroui/spinner";
import FlowingBubble from "../../components/FlowingBubble.jsx";

export default function Dashboard() {
	const [recordingState, setRecordingState] = useState("idle");
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

	const startRecording = async () => {
		try {
			if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
				alert(
					"Your browser doesn't support audio recording. Please use Chrome, Firefox, or Edge.",
				);
				return;
			}

			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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
				stream.getTracks().forEach((track) => track.stop());
			};

			mediaRecorderRef.current.start(1000);
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
			mediaRecorderRef.current.stream
				.getTracks()
				.forEach((track) => track.stop());
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
	};

	const uploadRecording = () => {
		alert("Upload functionality would be implemented here!");
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

	const onExpand = () => {
		setIsVisible(!isVisible);
	};

	const NoteCard = [
		{
			title: "Note 1",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was \"Bon,\" which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend's chosen trade, and mostly my own, too–Mark Twain's observation undoubtedly applies: \"I didn't have time to write a short letter, so I wrote a long one instead.\" The principle holds across genres, in letters, reporting, and other writing. It's harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",
		},
		{
			title: "Note 2",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was \"Bon,\" which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend's chosen trade, and mostly my own, too–Mark Twain's observation undoubtedly applies: \"I didn't have time to write a short letter, so I wrote a long one instead.\" The principle holds across genres, in letters, reporting, and other writing. It's harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",
		},
		{
			title: "Note 3",
			content: "A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was \"Bon,\" which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend's chosen trade, and mostly my own, too–Mark Twain's observation undoubtedly applies: \"I didn't have time to write a short letter, so I wrote a long one instead.\" The principle holds across genres, in letters, reporting, and other writing. It's harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq content: A week ago a friend invited a couple of other couples over for dinner. Eventually, the food (but not the wine) was cleared off the table for what turned out to be some fierce Scrabbling. Heeding the strategy of going for the shorter, more valuable word over the longer cheaper word, our final play was \"Bon,\" which–as luck would have it!–happens to be a Japanese Buddhist festival, and not, as I had originally asserted while laying the tiles on the board, one half of a chocolate-covered cherry treat. Anyway, the strategy worked. My team only lost by 53 points instead of 58.Just the day before, our host had written of the challenges of writing short. In journalism–my friend's chosen trade, and mostly my own, too–Mark Twain's observation undoubtedly applies: \"I didn't have time to write a short letter, so I wrote a long one instead.\" The principle holds across genres, in letters, reporting, and other writing. It's harder to be concise than to blather. (Full disclosure, this blog post will clock in at a blather-esq",
		},
	];

	const StatCard = [
		{
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
		},
	];

	return (
		<motion.div className="min-h-fit bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 overflow-y-hidden">
			{/* Ambient background elements */}
			<div className="fixed inset-0 pointer-events-none">
				<div className=" top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/20 via-blue-200/10 to-transparent rounded-full blur-3xl" />
				<div className=" bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/20 via-purple-200/10 to-transparent rounded-full blur-3xl" />
			</div>

			<main className="relative min-h-screen flex flex-col max-w-[1800px] ">
				{/* Header Section */}
				<div className="flex w-full justify-between items-start gap-8 flex-wrap lg:flex-nowrap">
					<div className="flex-1 min-w-[300px]">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.6 }}
							className="inline-block"
						>
							<div className="text-xs font-mono tracking-[0.3em] text-slate-400 mb-6 uppercase">
								Dashboard
							</div>
						</motion.div>

						<div className="space-y-3">
							<motion.h2
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.4, duration: 0.6 }}
								className="text-5xl md:text-6xl lg:text-7xl font-light text-slate-800 leading-tight"
							>
								Welcome back,
							</motion.h2>
							<motion.h2
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5, duration: 0.6 }}
								className="text-5xl md:text-6xl lg:text-7xl font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
							>
								Abhinav
							</motion.h2>

							{loading ? (
								<LoaderOne />
							) : (
								<motion.p
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.6, duration: 0.6 }}
									className="text-sm font-light text-slate-500 pt-4 flex items-center gap-2"
								>
									<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
									Last note created 2 hours ago
								</motion.p>
							)}
						</div>
					</div>

					{/* Stats Grid */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.6 }}
						className="grid grid-cols-1 gap-4 min-w-[280px]"
					>
						{StatCard.map((stat, index) => (
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
								key={index}
								className="group relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								<div className="relative bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
									<div className="text-xs font-mono tracking-wider text-slate-500 uppercase mb-2">
										{stat.title}
									</div>
									<div className="text-3xl font-light text-slate-800">
										{stat.value}
									</div>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>

				{/* Central Recording Bubble */}
				<div className="flex flex-col items-center gap-8 lg:py-20 mix-blend-multiply -mt-40">
					<motion.div
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							duration: 0.8,
							delay: 0.7,
							scale: { type: "spring", visualDuration: 0.6, bounce: 0.3 },
						}}
						className="relative"
					>
						<FlowingBubble />
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 1, duration: 0.6 }}
						className="text-center space-y-2"
					>
						<p className="text-lg font-light text-slate-600">
							One tap to start thinking out loud
						</p>
						
					</motion.div>
				</div>

				{/* Notes Section */}
				<div className="w-full mix-blend-multiply -mt-20">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="mb-8"
					>
						<h3 className="text-xs font-mono tracking-[0.3em] text-slate-400 uppercase mb-6">
							Recent Notes
						</h3>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{NoteCard.map((note, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
								className="group relative"
							>
								<div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								<div className="relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden">
									{/* Decorative corner accent */}
									<div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-transparent rounded-bl-3xl" />
									
									<div className="relative space-y-4">
										<div className="flex items-start justify-between">
											<h4 className="text-lg font-medium text-slate-800">
												{note.title}
											</h4>
											<div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
										</div>
										
										<p className="text-sm font-light text-slate-600 leading-relaxed line-clamp-6">
											{note.content}
										</p>
										
										<div className="pt-2 flex items-center justify-between">
											<span className="text-xs font-mono text-slate-400">
												2h ago
											</span>
											<button
												onClick={onExpand}
												className="text-xs font-mono text-purple-600 hover:text-purple-700 tracking-wide uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
											>
												Expand →
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>

				{/* Modal */}
				<AnimatePresence>
					{isVisible && (
						<>
							{/* Backdrop */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}
								className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-40"
								onClick={onExpand}
							/>

							{/* Modal container */}
							<motion.div
								className="fixed inset-0 z-50 flex items-center justify-center p-4"
								initial={{ opacity: 0, scale: 0.95 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ duration: 0.3 }}
							>
								<div className="relative bg-white/90 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[80vh] overflow-auto">
									<PopUp
										title="Note 1"
										recordDate="Recorded 2 hours ago"
										content="Full transcription text here..."
										removePopUp={onExpand}
									/>
								</div>
							</motion.div>
						</>
					)}
				</AnimatePresence>
			</main>
		</motion.div>
	);
}