import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";
import { Link } from "react-router-dom";
import HeroMockup from "../assets/hero_mockup.png";
import { LandingNavbar } from "../components/LandingNavbar.jsx";
import { FlipWords } from "../components/ui/flip-words.jsx";
import { ShimmerButton } from "../components/ui/shimmer-button.jsx";

/* ─── animation helpers ─── */
const fadeUp = {
	hidden: { opacity: 0, y: 30 },
	visible: (i = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
	}),
};

function AnimatedSection({ children, className, id }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	return (
		<section ref={ref} id={id} className={className}>
			<motion.div
				initial="hidden"
				animate={inView ? "visible" : "hidden"}
				variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
			>
				{children}
			</motion.div>
		</section>
	);
}

/* ─── feature data ─── */
const features = [
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
				<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
				<line x1="12" x2="12" y1="19" y2="22" />
			</svg>
		),
		title: "Real-time Transcription",
		description:
			"Record your lectures, meetings, or brainstorms and watch your words appear as perfectly formatted text — instantly.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
				<polyline points="14 2 14 8 20 8" />
				<line x1="16" x2="8" y1="13" y2="13" />
				<line x1="16" x2="8" y1="17" y2="17" />
				<line x1="10" x2="8" y1="9" y2="9" />
			</svg>
		),
		title: "AI Summaries & Notes",
		description:
			"Voxaide's AI distills your recordings into clean notes, key takeaways, and actionable items — so you focus on thinking, not typing.",
	},
	{
		icon: (
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
				<path d="M11 8v6" />
				<path d="M8 11h6" />
			</svg>
		),
		title: "Smart Search & Query",
		description:
			"Ask questions about any recording. Our AI searches across all your voice notes and surfaces the exact answers you need.",
	},
];

/* ─── steps data ─── */
const steps = [
	{
		num: "01",
		title: "Record",
		description: "Capture your voice with a single tap. Lectures, meetings, or spontaneous ideas — just speak.",
	},
	{
		num: "02",
		title: "Transcribe",
		description: "AI converts your speech to text in real-time with high accuracy, handling accents and jargon.",
	},
	{
		num: "03",
		title: "Organize",
		description: "Get auto-generated summaries, action items, and searchable notes — your second brain, powered by AI.",
	},
];

