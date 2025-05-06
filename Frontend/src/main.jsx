import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AppContextProvider } from "./context/AppContext";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { SocketProvider } from "./context/SocketContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SocketProvider>
      <AppContextProvider>
        <App />
        <Toaster closeButton />
      </AppContextProvider>
    </SocketProvider>
  </BrowserRouter>
);
