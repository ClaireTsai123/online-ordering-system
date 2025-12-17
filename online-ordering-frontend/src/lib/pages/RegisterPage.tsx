import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { http } from "../http.ts";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("CUSTOMER");

    const navigate = useNavigate();

    async function register() {
        if (!username ||!password ||!email) {
            alert("Username, email, and password are required");
            return;
        }
        await http.post("/api/auth/register", {
            username,
            password,
            email,
            phone,
            role,
        });

        alert("Registration successful. Please login.");
        navigate("/login");
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="w-80 p-6 border rounded">
                <h1 className="text-xl mb-4">Sign Up</h1>

                <input
                    className="border w-full mb-2 p-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border w-full mb-2 p-2"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="border w-full mb-4 p-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    className="border w-full mb-2 p-2"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <select
                    className="border w-full mb-4 p-2"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="CUSTOMER">Customer</option>
                    <option value="VENDOR">Vendor</option>
                </select>

                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white rounded transition w-full p-2 mb-2"
                    onClick={register}
                >
                    Register
                </button>

                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <Link className="underline" to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
