import { Admin, Producer, Kafka, logLevel } from "kafkajs";

class KafkaConfig {
  private kafka: Kafka;
  private producer: Producer;
  private admin: Admin;
  private brokers: string;

  // Constructor to initialize Kafka and related components
  constructor() {
    // Kafka broker address (you can adjust it as per your setup)
    this.brokers = "192.168.43.180:9092";

    // Create a new Kafka client instance
    this.kafka = new Kafka({
      clientId: "producer", // Client identifier for Kafka
      brokers: [this.brokers], // Array of Kafka broker addresses
      logLevel: logLevel.INFO, // Set the logging level (optional)
    });

    // Create a Kafka producer for sending messages
    this.producer = this.kafka.producer();

    // Create an Admin client for managing Kafka topics and clusters
    this.admin = this.kafka.admin();
  }

  // Method to connect both the producer and admin client to Kafka
  async connect(): Promise<void> {
    try {
      // Connect the producer and admin clients to the Kafka broker
      await this.producer.connect();
      await this.admin.connect();
      console.log("Kafka is connected 👌.");
    } catch (error) {
      console.error("Failed to connect to Kafka", error);
    }
  }

  // Method to create a Kafka topic
  async createTopic(topic: string): Promise<void> {
    try {
      // Create a new topic with one partition (can be adjusted based on your need)
      await this.admin.createTopics({
        topics: [{ topic, numPartitions: 1 }],
      });
      console.log(`Topic "${topic}" created successfully.`);
    } catch (error) {
      console.error("Failed to create topic", error);
    }
  }

  // Method to send a message to a Kafka topic
  async sendToTopic(topic: string, message: string): Promise<void> {
    try {
      // Send a message to the specified topic
      await this.producer.send({
        topic,
        messages: [{ value: message }], // Message is sent as a value
      });
      console.log(`Message sent successfully to topic "${topic}".`);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  }

  // Method to disconnect both the producer and admin client from Kafka
  async disconnect(): Promise<void> {
    try {
      // Disconnect the producer and admin clients
      await this.producer.disconnect();
      await this.admin.disconnect();
      console.log("Disconnected from Kafka successfully.");
    } catch (error) {
      console.error("Error while disconnecting from Kafka", error);
    }
  }
}

// returning the object
export default new KafkaConfig();
