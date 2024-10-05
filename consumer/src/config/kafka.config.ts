import { Admin, Consumer, Kafka, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private consumer: Consumer;
  private brokers: string;

  // Constructor to initialize Kafka and related components
  constructor() {
    // Kafka broker address (you can adjust it as per your setup)
    this.brokers = "192.168.43.180:9092";

    // Create a new Kafka client instance
    this.kafka = new Kafka({
      clientId: "consumer", // Client identifier for Kafka
      brokers: [this.brokers], // Array of Kafka broker addresses
      logLevel: logLevel.INFO, // Set the logging level (optional)
    });

    // Create a Kafka consumer for sending messages
    this.consumer = this.kafka.consumer({
      groupId: "consumer",
    });
  }

  // Method to connect both the consumer and admin client to Kafka
  async connect(): Promise<void> {
    try {
      // Connect the consumer and admin clients to the Kafka broker
      await this.consumer.connect();
      console.log("Kafka is connected 👌.");
    } catch (error) {
      console.error("Failed to connect to Kafka", error);
    }
  }

  // Subscribe to topic
  async subscribeTopic(topic: string): Promise<void> {
    try {
      await this.consumer.subscribe({
        topic,
        fromBeginning: true,
      });
      console.log("Subscribed to topic: ", topic);
    } catch (error) {
      console.log(error);
    }
  }

  // consume
  async consume(callback: (message: any) => void): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          // Parse the message value directly before passing to the callback
          const parsedMessage = JSON.parse(message?.value?.toString() || "{}");
          // Pass the parsed message to the callback
          callback(parsedMessage);
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // Method to disconnect both the consumer and admin client from Kafka
  async disconnect(): Promise<void> {
    try {
      // Disconnect the consumer and admin clients
      await this.consumer.disconnect();
      console.log("Disconnected from Kafka successfully.");
    } catch (error) {
      console.error("Error while disconnecting from Kafka", error);
    }
  }
}

// returning the object
export default new KafkaConfig();
