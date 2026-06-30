import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function LandingNavbar() {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<motion.nav
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-500",
				scrolled
					? "bg-black/60 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20"
					: "bg-transparent",
			)}
		>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between h-[72px]">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2.5 group">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-tertiary flex items-center justify-center shadow-lg shadow-brand-primary/25 group-hover:shadow-brand-primary/40 transition-shadow duration-300">
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="white"
							strokeWidth="2.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
							<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
							<line x1="12" x2="12" y1="19" y2="22" />
						</svg>
					</div>
					<span className="text-xl font-headings font-bold text-white tracking-tight">
						Voxaide
					</span>
				</Link>

				{/* Center Nav Links */}
				<div className="hidden md:flex items-center gap-8">
					<a
						href="#features"
						className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
					>
						Features
					</a>
					<a
						href="#how-it-works"
						className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
					>
						How It Works
					</a>
					<a
						href="#cta"
						className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200"
					>
						Get Started
					</a>
				</div>

				{/* Right Actions */}
				<div className="flex items-center gap-3">
					<Link
						to="/login"
						className="text-sm font-medium text-white/70 hover:text-white px-4 py-2 rounded-full transition-colors duration-200"
					>
						Log in
					</Link>
					<Link
						to="/signup"
						className="text-sm font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-tertiary px-5 py-2.5 rounded-full transition-all duration-300 shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98]"
					>
						Get Started Free
					</Link>
				</div>
			</div>
		</motion.nav>
	);
}
