import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useAppStore } from "./store";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "./context/AppContext";
import { Auth } from "./pages/auth/Auth";
import { Chat } from "./pages/chat/Chat";
import { Profile } from "./pages/profile/Profile";

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  if (isAuthenticated === undefined) return <div>Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  if (isAuthenticated === undefined) return <div>Loading...</div>;

  return isAuthenticated ? <Navigate to="/chat" /> : children;
};

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const { api_url } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return; // Prevent duplicate calls
    hasFetched.current = true; // Mark as fetched

    const getUserData = async () => {
      try {
        const response = await axios.get(`${api_url}/api/auth/user-info`, {
          withCredentials: true,
        });

        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        console.log(error);
        setUserInfo(undefined);
      } finally {
        setLoading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setLoading(false);
    }
  }, [api_url]); // ✅ Only `api_url` needed

  if (loading) {
    return <div>Loading....</div>;
  }

  return (
    <div>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthRoute>
              <Auth />
            </AuthRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  );
}

export default App;
