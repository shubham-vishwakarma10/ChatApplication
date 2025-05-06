import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import channelModel from "../models/channelModel.js";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;

    // Validate admin
    const admin = await userModel.findById(userId);

    if (!admin) {
      return res.status(400).send("Admin user not found.");
    }

    // Validate members
    const validMembers = await userModel.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are not valid users.");
    }

    // Create new channel
    const newChannel = new channelModel({
      name,
      members,
      admin: userId,
    });

    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.error("Error creating channel:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await channelModel
      .find({
        $or: [{ admin: userId }, { members: { $in: [userId] } }],
      })
      .sort({ updatedAt: -1 });

    return res.status(201).json({ channels });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await channelModel.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastname email _id image color",
      },
    });

    if (!channel) {
      return res.status(404).send("channel not found");
    }

    const messages = channel.messages;

    return res.status(201).json({ messages });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
