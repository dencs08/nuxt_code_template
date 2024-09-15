import { defineEventHandler } from "h3";
// import pino from "pino";

// //Configure the logger
// const logger = pino({ level: "info" });

export default defineEventHandler((event) => {
  // const start = Date.now();
  // const { req, res } = event.node;
  // // Log incoming request
  // logger.info(
  //   {
  //     method: req.method,
  //     url: req.url,
  //     headers: req.headers,
  //   },
  //   "Incoming request"
  // );
  // // After response is finished
  // res.on("finish", () => {
  //   const duration = Date.now() - start;
  //   logger.info(
  //     {
  //       method: req.method,
  //       url: req.url,
  //       statusCode: res.statusCode,
  //       duration,
  //     },
  //     "Request completed"
  //   );
  // });
});
