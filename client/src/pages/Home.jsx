import { motion } from "framer-motion";
import React from "react";
import TestImage from "../assets/testimage.jpg";
import { LandingNavbar } from "../components/LandingNavbar.jsx";
import { FlipWords } from "../components/ui/flip-words.jsx";
import { HoverBorderGradient } from "../components/ui/hover-border-gradient.jsx";
import { InteractiveHoverButton } from "../components/ui/interactive-hover-button.jsx";
import { LayoutTextFlip } from "../components/ui/layout-text-flip.jsx";
import { ShimmerButton } from "../components/ui/shimmer-button.jsx";

export default function Home() {
	const words = ["clean notes", "summaries", "action items"];

	return (
		<div className="flex flex-col h-screen w-screen overflow-hidden">
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
						<div className="text-black/75 my-10 text-lg tracking-wide">
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
						<button className="p-[3px] relative">
							<div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl" />
							<div className="px-8 py-2  bg-black rounded-2xl relative group transition duration-200 text-white hover:bg-transparent">
								Lit up borders
							</div>
						</button>
						<ShimmerButton className="ml-6 px-8 py-2 rounded-2xl">
							Get Started
						</ShimmerButton>
					</div>
				</section>
				<section className="flex flex-row justify center m-20">
					<div className="text-3xl font-body font-medium flex flex-col">
						<motion.div className="relative flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row  my-14 bg-gradient-to-r ">
							<LayoutTextFlip
								text="Voxaide transforms your spoken ideas into"
								words={words}
							/>
						</motion.div>
						<h4>so you can focus on thinking, not typing.</h4>
					</div>
					<img
						src="{TestImage}"
						className="w-1/2 h-auto ml-20 rounded-3xl shadow-2xl shadow-black/10"
					/>
				</section>
			</div>
		</div>
	);
}
