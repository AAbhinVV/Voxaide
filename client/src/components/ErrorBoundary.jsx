import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-lg rounded-2xl bg-white p-10 text-center shadow-xl"
                    >
                        <AlertTriangle className="mx-auto h-16 w-16 text-amber-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-500 mb-6">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        {process.env.NODE_ENV === "development" && this.state.error && (
                            <pre className="mb-6 max-h-40 overflow-auto rounded-lg bg-red-50 p-4 text-left text-xs text-red-700 border border-red-200">
                                {this.state.error.toString()}
                                {this.state.errorInfo?.componentStack}
                            </pre>
                        )}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
                            >
                                <RefreshCw className="h-4 w-4" /> Try Again
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium"
                            >
                                Go Home
                            </button>
                        </div>
                    </motion.div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
