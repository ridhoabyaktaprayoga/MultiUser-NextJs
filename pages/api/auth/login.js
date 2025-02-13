import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    // Cek apakah user ada di database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Cek apakah password valid
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Buat token untuk session user
    const token = sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.NEXTAUTH_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    // Set token dalam cookie
    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly`);
    
    return res.json({ message: "Login successful", role: user.role });
  } catch (error) {
    console.error("Login Error:", error);

    if (error instanceof TypeError) {
      return res.status(400).json({ error: "Invalid request data" });
    } else if (error.code === "P2025") {
      return res.status(404).json({ error: "Database entry not found" });
    } else {
      return res.status(500).json({ error: "Something went wrong, please try again" });
    }
  }
}
