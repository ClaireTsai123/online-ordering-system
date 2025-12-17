import {useEffect, useState} from "react";
import {http} from "../http";
import {Link} from "react-router-dom";
import "../../index.css";
import {isVendorOrAdmin, logout} from "../auth.ts";
import {getRole} from "../auth.ts";
import Navbar from "../components/Navbar";

type MenuItem = {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
};


export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [addedId, setAddedId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({})

    useEffect(() => {
        http.get("/api/menu/items").then((res) => {
            setMenus(res.data.data); // matches your ApiResponse
        });
    }, []);

    async function addToCart(menuItemId: number) {
        const currentQty = quantities[menuItemId] ?? 0;
        if (currentQty == 0) {
            await http.post("/api/cart/items", {
                menuItemId,
                quantity: 1,
            });
        } else {
            await http.put(`/api/cart/items/${menuItemId}?qty=${currentQty + 1}`);
        }

        setAddedId(menuItemId);
        setTimeout(() => setAddedId(null), 1000);
        setQuantities((prev) => ({
            ...prev,
            [menuItemId]: currentQty + 1,
        }));
    }


    return (
        <div className="p-6">
            {/* NAVBAR */}
            <Navbar />

            <h1 className="text-2xl mb-4">Menu</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menus.map((m) => (
                    <div key={m.id} className="border rounded-lg p-3 shadow-sm hover:shadow-md">
                        <img
                            src={m.imageUrl}
                            onError={(e) => {
                                if (!e.currentTarget.src.includes("placehold.co")) {
                                    const text = encodeURIComponent(m.name)
                                    e.currentTarget.src = `https://placehold.co/300x200?text=${text}`;
                                }
                            }}
                            className="w-full h-40 object-cover mb-2"
                        />
                        <h2 className="font-bold">{m.name}</h2>
                        <p className="text-gray-600">${m.price}</p>

                        <button
                            onClick={() => addToCart(m.id)}
                            className={`mt-2 w-full py-2 rounded text-white transition
                             ${addedId === m.id
                                ? "bg-emerald-600"
                                : "bg-indigo-600 hover:bg-indigo-700"}
  `}
                        >
                            {addedId === m.id ? "Added ✓" : "Add to Cart"}
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
}
