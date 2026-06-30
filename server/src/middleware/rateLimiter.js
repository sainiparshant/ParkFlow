import redisClient from "../config/redis.js";


const rateLimiter = (limit, windowSeconds) => {
    return async (req, res, next) => {
        try {
            const key = `rate:${req.ip}`;
            const count = await redisClient.incr(key);

            if (count === 1) {
                await redisClient.expire(key, windowSeconds);
            }

            if (count > limit) {
                return res.status(429).json({
                    message: "Too many requests"
                });
            }

            next();
        } catch (error) {
            next();
        }
    };
};

export default rateLimiter;