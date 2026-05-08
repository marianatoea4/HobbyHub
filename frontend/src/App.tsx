import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import EventDetails from "./pages/EventDetails";
import EditEvent from "./pages/EditEvent";
import Messages from "./pages/Messages";
import AboutUs from "./pages/AboutUs";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <Router>
      <Routes>
        {/* meow meow */}
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/edit-event/:id" element={<EditEvent />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/despre-noi" element={<AboutUs />} />
        <Route path="/termeni" element={<Terms />} />
        <Route path="/confidentialitate" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </Router>
  );
}

export default App;
