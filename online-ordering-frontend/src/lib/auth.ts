export function saveAuth(token: string, role: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
}

export function isLoggedIn() {
    return !!localStorage.getItem("token");
}
export function logout() {
    localStorage.clear();
    window.location.href ="/login";
}
export function getRole() {
    return localStorage.getItem("role");
}

export function isVendorOrAdmin() {
    const role = localStorage.getItem("role");
    return role?.includes("ADMIN") || role?.includes("VENDOR");
}

