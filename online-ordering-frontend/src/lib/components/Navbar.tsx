import {Link} from "react-router-dom";
import {getRole, logout} from "../auth.ts";
import {useEffect, useState} from "react";
import {http} from "../http.ts";
import {JSX} from "react";

export default function Navbar() {
    const role = getRole();
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        if (!role || role.includes("ADMIN")) return;

        http.get("/api/cart")
            .then((res) => {
                const items = res.data.data?.items ?? [];
                const count = items.reduce(
                    (sum: number, i: any) => sum + i.quantity,
                    0
                );
                setCartCount(count);
            })
            .catch(() => {
            });
    }, []);

    return (
        <div className="flex items-center gap-6 mb-6 border-b pb-3">
            {/* Left */}
            <Link to="/menu" className="text-gray-700 font-bold hover:text-indigo-600">Menu</Link>

            <Link to="/cart" className="text-gray-700 font-bold hover:text-indigo-600">
                Cart
                {cartCount > 0 && (
                    <span className="ml-1 text-xs bg-red-500 text-white px-2 rounded-full">
            {cartCount}
          </span>
                )}
            </Link>

            <Link className="text-gray-700 font-bold hover:text-indigo-600" to="/orders">Orders</Link>

            {(role?.includes("ADMIN") || role?.includes("VENDOR")) && (
                <Link className="text-gray-700 font-bold hover:text-indigo-600" to="/vendor/menu">Manage Menu</Link>
            )}

            {role?.includes("ADMIN") && (
                <Link className="text-gray-700 font-bold hover:text-indigo-600" to="/admin/users">Admin</Link>
            )}

            {/* Right */}
            <div className="ml-auto flex items-center gap-4">
        <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
          {role?.replace("ROLE_", "")}
        </span>

                <button
                    className="text-sm text-red-600"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
