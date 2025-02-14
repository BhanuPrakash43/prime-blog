import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function AuthContextProvider({ children }) {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user?.access_token) {
            setAuth(user);
        } else {
            console.log("No user found or missing access token.");
        }
    }, []);

    function updateAuth(userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setAuth(userData);
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
