import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import {
  handleVerification,
  verificationQueue,
} from "./lib/verification.queue.js";
import { userExist } from "./lib/profileScraper.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/verify-account", async (req, res) => {
  const userData = req.body;
  const userFound = await userExist(userData.username);
  if (!userFound) {
    return res.status(404).json({ error: "User not found" });
  }
  const verificationData = await handleVerification(userData);
  return res
    .status(200)
    .json({ status: "Verification started", ...verificationData });
});

app.get("/verification-count", async (req, res) => {
  const activeJobCount = await verificationQueue.getActiveCount();
  const totalJobs = await verificationQueue.getJobCounts();
  console.log(`Number of active jobs: ${activeJobCount}`);
  return res.status(200).json({ numActive: activeJobCount, total: totalJobs });
});

app.post("/clear", async (req, res) => {
  await verificationQueue.empty();
  return res.status(200).json({ message: "Queue cleared" });
});

app.listen(5000, () => {
  console.log("App running on port 5000");
});
