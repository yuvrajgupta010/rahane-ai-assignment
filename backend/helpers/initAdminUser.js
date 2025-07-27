import User from "../models/user.js";
import bcrypt from "bcrypt";

export const createAdminUserIfNotExists = async () => {
  const existingUser = await User.findOne({ email: "admin@rahaneai.com" });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      fullName: process.env.ADMIN_FULL_NAME,
      role: "admin",
    });

    console.log("✅ Admin user created.");
  } else {
    console.log("ℹ️ Admin user already exists. Skipping creation.");
  }
};
