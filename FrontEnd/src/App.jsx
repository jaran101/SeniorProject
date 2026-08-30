import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/auth/Login";
import Profile from "./components/Profile";
import Header from "./components/bar/header";
import Footer from "./components/bar/footer";
import Show from "./components/service/Show.jsx";
import Data from"./components/data";
import Register from "./components/auth/register";
import Lar from "./components/auth/lar";
import Newprofile from "./components/newprofile";
import Editprofile from "./components/editprofile";

import ServiceCreate from "./components/service/servicecreate.jsx";
import ListService from "./components/service/listservice.jsx";
import SearchMyservice from "./components/service/searchmyservice.jsx";
import ServiceOption from "./components/service/serviceoption.jsx";
import ShowService from "./components/service/showservice.jsx";

import Map from "./components/map/CustomerMap.jsx";
import NewServiceArea from "./components/area/newservicearea.jsx";
import BOQPreview from "./components/Chat/BOQPreview.jsx";
//--------------------------------
import ChatContainer from "./components/Chat/ChatContainer";

//--------------------------------
import "./components/service/servicecreate.css";
import "./components/bar/header.css";
import "./components/bar/footer.css"; 
import "./components/home.css";
import "./components/auth/login.css";
import "./App.css";
import "./components/Profile.css";
import "./components/data.css";
import "./components/auth/register.css";
import "./components/auth/lar.css";
import "./components/service/show.css";
import "./components/newprofile.css";
import "./components/service/searchmyservice.css";
import "./components/service/showservice.css";
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
        <Route path="/data" element={<Layout><Data /><br /></Layout>} />
        <Route path="/register" element={<><Register /><br /></>} />
        <Route path="/lar" element={<><Lar /><br /></>} />
        <Route path="/newprofile" element={<><Newprofile /><br /></>} />
        <Route path="/editprofile" element={<><Editprofile /><br /></>} />
        <Route path="/servicecreate" element={<><ServiceCreate /><br /></>} />
        <Route path="/listservice" element={<><ListService /><br /></>} />
        <Route path="/searchmyservice" element={<><SearchMyservice /><br /></>} />
        <Route path="/serviceoption" element={<><ServiceOption /><br /></>} />
        <Route path="/showservice" element={<><ShowService /><br /></>} />
        <Route path="/chat" element={<Layout><ChatContainer /></Layout>} />
        <Route path="/map" element={<Layout><Map /></Layout>} />
        <Route path="/newservicearea" element={<Layout><NewServiceArea /><br /></Layout>} />
<Route 
  path="/BOQPreview" 
  element={
    <Layout>
      <BOQPreview />
    </Layout>
  } 
/>     </Routes>
    )   
}