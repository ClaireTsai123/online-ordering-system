import { useEffect, useState } from "react";
import { http } from "../http.ts";
import {Link} from "react-router-dom";
import "../../index.css";
import {getRole, isVendorOrAdmin, logout} from "../auth.ts";
import{useNavigate} from "react-router-dom";
import Navbar from "../components/Navbar";

type CartItem = {
    menuItemId: number;
    name: string;
    price: number;
    quantity: number;
};



export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    async function loadCart() {
        const res = await http.get("/api/cart");
        setItems(res.data.data.items);
    }

    useEffect(() => {
        loadCart();
    }, []);

    async function checkout() {
        await http.post("/api/orders");
        //alert("Order placed");
        navigate("/orders",{state:{success: true}});
    }
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    async function increase(item: CartItem) {
        await http.put(`/api/cart/items/${item.menuItemId}?qty=${item.quantity + 1}`);
        loadCart();
    }

    async function decrease(item: CartItem) {
        if (item.quantity === 1) {
            await remove(item.menuItemId);
        } else {
            await http.put(`/api/cart/items/${item.menuItemId}?qty=${item.quantity - 1}`);
            loadCart();
        }
    }

    async function remove(menuItemId: number) {
        await http.delete(`/api/cart/items/${menuItemId}`);
        loadCart();
    }

    return (

        <div className="p-6">
            {/* NAVBAR */}
            <Navbar />

            <h1 className="text-2xl mb-4">Cart</h1>

            {items.length === 0 && (
                <p className="text-gray-500">Your cart is empty</p>
            )}

            {items.map((i) => (
                <div
                    key={i.menuItemId}
                    className="border p-3 mb-2 rounded flex justify-between items-center"
                >
                    <div>
                        <div className="font-semibold">{i.name}</div>
                        <div className="text-sm text-gray-600">
                            ${i.price} × {i.quantity}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            className="px-2 border rounded"
                            onClick={() => decrease(i)}
                        >
                            −
                        </button>

                        <span>{i.quantity}</span>

                        <button
                            className="px-2 border rounded"
                            onClick={() => increase(i)}
                        >
                            +
                        </button>

                        <button
                            className="ml-3 text-red-600 text-sm"
                            onClick={() => remove(i.menuItemId)}
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}

            <div className= "mt-4 font-bold">
                Total: ${total.toFixed(2)}
            </div>
            <button
                className="mt-4 font-bold text-red-600"
                onClick={async () => {
                    await http.delete("/api/cart/clear");
                    loadCart();
                }}
            >
                Clear cart
            </button>
            <button
                disabled={items.length === 0}
                className="bg-emerald-500 hover:bg-emerald-600 text-white transition
 p-2 w-full disabled:opacity-50"
                onClick={checkout}
            >
                Place Order
            </button>
        </div>
    )
}
