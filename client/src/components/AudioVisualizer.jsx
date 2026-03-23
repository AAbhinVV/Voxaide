import { useRef, useEffect, useCallback } from "react";

export default function AudioVisualizer({ audioStream, isPaused = false, className = "" }) {
	const canvasRef = useRef(null);
	const animationRef = useRef(null);
	const analyserRef = useRef(null);
	const audioCtxRef = useRef(null);
	const dataArrayRef = useRef(null);
	const prevValuesRef = useRef(null);

	const BAR_COUNT = 48;
	const BAR_GAP = 3;
	const MIN_BAR_HEIGHT = 4;
	const SMOOTHING = 0.82;

	const draw = useCallback(() => {
		const canvas = canvasRef.current;
		const analyser = analyserRef.current;
		if (!canvas || !analyser) return;

		const ctx = canvas.getContext("2d");
		const { width, height } = canvas;
		const dataArray = dataArrayRef.current;

		analyser.getByteFrequencyData(dataArray);

		ctx.clearRect(0, 0, width, height);

		const totalBarWidth = (width - BAR_GAP * (BAR_COUNT - 1)) / BAR_COUNT;
		const barWidth = Math.max(totalBarWidth, 2);
		const centerY = height / 2;

		// Initialize previous values if needed
		if (!prevValuesRef.current) {
			prevValuesRef.current = new Array(BAR_COUNT).fill(0);
		}

		for (let i = 0; i < BAR_COUNT; i++) {
			// Sample from the frequency data (focus on lower-mid frequencies for voice)
			const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length * 0.6);
			const rawValue = dataArray[dataIndex] / 255;

			// Smooth transitions
			const smoothed = prevValuesRef.current[i] * SMOOTHING + rawValue * (1 - SMOOTHING);
			prevValuesRef.current[i] = smoothed;

			const barHeight = Math.max(smoothed * (height * 0.42), MIN_BAR_HEIGHT);

			const x = i * (barWidth + BAR_GAP);

			// Create gradient for each bar — purple → indigo → blue
			const gradient = ctx.createLinearGradient(x, centerY - barHeight, x, centerY + barHeight);
			const hue = 250 - (i / BAR_COUNT) * 40; // purple(270) → indigo(230)
			const saturation = 70 + smoothed * 30;
			const lightness = 55 + smoothed * 20;
			const alpha = 0.6 + smoothed * 0.4;

			gradient.addColorStop(0, `hsla(${hue + 20}, ${saturation}%, ${lightness + 10}%, ${alpha})`);
			gradient.addColorStop(0.5, `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`);
			gradient.addColorStop(1, `hsla(${hue + 20}, ${saturation}%, ${lightness + 10}%, ${alpha})`);

			ctx.fillStyle = gradient;

			// Draw mirrored bars from center
			const radius = Math.min(barWidth / 2, 4);
			roundedRect(ctx, x, centerY - barHeight, barWidth, barHeight * 2, radius);

			// Subtle glow for active bars
			if (smoothed > 0.3) {
				ctx.shadowColor = `hsla(${hue}, 80%, 60%, ${smoothed * 0.5})`;
				ctx.shadowBlur = 8 * smoothed;
				roundedRect(ctx, x, centerY - barHeight, barWidth, barHeight * 2, radius);
				ctx.shadowColor = "transparent";
				ctx.shadowBlur = 0;
			}
		}

		animationRef.current = requestAnimationFrame(draw);
	}, []);

	useEffect(() => {
		if (!audioStream) return;

		const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		const analyser = audioCtx.createAnalyser();
		analyser.fftSize = 256;
		analyser.smoothingTimeConstant = 0.75;

		const source = audioCtx.createMediaStreamSource(audioStream);
		source.connect(analyser);

		audioCtxRef.current = audioCtx;
		analyserRef.current = analyser;
		dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
		prevValuesRef.current = null;

		// Handle canvas DPI scaling
		const canvas = canvasRef.current;
		if (canvas) {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			canvas.getContext("2d").scale(dpr, dpr);
			// Store logical size for drawing
			canvas.width = rect.width;
			canvas.height = rect.height;
		}

		animationRef.current = requestAnimationFrame(draw);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
			source.disconnect();
			audioCtx.close();
		};
	}, [audioStream, draw]);

	// Pause/resume animation
	useEffect(() => {
		if (isPaused) {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
				animationRef.current = null;
			}
		} else if (analyserRef.current && !animationRef.current) {
			animationRef.current = requestAnimationFrame(draw);
		}
	}, [isPaused, draw]);

	return (
		<canvas
			ref={canvasRef}
			className={className}
			style={{
				width: "100%",
				height: "100%",
			}}
		/>
	);
}

function roundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	ctx.fill();
}
