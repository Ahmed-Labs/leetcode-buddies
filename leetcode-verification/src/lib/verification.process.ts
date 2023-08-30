import Bull, { Job } from "bull";
import { monitorUserBio } from "./profileScraper.js";

const verificationProcess = async (job: Job, done: Bull.DoneCallback) => {
  const { username, uuid } = job.data;
  console.log("Verifying: " + username);
  console.log("PASTE THIS UUID");
  console.log(uuid);

  const verificationComplete = await monitorUserBio(username, uuid);
  done();
  return verificationComplete;
};

export default verificationProcess;
