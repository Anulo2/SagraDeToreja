import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { fromTypes } from "@elysiajs/openapi/gen";
import { opentelemetry } from "@elysiajs/opentelemetry";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-node";
// import { type } from "arktype";
import { Elysia, redirect } from "elysia";
import logixlysia from "logixlysia";
import { OpenAPI } from "./auth";
import { events } from "./controllers/events";
import { betterAuth } from "./middleware/auth";

const api = new Elysia({ prefix: "/api" })
  .use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "banner",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
        ip: true,
        logFilePath: "./logs/app.log",
        customLogFormat:
          "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
        logFilter: {
          level: ["ERROR", "WARNING"],
          status: [500, 404],
          method: "GET",
        },
      },
    })
  )
  .use(
    cors({
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use(
    opentelemetry({
      spanProcessors: [new BatchSpanProcessor(new OTLPTraceExporter())],
    })
  )
  .use(
    openapi({
      // references: fromTypes("src/index.ts"),
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
        info: {
          title: "Elysia TypeGen Example",
          version: "1.0.0",
          description: "All response here generated from types",
        },
      },
      // mapJsonSchema: {
      //   arktype: type({}).toJsonSchema,
      // },
    })
  )
  .use(betterAuth)
  .get("/", redirect("/openapi"), {
    detail: {
      hide: true,
    },
  })
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))
  .use(events);

api.listen(process.env.PORT || 3000);

export type Api = typeof api;
