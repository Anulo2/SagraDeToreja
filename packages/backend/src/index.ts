import { Elysia } from "elysia";
import {betterAuth} from "./middleware/auth"
import { cors } from '@elysiajs/cors'
import { openapi } from '@elysiajs/openapi'
import { OpenAPI } from './auth'

const app = new Elysia()
  .use(
        cors({
            origin: 'http://localhost:3001',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            credentials: true,
            allowedHeaders: ['Content-Type', 'Authorization']
        })
    )
  .use(betterAuth)
  .use(
    openapi({
      documentation: {
        components: await OpenAPI.components,
        paths: await OpenAPI.getPaths(),
      },
    })
  )
  .get("/", () => "Hello Elysia with Better Auth!")
  .get("/health", () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

app.listen(3000);
