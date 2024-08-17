import User from "../model/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import TokenBlacklist from "../model/TokenBlackList.js";

const secret = process.env.SECRET_TOKEN;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Please enter deltails properly!",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "This email address already exists, Please Login!",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    newUser.status = "registered";
    await newUser.save();
    return res.status(201).json({
      message: "Account created Successfully!",
    });
  } catch (error) {
    console.log("Error in Registration: ", error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for email and password
    if (!email || !password) {
      return res.status(401).json({
        message: "Please Enter Correct email or password!",
      });
    }

    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not Found, please register!",
      });
    }

    // Check if the password is correct
    const isPasswordOk = await bcrypt.compare(password, user.password);
    if (!isPasswordOk) {
      return res.status(404).json({
        message: "Incorrect Password!",
      });
    }

    // Update the user status
    user.status = "logged-In";
    await user.save(); // Save the updated user document

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1d" });

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
      status: user.status, // Include updated status
    };

    // Set cookie and respond
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        user,
      });
  } catch (error) {
    console.log("Error during login: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

// export const logout = async (req, res) => {
//   try {
//     const token =
//       req.cookies.token || req.headers["authorization"]?.split(" ")[1];
//     console.log("Cookies: ", req.cookies);
//     console.log("Headers: ", req.headers);
//     if (!token) {
//       return res.status(400).json({ message: "No token provided" });
//     }
//     await TokenBlacklist.create({ token });
//     res.cookie("token", "", { maxAge: 0 });
//     return res.json({
//       message: "Logged out successfully",
//     });
//   } catch (error) {
//     console.log("Error during logout: ", error);
//   }
// };

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    return res.json({
      message: "Logged out Successfully",
    });
  } catch (error) {
    console.log(error, "Error during Logout");
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await user.findById(userId).select("-password")
    return res.sattus(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log("Error during getting a profile", error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url; // profilePicture is storedd inside cloudResponse.secureUrl;
    await user.save();

    return res.status(200).json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    console.log("Error during editing the profile", error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently we don't have any suggested friends",
      });
    }
    return res.status(200).json({
      users: suggestedUsers,
    });
  } catch (error) {
    console.log("Error in suggesting the User Profiles", error);
  }
};

export const followorUnfollow = async (req, res) => {
  try {
    const personWhoIsFollowing = req.id; // me
    console.log(req)
    const personWhoIsBeingFollowed = req.params.id; // my crush
    if (personWhoIsFollowing === personWhoIsBeingFollowed) {
      return res.status(400).json({
        message: "You can't follow/unfollow yourself",
      });
    }
    const user = await User.findById(personWhoIsFollowing);
    const targetUser = await User.findById(personWhoIsBeingFollowed);
    if (!user || !targetUser) {
      return res.status(404).json({
        message: "either you or the user you want to follow doesn't exist!",
      });
    }
    // cheking if we want to follow or unfollow
    const isFollowing = user.following.includes(personWhoIsBeingFollowed);
    if (isFollowing) {
      // unfollow him/her
      await Promise.all([
        User.updateOne(
          { _id: personWhoIsFollowing },
          { $pull: { following: personWhoIsBeingFollowed } }
        ),
        User.updateOne(
          { _id: personWhoIsBeingFollowed },
          { $pull: { followers: personWhoIsFollowing } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully",
      });
    } else {
      //follow him/her
      await Promise.all([
        User.updateOne(
          { _id: personWhoIsFollowing },
          { $push: { following: personWhoIsBeingFollowed } }
        ),
        User.updateOne(
          { _id: personWhoIsBeingFollowed },
          { $push: { followers: personWhoIsFollowing } }
        ),
      ]);
      return res.status(200).json({
        message: "Following successfully, Enjoy!",
      });
    }
  } catch (error) {
    console.log("Error during following/unfollowing the User", error);
  }
};


// learn auth and RBAC (role-based access control for authorization) and unit testing 