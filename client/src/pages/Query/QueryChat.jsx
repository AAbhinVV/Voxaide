import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles, FileText, CheckSquare, MessageSquare } from "lucide-react";
import { askQueryRequest } from "../../apis/query/apis";
import { getTranscriptionByIdRequest } from "../../apis/transcription/apis";
import { generateNotesRequest } from "../../apis/notes/apis";

function QueryChat() {
    const [searchParams] = useSearchParams();
    const voiceNoteId = searchParams.get("voiceNoteId");

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Left panel state
    const [leftTab, setLeftTab] = useState("transcription"); // "transcription" | "notes"
    const [transcription, setTranscription] = useState(null);
    const [notes, setNotes] = useState(null);
    const [contextLoading, setContextLoading] = useState(false);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Load transcription + notes if voiceNoteId is provided
    useEffect(() => {
        if (voiceNoteId) {
            loadContext();
        }
    }, [voiceNoteId]);

    const loadContext = async () => {
        try {
            setContextLoading(true);
            // Load transcription
            const txnData = await getTranscriptionByIdRequest(voiceNoteId);
            const txn = txnData.transcriptions?.[0] || txnData.data || txnData;
            setTranscription(txn);

            // Try load notes
            if (txn?._id) {
                try {
                    const notesData = await generateNotesRequest(txn._id);
                    const noteResult = notesData.data || notesData;
                    if (noteResult?.title) setNotes(noteResult);
                } catch { }
            }
        } catch (err) {
            console.error("Failed to load context:", err);
        } finally {
            setContextLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const question = input.trim();
        if (!question || loading) return;

        const userMsg = { role: "user", content: question, id: Date.now() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const data = await askQueryRequest(question);
            const aiMsg = {
                role: "assistant",
                content: data.data?.answer || "No answer received.",
                sources: data.data?.sources || [],
                id: Date.now() + 1,
            };
            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg = {
                role: "assistant",
                content:
                    err.response?.data?.message ||
                    "Sorry, something went wrong. Please try again.",
                isError: true,
                id: Date.now() + 1,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setLoading(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex h-[calc(100vh-4rem)] gap-4 px-4 py-4">
            {/* Left Panel - Transcription/Notes */}
            {voiceNoteId && (
                <div className="w-[45%] flex flex-col shrink-0 rounded-2xl bg-white dark:bg-[#16163a] border border-black/5 dark:border-purple-500/10 shadow-sm overflow-hidden">
                    {/* Tab Headers */}
                    <div className="flex border-b border-gray-100 dark:border-purple-500/10">
                        <button
                            onClick={() => setLeftTab("transcription")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                                leftTab === "transcription"
                                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-500/5"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                        >
                            <FileText className="h-4 w-4" />
                            Transcription
                        </button>
                        <button
                            onClick={() => setLeftTab("notes")}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium transition-colors ${
                                leftTab === "notes"
                                    ? "text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-500/5"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                        >
                            <Sparkles className="h-4 w-4" />
                            Notes
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {contextLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
                            </div>
                        ) : leftTab === "transcription" ? (
                            transcription ? (
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                                        {transcription.text || transcription.transcriptionText || "No transcription available."}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 dark:text-gray-500 py-10">
                                    No transcription available.
                                </p>
                            )
                        ) : notes ? (
                            <div className="space-y-4">
                                {notes.title && (
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">{notes.title}</h3>
                                )}
                                {notes.summary && (
                                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{notes.summary}</p>
                                    </div>
                                )}
                                {notes.bulletPoints?.length > 0 && (
                                    <ul className="space-y-2">
                                        {notes.bulletPoints.map((point, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-500" />
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {notes.actionItems?.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Action Items</h4>
                                        <ul className="space-y-1.5">
                                            {notes.actionItems.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <CheckSquare className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-gray-400 dark:text-gray-500 py-10">
                                No notes generated yet.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Right Panel - Chat */}
            <div className={`flex flex-col ${voiceNoteId ? "flex-1" : "max-w-4xl mx-auto w-full"}`}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-4"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                        <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-headings font-bold tracking-wide dark:text-white">
                            Ask VoxAide
                        </h1>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-body">
                            Ask questions about your recordings
                        </p>
                    </div>
                </motion.div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto rounded-2xl bg-gray-50 dark:bg-[#12122a] border border-black/5 dark:border-purple-500/10 p-4 mb-4">
                    {messages.length === 0 && !loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center"
                        >
                            <Bot className="h-16 w-16 text-purple-200 dark:text-purple-800 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                                Ask anything about your voice notes
                            </h3>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-md">
                                VoxAide searches through your transcriptions to find relevant answers.
                            </p>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`flex gap-3 mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                {msg.role === "assistant" && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 mt-1">
                                        <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                        msg.role === "user"
                                            ? "bg-purple-600 text-white rounded-br-md"
                                            : msg.isError
                                              ? "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-bl-md"
                                              : "bg-white dark:bg-[#1a1a40] text-gray-800 dark:text-gray-200 border border-black/5 dark:border-purple-500/10 shadow-sm rounded-bl-md"
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                    {msg.sources && msg.sources.length > 0 && (
                                        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                                            Based on {msg.sources.length} source chunk{msg.sources.length !== 1 ? "s" : ""}
                                        </p>
                                    )}
                                </div>

                                {msg.role === "user" && (
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 dark:bg-purple-500/20 mt-1">
                                        <User className="h-4 w-4 text-gray-600 dark:text-purple-400" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3 mb-4"
                        >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 mt-1">
                                <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white dark:bg-[#1a1a40] border border-black/5 dark:border-purple-500/10 shadow-sm px-4 py-3">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className="text-sm text-gray-400 dark:text-gray-500">Searching your notes...</span>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question about your recordings..."
                        disabled={loading}
                        className="flex-1 rounded-xl border border-black/10 dark:border-purple-500/20 bg-white dark:bg-[#16163a] dark:text-white px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-500/20 disabled:opacity-50 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default QueryChat;
