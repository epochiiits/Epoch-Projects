
import { BrowserRouter , Routes , Route} from "react-router-dom";
import "./index_r.css";
import Nav from "./Nav";
import Landing from "./Landing";
import SecondPg from "./SecondPg";
import Footer from "./Footer";
import ClubPage from "./ClubPage";
import EventDetails from "./Event";
import AddEvent from './Organize'
import AdminDashboard from "./admin/Dashboard";
import Participants from "./Participants";
import EventOwner from "./EventOwner";
import ClubDashboard from "./ClubDashboard";
import EventsPage from './EventsPage'
import AdminLogin from './admin/login';
// Ensure all assets are in the public/assets folder and replace placeholder URLs with actual ones in components.

function App() {
  return (
    <BrowserRouter>
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
        <Route path="club/:name" element={<ClubPage />} />
        <Route path="/event/:name" element={<EventDetails/>} />
        <Route path="/organize" element={<AddEvent/>} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route path="/participants" element={<Participants/>} />
        <Route path="/club/event/:id" element={<EventOwner/>} />
        <Route path="/club/dashboard/:name" element={<ClubDashboard/>} />
        <Route path="/events" element={<EventsPage/>} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
