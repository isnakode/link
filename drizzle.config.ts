import { defineConfig } from "drizzle-kit";
export default defineConfig({
  dialect: 'sqlite',
  breakpoints: false,
  out: 'drizzle/migration',
  schema: 'drizzle/schema/*',
  dbCredentials: {
    url: 'link.db'
  }
})