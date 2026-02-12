import { redisClient } from "../../server.js";

const createRateLimiter = (service, limit, window) => {
	return async (req, res, next) => {
		try {
			const userId = req.user._id;

			const rateLimitKey = `rate_limit:${service}:${userId}`;

			const attempts = await redisClient.get(rateLimitKey);

			if (attempts && Number(attempts) >= limit) {
				return res
					.status(429)
					.json({
						success: false,
						message: `Rate limit exceeded. Try again after ${Math.ceil(window / 60)} minutes.`,
					});
			}

			const multi = redisClient.multi();

			multi.incr(rateLimitKey);

			if (!attempts) {
				multi.expire(rateLimitKey, window);
			}

			await multi.exec();

			return next();
		} catch (error) {
			console.error("Rate Limiter Error:", error);
			return res
				.status(500)
				.json({ success: false, message: "Internal RateLimiting Error" });
		}
	};
};

export const notesLimiter = createRateLimiter("notes", 10, 60); // 10 per minute
export const queryLimiter = createRateLimiter("query", 30, 60); // 30 per minute
export const embedLimiter = createRateLimiter("embedding", 5, 60); // 5 per minute
