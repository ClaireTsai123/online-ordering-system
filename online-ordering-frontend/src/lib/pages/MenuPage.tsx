import {useEffect, useState} from "react";
import {http} from "../http";
import "../../index.css";
import Navbar from "../components/Navbar";

type MenuItem = {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
};


export default function MenuPage() {
    const [menus, setMenus] = useState<MenuItem[]>([]);
    const [addedId, setAddedId] = useState<number | null>(null);
    const [quantities, setQuantities] = useState<Record<number, number>>({})
    const [category, setCategory] = useState<String>("ALL");

    async function loadMenus(selectedCategory: String) {
        if (selectedCategory === "ALL") {
            const res = await  http.get("/api/menu/items");
            setMenus(res.data.data);
        } else {
            const  res = await http.get(`api/menu/items/category?category=${selectedCategory.toLowerCase()}`);
            setMenus(res.data.data);
        }
    }
    useEffect(() => {
       loadMenus(category)
    }, [category]);

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
            <div className="flex gap-3 mb-6">
                {["ALL", "DRINK", "FOOD", "DESSERT"].map((c) => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded transition
              ${category === c
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"}
            `}
                    >
                        {c}
                    </button>
                ))}
            </div>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {menus.length === 0 && (
                    <p className="text-gray-500">No items found for this category.</p>
                )}
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
