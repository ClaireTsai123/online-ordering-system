import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./lib/pages/LoginPage.tsx";
import { isLoggedIn } from "./lib/auth";
import {JSX} from "react";
import MenuPage from "./lib/pages/MenuPage.tsx";
import CartPage from "./lib/pages/CartPage.tsx";
import OrdersPage from"./lib/pages/OrdersPage.tsx";
import{getRole} from "./lib/auth";
import AdminUsersPage from"./lib/pages/AdminUsersPage.tsx";
import{isVendorOrAdmin} from "./lib/auth";
import VendorMenuPage from "./lib/pages/VendorMenuPage.tsx";
import WelcomePage from "./lib/pages/WelcomePage";
import RegisterPage from "./lib/pages/RegisterPage.tsx";

function Protected({ children }: { children: JSX.Element }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
function AdminOnly({children}:{children: JSX.Element}) {
    return getRole() === "ROLE_ADMIN" ? children : <Navigate to="/" replace />;
}
function VendorOrAdminOnly({ children }: { children: JSX.Element }) {
    return isVendorOrAdmin()
        ? children
        : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<WelcomePage />} />
                <Route path="/register" element={<RegisterPage/>} />

                <Route
                    path="/menu"
                    element={
                        <Protected>
                            <MenuPage />
                        </Protected>
                    }
                />
                <Route
                    path="/cart"
                    element={
                        <Protected>
                            <CartPage />
                        </Protected>
                    }
                />
                <Route
                    path="/orders"
                    element={
                        <Protected>
                            <OrdersPage />
                        </Protected>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <Protected>
                            <AdminOnly>
                                <AdminUsersPage />
                            </AdminOnly>
                        </Protected>
                    }
                />
                <Route
                    path="/vendor/menu"
                    element={
                        <Protected>
                            <VendorOrAdminOnly>
                                <VendorMenuPage />
                            </VendorOrAdminOnly>
                        </Protected>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
