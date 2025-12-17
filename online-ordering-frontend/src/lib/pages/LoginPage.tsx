import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {http} from "../http.ts";
import {saveAuth} from "../auth";

function parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64));
}
export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleLogin() {
        const res = await http.post("api/auth/login", {
            username,
            password,
        });

        const token = res.data.data.token;
        const payload = parseJwt(token)
        console.log("LOGIN RESPONSE:", res.data);
        console.log("LOGIN payload:", payload);
        const role = payload.role;
        console.log("LOGIN role:", role);

        saveAuth(token, role);
        navigate("/menu");
    }



    return (

        <div className="h-screen flex items-center justify-center">

            <div className="w-80 p-6 border rounded">
                <h1 className="text-xl mb-4">Login</h1>
                <input
                    className="border w-full mb-2 p-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border w-full mb-4 p-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition w-full p-2 mb-2"
                    onClick={handleLogin}
                >
                    Login
                </button>

            </div>
        </div>
    );
}
