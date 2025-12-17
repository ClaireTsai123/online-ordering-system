import { Link } from "react-router-dom";

export default function WelcomePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-sky-100">
            <div className="bg-white rounded-2xl shadow-2xl px-16 py-14 max-w-2xl w-full text-center animate-fade-in">

            {/*<div className="bg-white rounded-2xl shadow-2xl px-16 py-14 max-w-2xl w-full text-center">*/}

                {/* Icon */}
                <div className="text-6xl mb-6">🛒</div>

                {/* Title */}
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Welcome to Our <br /> Shopping Mall
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-gray-600 mb-10">
                    Fresh food · Fast ordering · Simple checkout
                </p>

                {/* Actions */}
                <div className="flex justify-center gap-6">
                    <Link
                        to="/login"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-10 py-3 rounded-lg transition shadow-md"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-10 py-3 rounded-lg transition shadow-md"
                    >
                        Sign Up
                    </Link>
                </div>

            </div>
        </div>
    );
}
