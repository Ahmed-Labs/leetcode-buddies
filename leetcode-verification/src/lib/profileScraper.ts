export const getPublicProfile = async (username: string) => {
  const graphqlQuery =
    '{"query":"\\n    query userPublicProfile($username: String!) {\\n  matchedUser(username: $username) {\\n    contestBadge {\\n      name\\n      expired\\n      hoverText\\n      icon\\n    }\\n    username\\n    githubUrl\\n    twitterUrl\\n    linkedinUrl\\n    profile {\\n      ranking\\n      userAvatar\\n      realName\\n      aboutMe\\n      school\\n      websites\\n      countryName\\n      company\\n      jobTitle\\n      skillTags\\n      postViewCount\\n      postViewCountDiff\\n      reputation\\n      reputationDiff\\n      solutionCount\\n      solutionCountDiff\\n      categoryDiscussCount\\n      categoryDiscussCountDiff\\n    }\\n  }\\n}\\n    ","variables":{"username":' +
    `"${username}"` +
    '},"operationName":"userPublicProfile"}';
  try {
    const response = await fetch("https://leetcode.com/graphql/", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
      },
      body: graphqlQuery,
      method: "POST",
    });
    const data = await response.json();
    if (data.errors) {
      const formattedErrors = data.errors
        .map((error) => error.message)
        .join(", ");
      throw new Error(`User Not Found: ${formattedErrors}`);
    }
    return data.data.matchedUser;
  } catch (err) {
    return null;
  }
};
export const userExist = async (username: string) => {
  try {
    const user = getPublicProfile(username);
    return user;
  } catch (err) {
    return false;
  }
};
export const monitorUserBio = async (
  username: string,
  uuid: string,
  timeoutDate: Date
) => {
  const delay = 3000;
  const maxFetches = 25;
  const maxError = 5;
  let fetchError = 0;
  let fetches = 0;
  console.log("Timeout Date", timeoutDate);

  while (fetches <= maxFetches && fetchError < maxError) {
    if (new Date() >= timeoutDate) {
      console.log("Verification timeout. Stopping...");
      break;
    }
    console.log("Waiting for user uuid in bio...");
    try {
      const userProfile = await getPublicProfile(username);
      const userBio = userProfile.profile.aboutMe;
      if (userBio.includes(uuid)) {
        console.log(`[${username}]: Verification Successful!`);
        return true;
      }
      fetches++;
    } catch (err) {
      console.log("Fetch error: ", err);
      fetchError++;
    }
    if (new Date() >= timeoutDate) {
      console.log("Verification timeout. Stopping...");
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  return false;
};
