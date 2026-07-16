import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";

async function start() {
  await connectDb(env.mongoUri);
  const app = createApp(env.corsOrigin);

  app.listen(env.port, () => {
    console.log(`Palnesto backend listening on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
