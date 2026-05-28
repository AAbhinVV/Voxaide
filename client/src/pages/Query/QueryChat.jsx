import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { askQueryRequest } from "../../apis/query/apis";

function QueryChat() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

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
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto px-6 py-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-6"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-headings font-bold tracking-wide">
                        Ask VoxAide
                    </h1>
                    <p className="text-sm text-gray-400 font-body">
                        Ask questions about your recordings and notes
                    </p>
                </div>
            </motion.div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto rounded-2xl bg-gray-50 border border-black/5 p-4 mb-4">
                {messages.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center h-full text-center"
                    >
                        <Bot className="h-16 w-16 text-purple-200 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-500">
                            Ask anything about your voice notes
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 max-w-md">
                            VoxAide searches through your transcriptions to find relevant answers.
                            Try asking "What did I talk about in my last meeting?"
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
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 mt-1">
                                    <Bot className="h-4 w-4 text-purple-600" />
                                </div>
                            )}

                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                    msg.role === "user"
                                        ? "bg-purple-600 text-white rounded-br-md"
                                        : msg.isError
                                          ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-md"
                                          : "bg-white text-gray-800 border border-black/5 shadow-sm rounded-bl-md"
                                }`}
                            >
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                {msg.sources && msg.sources.length > 0 && (
                                    <p className="mt-2 text-xs text-gray-400">
                                        Based on {msg.sources.length} source chunk{msg.sources.length !== 1 ? "s" : ""}
                                    </p>
                                )}
                            </div>

                            {msg.role === "user" && (
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 mt-1">
                                    <User className="h-4 w-4 text-gray-600" />
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
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 mt-1">
                            <Bot className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white border border-black/5 shadow-sm px-4 py-3">
                            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                            <span className="text-sm text-gray-400">Searching your notes...</span>
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
                    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100 disabled:opacity-50"
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
    );
}

export default QueryChat;
