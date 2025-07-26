import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const AuthCTX = React.createContext({
  isAuthenticated: false,
  userDetails: null,
  authenticateOnRefresh: () => {},
  _login: () => {},
  _logout: () => {},
});

const AuthContextProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  const router = useRouter();

  useEffect(() => {
    authenticateOnRefresh();
  }, []);

  const authenticateOnRefresh = () => {
    // Logic to check if user is authenticated on page refresh
    const token = localStorage.getItem("accessToken");
    const userDetails = localStorage.getItem("userDetails");

    if (!token || !userDetails) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // decode base64 payload
      const currentTime = Math.floor(Date.now() / 1000); // current time in seconds

      if (payload.exp && payload.exp > currentTime) {
        setUserDetails(userDetails);
        setIsAuthenticated(true);
        if (router.pathname === "/") {
          router.push("/dashboard"); // redirect to dashboard if authenticated
        }
      } else {
        localStorage.clear(); // cleanup
        setIsAuthenticated(false);
        if (router.pathname !== "/") {
          router.push("/"); // redirect to login if token is expired
        }
      }
    } catch (err) {
      console.error("Failed to decode or validate token", err);
      localStorage.clear();
      if (router.pathname !== "/") {
        console.error("Invalid token, redirecting to login");
        router.push("/"); // redirect to login if token is invalid
      }
      setIsAuthenticated(false);
    }
  };

  const _login = (data) => {
    const { token, userDetails } = data;

    setIsAuthenticated(true);
    setUserDetails(userDetails);
    localStorage.setItem("accessToken", JSON.stringify(token));
    localStorage.setItem("userDetails", userDetails);
  };

  const _logout = () => {
    // Logic to handle logout
    setIsAuthenticated(false);
    setUserDetails(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userDetails");
    if (router.pathname !== "/") {
      router.push("/"); // redirect to login on logout
    }
  };

  // Prevent rendering if not authenticated and not on the root path
  if (!isAuthenticated && router.pathname !== "/") return null;

  return (
    <AuthCTX.Provider
      value={{
        userDetails,
        isAuthenticated: false,
        authenticateOnRefresh,
        _login,
        _logout,
      }}
    >
      {props.children}
    </AuthCTX.Provider>
  );
};

const useAuthCTX = () => {
  const context = React.useContext(AuthCTX);
  if (!context) {
    throw new Error("useAuthCTX must be used within an AuthContextProvider");
  }
  return context;
};

export { AuthCTX, AuthContextProvider, useAuthCTX };
