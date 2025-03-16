import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChurnPred from "./pages/ChurnPred";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<ChurnPred />} />
      </Routes>
    </Router>
  );
}

export default App;
