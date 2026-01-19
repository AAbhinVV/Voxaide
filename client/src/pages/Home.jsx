import { motion } from "framer-motion";
import React from "react";
import TestImage from "../assets/testimage.jpg";
import { LandingNavbar } from "../components/LandingNavbar.jsx";
import { FlipWords } from "../components/ui/flip-words.jsx";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient.jsx";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button.jsx";
import { LayoutTextFlip } from "../components/ui/layout-text-flip.jsx";
import { ShimmerButton } from "../components/ui/shimmer-button.jsx";
import {NoiseBackground} from "../components/ui/noise-background.jsx";

export default function Home() {
	const words = ["clean notes", "summaries", "action items"];

	return (
		<div className="flex flex-col h-screen w-screen overflow-x-hidden px-50 ">
			<section className="border-[0.3px] rounded-b-2xl border-black/25 border-t-0">
				<div className="flex w-full h-[100px] items-center justify-center mt-7">
					<LandingNavbar />
				</div>
				<div className="w-full h-full inline-block my-20">
					<section className="flex flex-col justify-center align-center bg-brand-page mt-14 h-auto">
						<div className="text-center ">
							<div className="inline-block bg-gradient-to-r from-black via-brand-secondary to-brand-primary bg-clip-text text-transparent">
								<div>
									<h1 className="text-7xl text-center font-headings font-extrabold">
										Never Miss A Thought
									</h1>
								</div>
								<div>
									<h1 className="text-6xl text-center font-headings mt-2 font-medium ">
										Never Loose An Idea
									</h1>
								</div>
							</div>
							<div className="text-black/75 my-10 text-lg tracking-wide font-body">
								<h1>
									Turn your voice into structured knowledge
									<FlipWords
										className="text-2xl font-medium"
										words={["Record", "Transcribe", "Summarize", "Remember"]}
									/>
								</h1>
							</div>
						</div>
						<div className="flex flex-row gap-4 justify-center mt-6 mb-20">
							{/* <button className="p-[3px] relative">
								<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl" />
								<div className="px-8 py-2  bg-black rounded-2xl relative group transition duration-200 text-white hover:bg-transparent">
									Lit up borders
								</div>
							</button> */}
							<NoiseBackground
								containerClassName="w-fit p-2 rounded-full"
								gradientColors={[
								"#6366F1",
								"#7C3AED",
								"#AA47FF",
								]}
							>
								<button className="h-full w-full cursor-pointer rounded-full bg-black px-4 py-2 text-white shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]">
								Start publishing &rarr;
								</button>
								
							</NoiseBackground>

							{/* <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
							<span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
							<span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
								Border Magic
							</span>
							</button> */}

							<ShimmerButton className="ml-6 px-8 py-2 rounded-2xl">
								Get Started
							</ShimmerButton>
						</div>
					</section>
				</div>
			</section>
			<section className="flex-wrap flex-row border-[0.3px] border-black/25 rounded-2xl p-10 h-auto ">
				<div className="font-body font-normal flex flex-col">
					<motion.div className="relative flex flex-col items-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row my-14">
						<LayoutTextFlip
							text="Voxaide transforms your spoken ideas into"
							words={words}
						/>
					</motion.div>
					<h3 className="text-2xl my-4 tracking-tight font-normal"> - so you can focus on thinking, not typing.</h3>
					<span className="text-lg mt-2 font-body italic tracking-wide text-black/50">`Built for students, creators, and professionals who think faster than they type <br/>Just speak — Voxaide handles the rest.`</span>
				</div>
				<img
					src="{TestImage}"
					className="w-1/3 h-auto ml-20 rounded-3xl shadow-2xl shadow-black/10 border-2"
				/>
			</section>
		</div>
	);
}
