import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Message from "./models/Messages.js";
import FriendRequest from "./models/FriendRequest.js";

const usersData = [
  {
    email: "sarah.connor@example.com",
    username: "sarah_connor",
    fullName: "Sarah Connor",
    bio: "Fighter, survivor, tech enthusiast. Let's secure the future.",
    profilePic: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
  },
  {
    email: "david.miller@example.com",
    username: "david_miller",
    fullName: "David Miller",
    bio: "Product Manager | Coffee enthusiast | Lifelong learner.",
    profilePic: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
  },
  {
    email: "emily.watson@example.com",
    username: "emily_watson",
    fullName: "Emily Watson",
    bio: "UI/UX Designer. Pixel perfect advocate. Nature lover 🌿",
    profilePic: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
  },
  {
    email: "james.smith@example.com",
    username: "james_smith",
    fullName: "James Smith",
    bio: "Full-Stack Developer. Coffee, code, repeat. Open source contributor.",
    profilePic: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
  },
  {
    email: "michael.chen@example.com",
    username: "michael_chen",
    fullName: "Michael Chen",
    bio: "Mobile app developer. Hiker & photographer.",
    profilePic: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"
  },
  {
    email: "sophia.martinez@example.com",
    username: "sophia_martinez",
    fullName: "Sophia Martinez",
    bio: "Data Scientist. AI learner. Book worm 📚",
    profilePic: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150"
  }
];

async function seedDB() {
  try {
    console.log("Connecting to database...");
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not defined in server/.env");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Deleting existing users...");
    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} users.`);

    console.log("Deleting existing messages...");
    const deletedMessages = await Message.deleteMany({});
    console.log(`Deleted ${deletedMessages.deletedCount} messages.`);

    console.log("Deleting existing friend requests...");
    const deletedRequests = await FriendRequest.deleteMany({});
    console.log(`Deleted ${deletedRequests.deletedCount} friend requests.`);

    console.log("Hashing password for seed users...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    console.log("Creating new seed users...");
    const seedUsers = usersData.map(user => ({
      ...user,
      password: hashedPassword,
      friends: []
    }));

    const createdUsers = await User.insertMany(seedUsers);
    console.log(`Successfully seeded ${createdUsers.length} users!`);

    console.log("Setting up mutual friendships among seed users...");
    const userIds = createdUsers.map(user => user._id);
    for (const user of createdUsers) {
      user.friends = userIds.filter(id => !id.equals(user._id));
      await user.save();
    }
    console.log("Mutual friendships set up successfully.");

    console.log("\nSeeded Users Details:");
    console.log("===============================");
    createdUsers.forEach(user => {
      console.log(`Name: ${user.fullName}`);
      console.log(`Username: ${user.username}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: password123`);
      console.log(`Bio: ${user.bio}`);
      console.log("-------------------------------");
    });

  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database.");
    process.exit(0);
  }
}

seedDB();
