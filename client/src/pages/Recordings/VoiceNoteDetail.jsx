import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft, Play, Pause, Loader2, FileText,
    Clock, CheckCircle, XCircle, RefreshCw, Sparkles
} from "lucide-react";
import { getVoiceNoteByIdRequest, getVoiceNoteMetaByIdRequest } from "../../apis/recording/apis";
import { getTranscriptionByIdRequest } from "../../apis/transcription/apis";
import { generateNotesRequest, getNoteByIdRequest } from "../../apis/notes/apis";

const STATUS_COLORS = {
    UPLOADED: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock },
    TRANSCRIBED: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
    FAILED: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
};

function VoiceNoteDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Transcription state
    const [transcription, setTranscription] = useState(null);
    const [transcriptionLoading, setTranscriptionLoading] = useState(false);

    // Notes state
    const [notes, setNotes] = useState(null);
    const [notesLoading, setNotesLoading] = useState(false);

    // Polling state
    const [polling, setPolling] = useState(false);
    const pollIntervalRef = useRef(null);

    // Load voice note metadata
    useEffect(() => {
        loadVoiceNote();
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [id]);

    const loadVoiceNote = async () => {
        try {
            setLoading(true);
            const data = await getVoiceNoteMetaByIdRequest(id);
            const vnMeta = data.data || data;
            setMeta(vnMeta);

            // If transcribed, fetch transcription
            if (vnMeta.status === "TRANSCRIBED") {
                await loadTranscription();
            } else if (vnMeta.status === "UPLOADED") {
                // Start polling for transcription completion
                startPolling();
            }
        } catch (err) {
            console.error("Failed to load voice note:", err);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        if (pollIntervalRef.current) return;
        setPolling(true);
        pollIntervalRef.current = setInterval(async () => {
            try {
                const data = await getVoiceNoteMetaByIdRequest(id);
                const vnMeta = data.data || data;
                setMeta(vnMeta);

                if (vnMeta.status !== "UPLOADED") {
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                    setPolling(false);

                    if (vnMeta.status === "TRANSCRIBED") {
                        await loadTranscription();
                    }
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 5000); // Poll every 5 seconds
    };

    const loadTranscription = async () => {
        try {
            setTranscriptionLoading(true);
            const data = await getTranscriptionByIdRequest(id);
            const txn = data.transcriptions?.[0] || data.data || data;
            setTranscription(txn);
        } catch (err) {
            console.error("Failed to load transcription:", err);
        } finally {
            setTranscriptionLoading(false);
        }
    };

    const handlePlayPause = async () => {
        if (!audioUrl) {
            try {
                const blob = await getVoiceNoteByIdRequest(id);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                // Wait for state to update, then play
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.src = url;
                        audioRef.current.play();
                        setIsPlaying(true);
                    }
                }, 100);
            } catch (err) {
                console.error("Playback failed:", err);
            }
            return;
        }

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleGenerateNotes = async () => {
        if (!transcription?._id) return;
        try {
            setNotesLoading(true);
            const data = await generateNotesRequest(transcription._id);
            const noteData = data.data || data;
            setNotes(noteData);
        } catch (err) {
            console.error("Notes generation failed:", err);
            alert(err.response?.data?.message || "Failed to generate notes.");
        } finally {
            setNotesLoading(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric",
            year: "numeric", hour: "2-digit", minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!meta) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20">
                <XCircle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-gray-500">Voice note not found.</p>
                <button onClick={() => navigate("/recordings")} className="mt-4 text-purple-600 hover:underline">
                    ← Back to Recordings
                </button>
            </div>
        );
    }

    const StatusInfo = STATUS_COLORS[meta.status] || STATUS_COLORS.UPLOADED;
    const StatusIcon = StatusInfo.icon;

    return (
        <div className="flex flex-col px-6 py-8 max-w-4xl mx-auto">
            {/* Hidden audio element */}
            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
            />

            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate("/recordings")}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition mb-6 w-fit"
            >
                <ArrowLeft className="h-4 w-4" /> Back to Recordings
            </motion.button>

            {/* Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-white border border-black/5 shadow-sm p-6 mb-6"
            >
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        {/* Play Button */}
                        <button
                            onClick={handlePlayPause}
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white hover:bg-purple-700 transition shadow-lg"
                        >
                            {isPlaying ? (
                                <Pause className="h-6 w-6" />
                            ) : (
                                <Play className="h-6 w-6 ml-0.5" />
                            )}
                        </button>

                        <div>
                            <h1 className="text-2xl font-headings font-bold">
                                {meta.filename || "Voice Recording"}
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                {formatDate(meta.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${StatusInfo.bg} ${StatusInfo.text}`}>
                        <StatusIcon className="h-4 w-4" />
                        {meta.status}
                        {polling && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                    </div>
                </div>
            </motion.div>

            {/* Transcription Section */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white border border-black/5 shadow-sm p-6 mb-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-500" />
                        Transcription
                    </h2>
                    {meta.status === "TRANSCRIBED" && !transcription && (
                        <button
                            onClick={loadTranscription}
                            disabled={transcriptionLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 transition"
                        >
                            {transcriptionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                            Load
                        </button>
                    )}
                </div>

                {meta.status === "UPLOADED" && (
                    <div className="flex items-center gap-3 py-8 justify-center text-gray-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Transcription in progress... checking every 5 seconds</span>
                    </div>
                )}

                {meta.status === "FAILED" && (
                    <div className="py-6 text-center text-red-500">
                        Transcription failed. Please try uploading again.
                    </div>
                )}

                {transcriptionLoading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                    </div>
                )}

                {transcription && !transcriptionLoading && (
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {transcription.text || transcription.transcriptionText || "No text available."}
                        </p>
                    </div>
                )}
            </motion.div>

            {/* Notes Section */}
            {meta.status === "TRANSCRIBED" && transcription && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-2xl bg-white border border-black/5 shadow-sm p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                            AI Notes
                        </h2>
                        {!notes && (
                            <button
                                onClick={handleGenerateNotes}
                                disabled={notesLoading}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50"
                            >
                                {notesLoading ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                                ) : (
                                    <><Sparkles className="h-4 w-4" /> Generate Notes</>
                                )}
                            </button>
                        )}
                    </div>

                    {notesLoading && !notes && (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                            <Loader2 className="h-6 w-6 animate-spin mb-3" />
                            <span>AI is analyzing your transcription...</span>
                        </div>
                    )}

                    {notes && (
                        <div className="prose prose-sm max-w-none">
                            {notes.title && (
                                <h3 className="text-xl font-bold text-gray-800 mb-3">{notes.title}</h3>
                            )}
                            {notes.summary && (
                                <div className="mb-4 p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                                    <p className="text-gray-700">{notes.summary}</p>
                                </div>
                            )}
                            {notes.content && (
                                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {notes.content}
                                </div>
                            )}
                            {notes.bulletPoints && notes.bulletPoints.length > 0 && (
                                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                    {notes.bulletPoints.map((point, i) => (
                                        <li key={i}>{point}</li>
                                    ))}
                                </ul>
                            )}
                            {notes.actionItems && notes.actionItems.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-semibold text-gray-800 mb-2">Action Items</h4>
                                    <ul className="list-none space-y-1.5">
                                        {notes.actionItems.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-gray-700">
                                                <span className="text-indigo-500 mt-0.5">☐</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {!notes && !notesLoading && (
                        <p className="text-gray-400 text-center py-6">
                            Click "Generate Notes" to create AI-powered notes from your transcription.
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    );
}

export default VoiceNoteDetail;
