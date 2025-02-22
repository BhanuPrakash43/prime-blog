import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const user = JSON.parse(storedUser);
                if (user?.access_token) {
                    setAuth(user);
                } else {
                    console.log("User data found but missing access token.");
                }
            } else {
                console.log("No user data found in localStorage.");
            }
        } catch (error) {
            console.error("Error parsing user data from localStorage:", error);
            localStorage.removeItem("user");
        }
    }, []);

    function updateAuth(userData) {
        if (userData) {
            localStorage.setItem("user", JSON.stringify(userData));
            setAuth(userData);
        } else {
            localStorage.removeItem("user");
            setAuth(null);
        }
    }

    return (
        <AuthContext.Provider value={{ auth, setAuth: updateAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

export default AuthContextProvider;
