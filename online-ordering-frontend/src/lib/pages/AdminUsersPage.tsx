import { useEffect, useState } from "react";
import { http } from "../http";
import Navbar from "../components/Navbar.tsx";

type User = {
    id: number;
    username: string;
    email: string;
    role: string;
};

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        const res = await http.get("/api/users");
        setUsers(res.data.data);
    }

    async function deleteUser(id: number) {
        if (!confirm("Delete this user?")) return;
        await http.delete(`/api/users/${id}`);
        loadUsers();
    }

    return (
        <div className="p-6">
            {/* NAVBAR */}
            <Navbar/>

            <h1 className="text-2xl mb-4">User Management</h1>

            <table className="w-full border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Action</th>
                </tr>
                </thead>

                <tbody>
                {users.map((u) => (
                    <tr key={u.id}>
                        <td className="border p-2">{u.id}</td>
                        <td className="border p-2">{u.username}</td>
                        <td className="border p-2">{u.email}</td>
                        <td className="border p-2">
                <span className="px-2 py-1 bg-gray-200 rounded">
                  {u.role}
                </span>
                        </td>
                        <td className="border p-2">
                            <button
                                className="text-red-600"
                                onClick={() => deleteUser(u.id)}
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
