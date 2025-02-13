import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, password, role } = req.body;

  // Validasi input
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // Cek apakah user sudah ada
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simpan user ke database
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role: role || "USER" },
  });

  res.status(201).json({ message: "User registered successfully", user });
}