/* ─────────────────── MAIN COMPONENT ─────────────────── */
export default function Home() {
	return (
		<div className="relative min-h-screen w-full bg-[#050510] text-white overflow-x-hidden">
			{/* ── global ambient gradients ── */}
			<div className="pointer-events-none fixed inset-0 z-0">
				<div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-brand-primary/[0.07] blur-[120px]" />
				<div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-tertiary/[0.05] blur-[120px]" />
			</div>

			<LandingNavbar />

			{/* ═══════════════════ HERO ═══════════════════ */}
			<section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28 px-6 sm:px-8 max-w-7xl mx-auto">
				{/* Floating badge */}
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.15 }}
					className="flex justify-center mb-8"
				>
					<span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] backdrop-blur-md text-xs font-medium text-white/70 tracking-wide shadow-lg shadow-black/20">
						<span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
						AI-Powered Voice Notes
					</span>
				</motion.div>

				{/* Headline */}
				<motion.div
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, delay: 0.3 }}
					className="text-center"
				>
					<h1 className="text-5xl sm:text-6xl lg:text-7xl font-headings font-extrabold leading-[1.08] tracking-tight">
						<span className="bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
							Never Miss A Thought
						</span>
						<br />
						<span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
							Never Lose An Idea
						</span>
					</h1>
				</motion.div>

				{/* Subheadline */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.5 }}
					className="mt-7 text-center"
				>
					<p className="text-lg sm:text-xl text-white/50 font-body max-w-2xl mx-auto leading-relaxed">
						Turn your voice into structured knowledge —{" "}
						<FlipWords
							className="text-lg sm:text-xl font-semibold text-white/90"
							words={["Record", "Transcribe", "Summarize", "Remember"]}
							duration={2500}
						/>
					</p>
				</motion.div>

				{/* CTAs */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.65 }}
					className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
				>
					<Link to="/signup">
						<ShimmerButton
							className="px-8 py-3.5 rounded-full text-base font-semibold"
							shimmerColor="#a78bfa"
							background="linear-gradient(135deg, #6366F1, #7C3AED)"
							shimmerSize="0.08em"
						>
							Get Started Free &rarr;
						</ShimmerButton>
					</Link>
					<a
						href="#how-it-works"
						className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/[0.1] bg-white/[0.04] backdrop-blur-sm text-base font-medium text-white/80 hover:text-white hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300"
					>
						See How It Works
					</a>
				</motion.div>

				{/* Hero Mockup */}
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.95 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					transition={{ duration: 0.9, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
					className="mt-20 relative max-w-5xl mx-auto"
				>
					{/* Glow behind mockup */}
					<div className="absolute inset-0 -z-10 translate-y-8">
						<div className="w-full h-full rounded-3xl bg-gradient-to-b from-brand-primary/20 via-brand-secondary/10 to-transparent blur-3xl" />
					</div>
					<div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm p-2 shadow-2xl shadow-brand-primary/10">
						<img
							src={HeroMockup}
							alt="Voxaide Dashboard — Voice transcription and AI-powered notes"
							className="w-full h-auto rounded-xl"
						/>
					</div>
				</motion.div>
			</section>

			{/* ═══════════════════ SOCIAL PROOF ═══════════════════ */}
			<AnimatedSection className="relative z-10 py-16 px-6 border-y border-white/[0.04]">
				<motion.div variants={fadeUp} className="text-center">
					<p className="text-sm font-medium uppercase tracking-[0.2em] text-white/30 font-body">
						Trusted by students, creators, and professionals
					</p>
					<div className="mt-8 flex flex-wrap justify-center gap-x-12 gap-y-4 items-center">
						{["1,200+ Users", "50K+ Notes Generated", "98% Accuracy", "4.9★ Rating"].map(
							(stat, i) => (
								<motion.span
									key={stat}
									variants={fadeUp}
									custom={i}
									className="text-lg sm:text-xl font-headings font-bold bg-gradient-to-r from-white/80 to-white/40 bg-clip-text text-transparent"
								>
									{stat}
								</motion.span>
							),
						)}
					</div>
				</motion.div>
			</AnimatedSection>

			{/* ═══════════════════ FEATURES ═══════════════════ */}
			<AnimatedSection
				id="features"
				className="relative z-10 py-24 sm:py-32 px-6 sm:px-8 max-w-7xl mx-auto"
			>
				<motion.div variants={fadeUp} className="text-center mb-16">
					<span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary mb-4 font-body">
						Features
					</span>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-bold tracking-tight">
						<span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
							Everything you need to capture ideas
						</span>
					</h2>
					<p className="mt-4 text-white/40 text-lg max-w-xl mx-auto font-body">
						From recording to organized notes — Voxaide handles the entire pipeline.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{features.map((f, i) => (
						<motion.div
							key={f.title}
							variants={fadeUp}
							custom={i}
							className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm p-8 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-500"
						>
							{/* Hover glow */}
							<div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-brand-primary/[0.06] to-transparent pointer-events-none" />
							<div className="relative z-10">
								<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-6 group-hover:shadow-lg group-hover:shadow-brand-primary/10 transition-shadow duration-500">
									{f.icon}
								</div>
								<h3 className="text-xl font-headings font-bold text-white mb-3">
									{f.title}
								</h3>
								<p className="text-white/45 leading-relaxed font-body text-[15px]">
									{f.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</AnimatedSection>

			{/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
			<AnimatedSection
				id="how-it-works"
				className="relative z-10 py-24 sm:py-32 px-6 sm:px-8 max-w-6xl mx-auto"
			>
				<motion.div variants={fadeUp} className="text-center mb-20">
					<span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary mb-4 font-body">
						How It Works
					</span>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-bold tracking-tight">
						<span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
							Three steps to your second brain
						</span>
					</h2>
				</motion.div>

				<div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
					{/* Connecting line (desktop only) */}
					<div className="hidden md:block absolute top-14 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-brand-primary/30 via-brand-secondary/30 to-brand-tertiary/30" />

					{steps.map((s, i) => (
						<motion.div
							key={s.num}
							variants={fadeUp}
							custom={i}
							className="relative flex flex-col items-center text-center"
						>
							{/* Step number circle */}
							<div className="relative z-10 w-14 h-14 rounded-full bg-[#0c0c1a] border border-white/[0.08] flex items-center justify-center mb-8 shadow-lg shadow-black/40">
								<span className="text-sm font-headings font-bold bg-gradient-to-b from-brand-primary to-brand-tertiary bg-clip-text text-transparent">
									{s.num}
								</span>
							</div>
							<h3 className="text-2xl font-headings font-bold text-white mb-3">
								{s.title}
							</h3>
							<p className="text-white/40 font-body text-[15px] leading-relaxed max-w-xs">
								{s.description}
							</p>
						</motion.div>
					))}
				</div>
			</AnimatedSection>

			{/* ═══════════════════ FINAL CTA ═══════════════════ */}
			<AnimatedSection
				id="cta"
				className="relative z-10 py-24 sm:py-32 px-6 sm:px-8 max-w-5xl mx-auto"
			>
				<motion.div
					variants={fadeUp}
					className="relative rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-12 sm:p-16 text-center overflow-hidden"
				>
					{/* Background glow */}
					<div className="absolute inset-0 -z-10">
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-brand-primary/[0.08] blur-[80px]" />
					</div>

					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-headings font-bold tracking-tight mb-6">
						<span className="bg-gradient-to-r from-white via-white to-white/50 bg-clip-text text-transparent">
							Ready to transform your
						</span>
						<br />
						<span className="bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-tertiary bg-clip-text text-transparent">
							voice into knowledge?
						</span>
					</h2>
					<p className="text-white/40 text-lg max-w-lg mx-auto mb-10 font-body">
						Join thousands of students, creators, and professionals who think faster than they type.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link to="/signup">
							<ShimmerButton
								className="px-10 py-4 rounded-full text-base font-semibold"
								shimmerColor="#a78bfa"
								background="linear-gradient(135deg, #6366F1, #7C3AED)"
								shimmerSize="0.08em"
							>
								Start Free — No Credit Card
							</ShimmerButton>
						</Link>
						<Link
							to="/login"
							className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/[0.1] bg-white/[0.04] text-base font-medium text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
						>
							Sign In
						</Link>
					</div>
				</motion.div>
			</AnimatedSection>

			{/* ═══════════════════ FOOTER ═══════════════════ */}
			<footer className="relative z-10 border-t border-white/[0.04] py-12 px-6 sm:px-8">
				<div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2.5">
						<div className="w-7 h-7 rounded-md bg-gradient-to-br from-brand-primary to-brand-tertiary flex items-center justify-center">
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
								<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
								<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
								<line x1="12" x2="12" y1="19" y2="22" />
							</svg>
						</div>
						<span className="text-sm font-headings font-semibold text-white/60">
							Voxaide
						</span>
					</div>
					<div className="flex items-center gap-8">
						<a href="#features" className="text-xs text-white/30 hover:text-white/60 transition-colors font-body">Features</a>
						<a href="#how-it-works" className="text-xs text-white/30 hover:text-white/60 transition-colors font-body">How It Works</a>
						<Link to="/login" className="text-xs text-white/30 hover:text-white/60 transition-colors font-body">Log In</Link>
					</div>
					<p className="text-xs text-white/20 font-body">
						&copy; {new Date().getFullYear()} Voxaide. All rights reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
