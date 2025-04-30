import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export const Login = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      alert("Both phone and password are required");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/login`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phone, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        navigate("/");
      } else {
        if (data.message) {
          alert(data.message);
        } else {
          alert("Login failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      <form
        className="flex flex-col space-y-4 w-full max-w-md"
        onSubmit={handleLogin}
      >
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-green-700 text-white py-2 rounded-md font-semibold"
        >
          Login
        </button>
      </form>
      <p className="mt-6">
        New user?
        <Link to="/register" className="text-blue-500">
          Register here
        </Link>
      </p>
    </div>
  );
};
