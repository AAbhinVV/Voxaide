import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyUserRequest } from "../apis/auth/apis";

const Verify = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const [status, setStatus] = useState("loading"); // loading | success | error
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!token) {
			setStatus("error");
			setMessage("No verification token provided.");
			return;
		}

		verifyUserRequest(token)
			.then((data) => {
				setStatus("success");
				setMessage(data.message || "Account verified successfully!");
			})
			.catch((err) => {
				setStatus("error");
				setMessage(
					err.response?.data?.message || "Verification failed. The link may be invalid or expired."
				);
			});
	}, [token]);

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-100 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md rounded-2xl bg-white p-10 text-center shadow-xl"
			>
				{status === "loading" && (
					<>
						<Loader2 className="mx-auto h-16 w-16 animate-spin text-purple-600" />
						<h2 className="mt-6 text-2xl font-semibold text-gray-800">
							Verifying your account...
						</h2>
						<p className="mt-2 text-gray-500">Please wait a moment.</p>
					</>
				)}

				{status === "success" && (
					<>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 200, damping: 15 }}
						>
							<CheckCircle className="mx-auto h-16 w-16 text-green-500" />
						</motion.div>
						<h2 className="mt-6 text-2xl font-semibold text-gray-800">
							Verified!
						</h2>
						<p className="mt-2 text-gray-500">{message}</p>
						<button
							onClick={() => navigate("/login")}
							className="mt-8 w-full rounded-xl bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700"
						>
							Continue to Login
						</button>
					</>
				)}

				{status === "error" && (
					<>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 200, damping: 15 }}
						>
							<XCircle className="mx-auto h-16 w-16 text-red-500" />
						</motion.div>
						<h2 className="mt-6 text-2xl font-semibold text-gray-800">
							Verification Failed
						</h2>
						<p className="mt-2 text-gray-500">{message}</p>
						<button
							onClick={() => navigate("/login")}
							className="mt-8 w-full rounded-xl bg-gray-800 px-6 py-3 font-medium text-white transition hover:bg-gray-900"
						>
							Go to Login
						</button>
					</>
				)}
			</motion.div>
		</div>
	);
};

export default Verify;
