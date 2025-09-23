import { treaty } from "@elysiajs/eden";
import type { Api } from "../types/backend";

export const api = treaty<Api>("localhost:3000");
