import {useEffect, useState} from "react";
import {http} from "../http";
import Navbar from "../components/Navbar.tsx";

type MenuItem = {
    id?: number;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    available: boolean;
};

export default function VendorMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [form, setForm] = useState<MenuItem>({
        name: "",
        description: "",
        price: 0.00,
        category: "",
        imageUrl: "",
        available: true,
    });
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
        setForm({
            name: "",
            description: "",
            price: 0,
            category: "",
            imageUrl: "",
            available: true,
        });
        setEditingId(null);
        loadMenu();
    }

    async function edit(item: MenuItem) {
        setEditingId(item.id!);
        setForm({
            name: item.name,
            description: item.description ?? "",
            price: item.price,
            category: item.category ?? "",
            imageUrl: item.imageUrl ?? "",
            available: item.available ?? true,
        });
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
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">

                <input
                    className="border p-2"
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                />


                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>

                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="border p-2 pl-7 w-full"
                        value={form.price}
                        onChange={(e) =>
                            setForm({...form, price: Number(e.target.value)})
                        }
                    />
                </div>

                <input
                    className="border p-2"
                    placeholder="Category (e.g. drink, food)"
                    value={form.category}
                    onChange={(e) => setForm({...form, category: e.target.value})}
                />

                <input
                    className="border p-2"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                />

                <textarea
                    className="border p-2 md:col-span-2"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.available}
                        onChange={(e) =>
                            setForm({...form, available: e.target.checked})
                        }
                    />
                    Available
                </label>

                <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded md:col-span-2"
                    onClick={save}
                >
                    {editingId ? "Update Item" : "Add Item"}
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
                    <th className="border p-2">Category</th>
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

                        <td className="border p-2">{i.category}</td>
                        <td className="border p-2">
                            {i.available ? "Available" : "Hidden"}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
