import { User } from "../../models/User.js";
import { verifyToken } from "../../util/token.js";

async function getUserDetails(req) {
  let resStatus = 200;
  let resMessage = {};

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  const user = await verifyToken(token);
  if (user === null) {
    resStatus = 400;
    resMessage = { Error: "Not authenticated" };
    return { resStatus, resMessage };
  }

  const { userId } = req.params;
  try {
    const userDetails = await User.findOne({ _id: userId }).select(
      "name username postCount followerCount followingCount"
    );
    if (!userDetails) {
      resStatus = 404;
      resMessage = { Error: "User not found" };
      return { resStatus, resMessage };
    }

    // Return the user details
    resMessage = {
      name: userDetails.name,
      username: userDetails.username,
      postCount: userDetails.postCount,
      followerCount: userDetails.followerCount,
      followingCount: userDetails.followingCount
    };
  } catch (err) {
    console.log(err);
    resStatus = 500;
    resMessage = { Error: "Internal server error" };
  }

  return { resStatus, resMessage };
}

export default getUserDetails;
