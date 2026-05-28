import React from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Trash2, Palette } from "lucide-react";
import { useThemeContext } from "../../hooks/ThemeContext";
import { useAuth } from "../../hooks/AuthContext";
import { deleteCurrentUserRequest } from "../../apis/users/apis";
import { useNavigate } from "react-router-dom";

function Settings() {
    const { theme, toggleTheme } = useThemeContext();
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleDeleteAccount = async () => {
        const confirmed = confirm(
            "Are you sure you want to delete your account? This action is irreversible and will permanently remove all your recordings, transcriptions, and notes."
        );
        if (!confirmed) return;

        const doubleConfirm = confirm("This is your LAST chance. Delete account permanently?");
        if (!doubleConfirm) return;

        try {
            await deleteCurrentUserRequest();
            logout();
            navigate("/");
        } catch (err) {
            console.error("Account deletion failed:", err);
            alert(err.response?.data?.message || "Failed to delete account.");
        }
    };

    return (
        <div className="flex flex-col px-6 py-8 max-w-3xl mx-auto">
            {/* Header */}
            <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-headings font-bold tracking-wide mb-10"
            >
                Settings
            </motion.h1>

            {/* Appearance */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
            >
                <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-500" />
                    Appearance
                </h2>
                <div className="flex items-center justify-between rounded-2xl bg-white border border-black/5 shadow-sm p-5">
                    <div>
                        <p className="font-medium text-gray-800">Theme</p>
                        <p className="text-sm text-gray-400 mt-0.5">
                            Switch between light and dark mode
                        </p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition font-medium text-sm"
                    >
                        {theme === "dark" ? (
                            <>
                                <Sun className="h-4 w-4" /> Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="h-4 w-4" /> Dark Mode
                            </>
                        )}
                    </button>
                </div>
            </motion.section>

            {/* Danger Zone */}
            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Danger Zone
                </h2>
                <div className="flex items-center justify-between rounded-2xl border-2 border-red-200 bg-red-50/50 p-5">
                    <div>
                        <p className="font-medium text-gray-800">Delete Account</p>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Permanently remove your account and all associated data.
                            This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition font-medium text-sm shrink-0"
                    >
                        <Trash2 className="h-4 w-4" /> Delete Account
                    </button>
                </div>
            </motion.section>
        </div>
    );
}

export default Settings;
