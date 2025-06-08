import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    name: string;
    role: string;
    exp: number;
}

export function getAuthUserFromCookie() {
    const cookies = parseCookies(); 
    const token = cookies.authToken; 

    if (!token) return null; 

    try {
        const decoded: DecodedToken = jwtDecode(token);

        if (decoded.exp * 1000 < Date.now()) {
            return null; // Token expired
        }

        return decoded; // Return user info (id, name, role)
    } catch (error) {
        return null; // Invalid token
    }
}
