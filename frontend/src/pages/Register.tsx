import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/user/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        alert(data.message || "Registration failed ");
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-20 px-4">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      <form
        className="flex flex-col space-y-4 w-full max-w-md"
        onSubmit={handleRegister}
      >
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-4 py-2 rounded-md"
          required
        />
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
          Register
        </button>
      </form>
    </div>
  );
};
