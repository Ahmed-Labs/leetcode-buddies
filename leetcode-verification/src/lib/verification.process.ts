import Bull, { Job } from "bull";
import { monitorUserBio } from "./profileScraper.js";
import { sendToClient } from "../index.js";
import { getTimeoutDate } from "./helpers.js";

const verificationProcess = async (job: Job, done: Bull.DoneCallback) => {
  const { username, uuid } = job.data;
  const timestamp = job.timestamp;
  const timeoutDate = getTimeoutDate(new Date(timestamp));
  console.log("Verifying: ", username, uuid);

  const verificationSuccessful = await monitorUserBio(
    username,
    uuid,
    timeoutDate
  );
  
  const clientResponseMessage = verificationSuccessful
    ? "Verification success!"
    : "Failed to verify account";
  const clientResponse = {
    message: clientResponseMessage,
    isVerified: verificationSuccessful,
  };
  sendToClient(uuid, clientResponse);
  done();
  return verificationSuccessful;
};

export default verificationProcess;
