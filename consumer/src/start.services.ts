import kafkaConfig from "./config/kafka.config";
import { connectDB } from "./config/db.config";
import { postConsumer } from "./services/postConsumer";

export const init = async () => {
  try {
    await connectDB();
    await kafkaConfig.connect();
    await postConsumer();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
