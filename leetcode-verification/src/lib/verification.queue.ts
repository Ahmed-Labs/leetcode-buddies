import Bull, { Job } from "bull";
import verificationProcess from "./verification.process.js";
import { monitorUserBio } from "./profileScraper.js";
import { v4 as uuidv4 } from "uuid";

const verificationQueue = new Bull("verification-dev", {
  redis: {
    port: 6379,
    host: "127.0.0.1",
  },
});

verificationQueue.process(50, verificationProcess);

const handleVerification = async (data) => {
  const UUID = uuidv4();
  const job: Job = await verificationQueue.add({
    username: data.username,
    uuid: UUID,
  });

  return {
    username: data.username,
    uuid: UUID,
    timestamp: job.timestamp,
  };
};

export { verificationQueue, handleVerification };
