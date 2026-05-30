import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { getAllNotesRequest } from "../../apis/notes/apis";
import { Loader2, FileText, Sparkles, ChevronDown, ChevronUp, CheckSquare, X } from "lucide-react";

const NotesDashboard = () => {
	const [notes, setNotes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [expandedId, setExpandedId] = useState(null);
	const [selectedNote, setSelectedNote] = useState(null);

	useEffect(() => {
		fetchNotes();
	}, []);

	const fetchNotes = async () => {
		try {
			setLoading(true);
			const res = await getAllNotesRequest();
			setNotes(res.data || []);
		} catch (err) {
			console.error("Failed to fetch notes:", err);
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (dateStr) => {
		if (!dateStr) return "";
		return new Date(dateStr).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center h-full py-20">
				<Loader2 className="h-8 w-8 animate-spin text-purple-600" />
			</div>
		);
	}

	if (notes.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full py-20">
				<FileText className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
				<h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
					No notes yet
				</h3>
				<p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
					Record a voice note and generate AI notes to see them here.
				</p>
			</div>
		);
	}

	return (
		<>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-8"
			>
				<h1 className="text-3xl font-headings font-bold tracking-wide dark:text-white">
					<Sparkles className="inline h-7 w-7 text-purple-500 mr-2 -mt-1" />
					AI Notes
				</h1>
				<p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
					{notes.length} note{notes.length !== 1 ? "s" : ""} generated from your recordings
				</p>
			</motion.div>

			{/* Notes Grid */}
			<motion.div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
				{notes.map((note, index) => (
					<motion.div
						key={note._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.05 }}
						className="group rounded-2xl bg-white dark:bg-[#16163a] border border-black/5 dark:border-purple-500/10 shadow-sm hover:shadow-md transition-all cursor-pointer"
						onClick={() => setSelectedNote(note)}
					>
						<div className="p-5">
							{/* Title */}
							<h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
								{note.title}
							</h3>

							{/* Summary */}
							<p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed">
								{note.summary}
							</p>

							{/* Meta */}
							<div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-purple-500/10">
								<span className="text-xs text-gray-400 dark:text-gray-500">
									{formatDate(note.createdAt)}
								</span>
								<div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
									{note.bulletPoints?.length > 0 && (
										<span>{note.bulletPoints.length} points</span>
									)}
									{note.actionItems?.length > 0 && (
										<span className="flex items-center gap-1">
											<CheckSquare className="h-3 w-3" />
											{note.actionItems.length}
										</span>
									)}
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</motion.div>

			{/* Note Detail Modal */}
			<AnimatePresence>
				{selectedNote && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
							onClick={() => setSelectedNote(null)}
						/>

						{/* Modal */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className="fixed inset-0 z-50 flex items-center justify-center p-4"
						>
							<div className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-[#16163a] border border-black/5 dark:border-purple-500/20 shadow-2xl p-6">
								{/* Close button */}
								<div className="flex items-start justify-between mb-4">
									<h2 className="text-2xl font-bold text-gray-800 dark:text-white pr-8">
										{selectedNote.title}
									</h2>
									<button
										onClick={() => setSelectedNote(null)}
										className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
									>
										<X className="h-5 w-5 text-gray-400" />
									</button>
								</div>

								{/* Date */}
								<p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
									{formatDate(selectedNote.createdAt)}
								</p>

								{/* Summary */}
								<div className="mb-5 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20">
									<h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Summary</h4>
									<p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
										{selectedNote.summary}
									</p>
								</div>

								{/* Bullet Points */}
								{selectedNote.bulletPoints?.length > 0 && (
									<div className="mb-5">
										<h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Key Points</h4>
										<ul className="space-y-2">
											{selectedNote.bulletPoints.map((point, i) => (
												<li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
													<span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
													{point}
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Action Items */}
								{selectedNote.actionItems?.length > 0 && (
									<div>
										<h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-3">Action Items</h4>
										<ul className="space-y-2">
											{selectedNote.actionItems.map((item, i) => (
												<li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
													<CheckSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
													{item}
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
};

export default NotesDashboard;
