import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index_r.css";
import Nav from "./Nav";
import Landing from "./Landing";
import SecondPg from "./SecondPg";
import Footer from "./Footer";
import ClubPage from "./ClubPage";
import EventDetails from "./Event";
import AddEvent from './Organize';
import AdminDashboard from "./admin/Dashboard";
import Participants from "./Participants";
import EventOwner from "./EventOwner";
import ClubDashboard from "./ClubDashboard";
import EventsPage from './EventsPage';
import AdminLogin from './admin/login';
import ClubLogin from "./components/club/ClubLogin";
import ClubRegister from "./components/club/Clubregister";
// Ensure all assets are in the public/assets folder and replace placeholder URLs with actual ones in components.

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-gray-800 text-white overflow-hidden">
              <Nav />
              <Landing />
              <SecondPg />
              <Footer />
            </div>
          }/>
        <Route path="club/:id" element={<ClubPage />} />
        <Route path="/event/:id" element={<EventDetails/>} />
        <Route path="/organize" element={<AddEvent/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        <Route path="/participants/:id" element={<Participants/>} />
        <Route path="/club/event/:id" element={<EventOwner/>} />
        <Route path="/club/dashboard/:name" element={<ClubDashboard/>} />
        <Route path="/events" element={<EventsPage/>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Club authentication routes */}
        <Route path="/club/login" element={<ClubLogin />} />
        <Route path="/club/register" element={<ClubRegister />} />
        <Route path="/club/dashboard/:id" element={<ClubDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
