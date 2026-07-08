import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Header from "./components/bar/header";
import Footer from "./components/bar/footer";
import Show from "./components/Show";
import Calendar from "./components/calendar";
import Data from"./components/data";
import Register from "./components/register";
import Lar from "./components/lar";
import Newprofile from "./components/newprofile";
import Editprofile from "./components/editprofile";
import ServiceCreate from "./components/servicecreate";
import ListService from "./components/listservice";
import Readservice from "./components/readservice";
import SearchMyservice from "./components/searchmyservice";
import ServiceOption from "./components/serviceoption";
import ChatPage from "./components/chart/Chatpage";
import ShowService from "./components/showservice";
import "./components/servicecreate.css";
import "./components/bar/header.css";
import "./components/bar/footer.css"; 
import "./components/home.css";
import "./components/login.css";
import "./App.css";
import "./components/Profile.css";
import "./components/calendar.css";
import "./components/data.css";
import "./components/register.css";
import "./components/lar.css";
import "./components/show.css";
import "./components/newprofile.css";
import "./components/searchmyservice.css";
import "./components/chart/Chatpage.css";
import "./components/showservice.css";
function Layout({ children }) {
  return (
    <div className="page">
      <Header />
      <main className="content">
      {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout><Home /><br /></Layout>} />
        <Route path="/login" element={<><Login /><br /></>} />
        <Route path="/show" element={<Layout><Show /><br /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /><br /></Layout>} />
        <Route path="/calendar" element={<Layout><Calendar /><br /></Layout>} />
        <Route path="/data" element={<Layout><Data /><br /></Layout>} />
        <Route path="/register" element={<><Register /><br /></>} />
        <Route path="/lar" element={<><Lar /><br /></>} />
        <Route path="/newprofile" element={<><Newprofile /><br /></>} />
        <Route path="/editprofile" element={<><Editprofile /><br /></>} />
        <Route path="/servicecreate" element={<><ServiceCreate /><br /></>} />
        <Route path="/listservice" element={<><ListService /><br /></>} />
        <Route path="/readservice" element={<><Readservice /><br /></>} />
        <Route path="/searchmyservice" element={<><SearchMyservice /><br /></>} />
        <Route path="/serviceoption" element={<><ServiceOption /><br /></>} />
        <Route path="/chatpage" element={<Layout><ChatPage /></Layout>} />
        <Route path="/showservice" element={<><ShowService /><br /></>} />
      </Routes>
    )   
}