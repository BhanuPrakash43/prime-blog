import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextProvider";

function useAxiosGet({ endpoint, sendToken = false, dataKey = null }) {
    const { auth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState(null);

    // Memoize the config to prevent unnecessary re-creations
    const config = useMemo(
        () => ({
            headers: {
                ...(sendToken && auth?.access_token
                    ? { Authorization: `Bearer ${auth.access_token}` }
                    : {}),
                "Content-Type": "application/json",
            },
        }),
        [sendToken, auth?.access_token]
    );

    // Use useCallback to avoid recreating the fetchData function on every render
    const fetchData = useCallback(async () => {
        if (!endpoint) {
            setError("Endpoint is required");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await axios.get(endpoint, config);

            // Handle the response data based on whether dataKey is provided
            const responseData = dataKey
                ? response.data[dataKey]
                : response.data;

            if (responseData === undefined) {
                throw new Error(`Data key "${dataKey}" not found in response`);
            }

            setData(responseData);
        } catch (error) {
            console.error("Axios Error:", error);

            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        setError("Unauthorized. Please log in again.");
                        break;
                    case 403:
                        setError(
                            "Access forbidden. Please check your permissions."
                        );
                        break;
                    case 404:
                        setError("Requested data not found.");
                        break;
                    case 500:
                        setError("Server error. Please try again later.");
                        break;
                    default:
                        setError(
                            `Error: ${error.response.data.message || "Failed to fetch data"}`
                        );
                }
            } else if (error.request) {
                setError(
                    "No response from server. Please check your connection."
                );
            } else {
                setError(
                    error.message || "Failed to fetch data. Please try again."
                );
            }
        } finally {
            setIsLoading(false);
        }
    }, [endpoint, config, dataKey]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const refresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { isLoading, error, data, refresh };
}

export default useAxiosGet;
