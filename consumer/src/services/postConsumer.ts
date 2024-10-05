import kafkaConfig from "../config/kafka.config";
import Post from "../models/postModel";

export const postConsumer = async () => {
  const messages: any[] = [];
  let processing = false;

  try {
    await kafkaConfig.subscribeTopic("post");
    await kafkaConfig.consume(async (parsedMessage) => {
      try {
        if (parsedMessage) {
          messages.push(parsedMessage);
          console.log("Message Received: ", parsedMessage);
        } else {
          console.error("Invalid message format: ", parsedMessage);
        }
      } catch (error) {
        console.error("Error processing message: ", error);
      }
    });

    // Process messages if the length exceeds 100
    if (messages.length > 100) {
      processMessage();
    }

    setInterval(processMessage, 5000);
  } catch (error) {
    console.log(error);
  }

  async function processMessage() {
    if (messages.length > 0 && !processing) {
      processing = true;
      const batchToProcess = [...messages]; // Create a copy of messages
      messages.length = 0; // Clear the original array

      console.log("Processing batch -> ", batchToProcess);

      try {
        await Post.insertMany(batchToProcess, { ordered: false });
        console.log("Bulk insertion completed.");
      } catch (error) {
        console.log("Error inserting processes: ", error);
        // Re-add messages back in case of failure
        messages.push(...batchToProcess);
      } finally {
        processing = false;
      }
    }
  }
};
