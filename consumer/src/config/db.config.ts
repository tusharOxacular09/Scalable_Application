import mongoose from "mongoose";

export const connectDB = async () => {
  await mongoose
    .connect("mongodb://localhost:27017/eda-test")
    .then(() => {
      console.log("Mongodb connected successfully.");
    })
    .catch((error) => {
      console.log(error);
    });
};
