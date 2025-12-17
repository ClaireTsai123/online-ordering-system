import { useEffect, useState } from "react";
import { http } from "../http";
import {useLocation} from "react-router-dom"
import Navbar from "../components/Navbar";

type Order = {
    id: number;
    status: string;
    totalAmount: number;
    createdAt: string;
    items:{
        menuItemId: number;
        name: string;
        price: number;
        quantity: number;
    }[];
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const location = useLocation();
    const success = location.state?.success;

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        const res = await http.get("/api/orders/my");
        setOrders(res.data.data.content);
    }

    async function pay(orderId: number) {
        await http.post(`/api/orders/${orderId}/pay`);
        loadOrders();
    }

    async function cancel(orderId: number) {
        await http.post(`/api/orders/${orderId}/cancel`);
        loadOrders();
    }

    return (
        <div className="p-6">
            {/* Navbar */}
            <Navbar/>

            <h1 className="text-2xl mb-4">My Orders</h1>

            {orders.length === 0 && (
                <p className="text-gray-500">No orders yet</p>
            )}

            <div className="space-y-4">
                {orders.map((o) => (
                    <div key={o.id} className="border rounded p-4">
                        <div className="font-semibold">Order #{o.id}</div>
                        {o.items.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                                {o.items.map((i) => (
                                    <div key={i.menuItemId}>
                                        {i.name} × {i.quantity}
                                    </div>
                                ))}
                            </div>
                        )}
                        <div>Status: {o.status}</div>
                        <div>Total: ${o.totalAmount}</div>
                        <div className="text-sm text-gray-500">
                            {new Date(o.createdAt).toLocaleString()}
                        </div>

                        <div className="mt-3 flex gap-3">
                            {o.status === "CREATED" && (
                                <>
                                    <button
                                        className="bg-green-600 text-white px-3 py-1 rounded"
                                        onClick={() => pay(o.id)}
                                    >
                                        Pay
                                    </button>

                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                        onClick={() => cancel(o.id)}
                                    >
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}
