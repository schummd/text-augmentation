export const config = {
  logLevel: process.env.APP_LOG_LEVEL || "debug",
  port: Number.parseInt(process.env.APP_PORT || "3001"),
};
