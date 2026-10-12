import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Database connection is not required for this setup.
// The following code is disabled to allow the app to run without a DATABASE_URL.
// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Did you forget to provision a database?",
//   );
// }
export const pool = process.env.DATABASE_URL ? new Pool({ connectionString: process.env.DATABASE_URL }) : null;
export const db = pool ? drizzle({ client: pool, schema }) : (null as any);