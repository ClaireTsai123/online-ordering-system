import { useEffect, useState } from "react";
import { http } from "../http";
import Navbar from "../components/Navbar.tsx";

type MenuItem = {
    id?: number;
    name: string;
    price: number;
};

export default function VendorMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [form, setForm] = useState<MenuItem>({ name: "", price: 0 });
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadMenu();
    }, []);

    async function loadMenu() {
        const res = await http.get("/api/menu/items");
        setItems(res.data.data);
    }

    async function save() {
        if (editingId) {
            await http.put(`/api/menu/items/${editingId}`, form);
        } else {
            await http.post("/api/menu/items", form);
        }
        setForm({ name: "", price: 0 });
        setEditingId(null);
        loadMenu();
    }

    async function edit(item: MenuItem) {
        setEditingId(item.id!);
        setForm({ name: item.name, price: item.price });
    }

    async function remove(id: number) {
        if (!confirm("Delete this item?")) return;
        await http.delete(`/api/menu/items/${id}`);
        loadMenu();
    }

    return (
        <div className="p-6">
            {/* Navbar */}
            <Navbar/>

            <h1 className="text-2xl mb-4">Menu Management</h1>

            {/* Form */}
            <div className="mb-6 flex gap-2">
                <input
                    className="border p-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    className="border p-2"
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                    }
                />
                <button
                    className="bg-black text-white px-4"
                    onClick={save}
                >
                    {editingId ? "Update" : "Add"}
                </button>
            </div>

            {/* Table */}
            <table className="w-full border">
                <thead className="bg-gray-100">
                <tr>
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Price</th>
                    <th className="border p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((i) => (
                    <tr key={i.id}>
                        <td className="border p-2">{i.id}</td>
                        <td className="border p-2">{i.name}</td>
                        <td className="border p-2">${i.price}</td>
                        <td className="border p-2">
                            <button
                                className="mr-2 text-blue-600"
                                onClick={() => edit(i)}
                            >
                                Edit
                            </button>
                            <button
                                className="text-red-600"
                                onClick={() => remove(i.id!)}
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
