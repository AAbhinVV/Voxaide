import { Pause, Play, Square, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PopUp } from "../../components/exports.js";
import { Spinner } from "@heroui/spinner";
import FlowingBubble from "../../components/FlowingBubble.jsx";
import AudioVisualizer from "../../components/AudioVisualizer.jsx";
import { useAudioContext } from "../../hooks/exports.js";

export default function Dashboard() {
	const {
		recordingState,
		elapsed,
		streamRef,
		startRecording,
		pauseRecording,
		resumeRecording,
		stopRecording,
		discardRecording,
		uploadRecording,
		formatTime,
	} = useAudioContext();

	const [loading, isLoading] = useState(true);
	const [isVisible, setIsVisible] = useState(false);

	setTimeout(() => {
		isLoading(false);
	}, 3000);

	const onExpand = () => {
		setIsVisible(!isVisible);
	};

	const isRecordingMode = recordingState !== "idle";

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
			color: "text-purple-600",
		},
		{
			title: "Total Recordings",
			value: "35",
			color: "text-blue-600",
		},
		{
			title: "Time Saved",
			value: "5hrs",
			color: "text-green-600",
		},
	];

	return (
		<motion.div className="h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 overflow-hidden">
			{/* Ambient background elements */}
			<div className="fixed inset-0 pointer-events-none">
				<div className=" top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-purple-200/20 via-blue-200/10 to-transparent rounded-full blur-3xl" />
				<div className=" bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/20 via-purple-200/10 to-transparent rounded-full blur-3xl" />
			</div>

			<main className="relative h-full flex flex-col max-w-[1800px] overflow-hidden">
				{/* ===== IDLE MODE: Normal dashboard content ===== */}
				<AnimatePresence mode="wait">
					{!isRecordingMode && (
						<motion.div
							key="idle-content"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0, scale: 0.97 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col h-full"
						>
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
											<Spinner size="sm" color="primary" />
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
												<div className="text-xs font-headings tracking-wider text-slate-500 uppercase mb-2">
													{stat.title}
												</div>
												<div className={`text-3xl font-bold font-body ${stat.color}`}>
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
									<FlowingBubble onClick={startRecording} />
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
						</motion.div>
					)}

					{/* ===== RECORDING / PAUSED MODE ===== */}
					{(recordingState === "recording" || recordingState === "paused") && (
						<motion.div
							key="recording-content"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col items-center justify-center h-full gap-8"
						>
							{/* Recording indicator */}
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.4 }}
								className="flex items-center gap-3"
							>
								<span
									className="w-3 h-3 rounded-full bg-red-500"
									style={{
										animation: recordingState === "recording" ? "recording-pulse 1.5s ease-in-out infinite" : "none",
									}}
								/>
								<span className="text-sm font-mono tracking-[0.2em] text-slate-500 uppercase">
									{recordingState === "recording" ? "Recording" : "Paused"}
								</span>
							</motion.div>

							{/* Elapsed Timer */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.3, duration: 0.4 }}
								className="text-5xl md:text-6xl font-light font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
							>
								{formatTime(elapsed)}
							</motion.div>

							{/* Audio Visualizer */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.5 }}
								className="w-full max-w-2xl h-40 relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-indigo-500/10 to-purple-500/5 rounded-3xl" />
								<div className="relative w-full h-full p-4">
									{streamRef.current && (
										<AudioVisualizer
											audioStream={streamRef.current}
											isPaused={recordingState === "paused"}
											className="w-full h-full"
										/>
									)}
								</div>
							</motion.div>

							{/* Recording Controls */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.4 }}
								className="flex items-center gap-6"
							>
								{/* Pause / Resume Button */}
								<button
									onClick={recordingState === "recording" ? pauseRecording : resumeRecording}
									className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
								>
									<div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									{recordingState === "recording" ? (
										<Pause className="w-6 h-6 text-slate-700 relative z-10" />
									) : (
										<Play className="w-6 h-6 text-slate-700 relative z-10 ml-1" />
									)}
								</button>

								{/* Stop Button */}
								<button
									onClick={stopRecording}
									className="group relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
								>
									<Square className="w-7 h-7 text-white fill-white relative z-10" />
								</button>
							</motion.div>
						</motion.div>
					)}

					{/* ===== STOPPED MODE: Upload / Discard ===== */}
					{recordingState === "stopped" && (
						<motion.div
							key="stopped-content"
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col items-center justify-center h-full gap-10"
						>
							{/* Completion message */}
							<motion.div
								initial={{ opacity: 0, y: -20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2, duration: 0.4 }}
								className="text-center space-y-3"
							>
								<div className="text-xs font-mono tracking-[0.3em] text-slate-400 uppercase">
									Recording Complete
								</div>
								<div className="text-3xl md:text-4xl font-light text-slate-700">
									{formatTime(elapsed)}
								</div>
							</motion.div>

							{/* Waveform preview placeholder */}
							<motion.div
								initial={{ opacity: 0, scaleX: 0 }}
								animate={{ opacity: 1, scaleX: 1 }}
								transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
								className="w-full max-w-md h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent rounded-full"
							/>

							{/* Action Buttons */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4, duration: 0.5 }}
								className="flex items-center gap-6"
							>
								{/* Discard Button */}
								<button
									onClick={discardRecording}
									className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
								>
									<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-400/10 to-rose-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
									<Trash2 className="w-5 h-5 text-red-500 relative z-10" />
									<span className="text-sm font-medium text-slate-700 relative z-10">
										Discard
									</span>
								</button>

								{/* Upload Button */}
								<button
									onClick={uploadRecording}
									className="group relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
								>
									<Upload className="w-5 h-5 text-white relative z-10" />
									<span className="text-sm font-medium text-white relative z-10">
										Upload
									</span>
								</button>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Modal — always available regardless of recording state */}
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

			{/* Recording pulse animation */}
			<style>{`
				@keyframes recording-pulse {
					0%, 100% { opacity: 1; transform: scale(1); }
					50% { opacity: 0.5; transform: scale(1.3); }
				}
			`}</style>
		</motion.div>
	);
}