import React  from "react";
import { createRoot } from "react-dom/client";
import "./index_r.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId="516632506799-3lvks4cg0bvs8tf1d22fophafrd1mrpl.apps.googleusercontent.com">
      <App/>
    </GoogleOAuthProvider>
);
