interface RateLimitData {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitData>();

// Clean up expired limits periodically
if (typeof setInterval !== "undefined") {
  const interval = setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  
  // Prevent blocking process exit in node environments
  if (interval && typeof interval.unref === "function") {
    interval.unref();
  }
}

export function isRateLimited(
  ip: string,
  route: string,
  limit: number,
  windowMs: number
): { limited: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const key = `${ip}:${route}`;
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    const resetTime = now + windowMs;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { limited: false, remaining: limit - 1, reset: resetTime };
  }

  if (record.count >= limit) {
    return { limited: true, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { limited: false, remaining: limit - record.count, reset: record.resetTime };
}
