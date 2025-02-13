import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession(); // Mengambil sesi pengguna saat ini

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to Our App</h1>
        <p className="text-gray-600 mt-2">Your one-stop authentication system</p>

        {session ? (
          <div className="mt-6">
            <p className="text-lg text-gray-700 font-semibold">npm
              Welcome, <span className="text-blue-500">{session.user.name}</span>
            </p>
            <button
              onClick={() => signOut()}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className="text-gray-600">Please log in to continue</p>
            <div className="flex gap-4 mt-4 justify-center">
              <Link href="/login">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition">
                  Register
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
