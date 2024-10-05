import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import kafkaConfig from "../config/kafka.config";

const app = new Hono();

app.post(
  "/create-post",
  zValidator(
    "json",
    z.object({
      title: z.string(),
      content: z.string(),
    })
  ),
  async (c) => {
    const { title, content } = c.req.valid("json");
    try {
      await kafkaConfig.sendToTopic("post", JSON.stringify({ title, content }));

      // either call the next middleware or return the response.
      return c.json({ success: true, message: "Post created successfully." });
    } catch (error) {
      console.log(error);
      return c.json({ error: "Error while creating post." }, 500);
    }
  }
);

export default app;
