import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ChatBot from "./pages/pagesCatbot/Components/chatBot.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChatBot />
  </StrictMode>
);
