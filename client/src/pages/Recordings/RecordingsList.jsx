import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Voicemail, Play, Pause, Trash2, FileText, Clock, Loader2, RefreshCw } from "lucide-react";
import { useAudioContext } from "../../hooks/AudioContext.jsx";
import { getVoiceNoteByIdRequest } from "../../apis/recording/apis";
import { getTranscriptionByIdRequest } from "../../apis/transcription/apis";
import { generateNotesRequest } from "../../apis/notes/apis";

function RecordingsList() {
    const navigate = useNavigate();
    const { voiceNotes, fetchVoiceNotes, deleteVoiceNote } = useAudioContext();
    const [loading, setLoading] = useState(true);
    const [playingId, setPlayingId] = useState(null);
    const [audioEl, setAudioEl] = useState(null);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchVoiceNotes().finally(() => setLoading(false));
    }, []);

    const handlePlay = async (voiceNote) => {
        // If already playing this one, pause it
        if (playingId === voiceNote._id && audioEl) {
            audioEl.pause();
            setPlayingId(null);
            return;
        }

        // Stop any current playback
        if (audioEl) {
            audioEl.pause();
        }

        try {
            const blob = await getVoiceNoteByIdRequest(voiceNote._id);
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.onended = () => setPlayingId(null);
            audio.play();
            setAudioEl(audio);
            setPlayingId(voiceNote._id);
        } catch (err) {
            console.error("Playback failed:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this recording? This will also remove its transcription and notes.")) return;
        await deleteVoiceNote(id);
        if (playingId === id && audioEl) {
            audioEl.pause();
            setPlayingId(null);
        }
    };

    const handleGenerateNotes = async (voiceNote) => {
        if (voiceNote.status !== "TRANSCRIBED") return;
        try {
            setProcessingId(voiceNote._id);
            // First get the transcription for this voice note
            const transcriptionData = await getTranscriptionByIdRequest(voiceNote._id);
            const transcription = transcriptionData.transcriptions?.[0];
            if (!transcription) {
                alert("No transcription found for this recording.");
                return;
            }
            // Generate notes from the transcription
            await generateNotesRequest(transcription._id);
            alert("Notes generated successfully! Check the Notes page.");
        } catch (err) {
            console.error("Notes generation failed:", err);
            alert(err.response?.data?.message || "Failed to generate notes.");
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "--:--";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const statusColors = {
        UPLOADED: "bg-yellow-100 text-yellow-700",
        TRANSCRIBED: "bg-green-100 text-green-700",
        FAILED: "bg-red-100 text-red-700",
    };

    return (
        <div className="flex flex-col px-6 py-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-headings font-bold tracking-wide"
                    >
                        Recordings
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-black/50 mt-1 font-body"
                    >
                        {voiceNotes.length} recording{voiceNotes.length !== 1 ? "s" : ""}
                    </motion.p>
                </div>
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { setLoading(true); fetchVoiceNotes().finally(() => setLoading(false)); }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition font-medium text-sm"
                >
                    <RefreshCw className="h-4 w-4" /> Refresh
                </motion.button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                </div>
            )}

            {/* Empty State */}
            {!loading && voiceNotes.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center py-20 text-center"
                >
                    <Voicemail className="h-16 w-16 text-purple-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600">No recordings yet</h3>
                    <p className="text-gray-400 mt-2">Go to the Dashboard and record your first voice note!</p>
                </motion.div>
            )}

            {/* Recordings List */}
            {!loading && voiceNotes.length > 0 && (
                <div className="flex flex-col gap-4">
                    <AnimatePresence>
                        {voiceNotes.map((vn, idx) => (
                            <motion.div
                                key={vn._id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Play Button */}
                                <button
                                    onClick={() => handlePlay(vn)}
                                    disabled={vn.status === "FAILED"}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {playingId === vn._id ? (
                                        <Pause className="h-5 w-5" />
                                    ) : (
                                        <Play className="h-5 w-5 ml-0.5" />
                                    )}
                                </button>

                                {/* Info — clickable to detail page */}
                                <div
                                    onClick={() => navigate(`/recordings/${vn._id}`)}
                                    className="flex-1 min-w-0 cursor-pointer hover:text-purple-700 transition-colors"
                                >
                                    <p className="font-medium text-gray-800 truncate">
                                        {vn.filename || "Voice Recording"}
                                    </p>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDuration(vn.duration)}
                                        </span>
                                        <span>{formatDate(vn.createdAt)}</span>
                                    </div>
                                </div>

                                {/* Status Badge */}
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[vn.status] || "bg-gray-100 text-gray-600"}`}>
                                    {vn.status}
                                </span>

                                {/* Generate Notes Button */}
                                <button
                                    onClick={() => handleGenerateNotes(vn)}
                                    disabled={vn.status !== "TRANSCRIBED" || processingId === vn._id}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                                    title={vn.status !== "TRANSCRIBED" ? "Waiting for transcription..." : "Generate AI notes"}
                                >
                                    {processingId === vn._id ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <FileText className="h-4 w-4" />
                                    )}
                                    Notes
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => handleDelete(vn._id)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition"
                                    title="Delete recording"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

export default RecordingsList;
