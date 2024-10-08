import { Hono } from "hono";
import { init } from "./start.services";
import postRoutes from "./services/createPost";

const app = new Hono();

// Start services
init();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

// Routes
app.route("/", postRoutes);

export default app;
