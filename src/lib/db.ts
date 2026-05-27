export async function withRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      const isConnectionError =
        error?.code === "57P01" ||
        error?.message?.includes("terminating connection") ||
        error?.message?.includes("Connection pool timeout") ||
        error?.message?.includes("administrator command");

      if (isConnectionError && i < retries - 1) {
        // Linear backoff delay
        await new Promise((res) => setTimeout(res, delay * (i + 1)));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries reached");
}
