import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import ChurnPred from "./pages/ChurnPred";
import Home from "./pages/Home";
import { HashLoader } from "react-spinners";
import { motion } from "framer-motion";
import RetrainModel from "./pages/RetrainModel";

const Loader = () => {
  return (
    <motion.div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#1a202c",
        color: "white",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HashLoader color="#36d7b7" size={60} />
      <p style={{ marginTop: "10px", fontSize: "1.2rem", fontWeight: "bold" }}>Loading...</p>
    </motion.div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Simulates API or component loading
  }, []);

  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<ChurnPred />} />
          <Route path="/retrain" element={<RetrainModel />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
