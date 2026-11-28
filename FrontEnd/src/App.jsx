
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/auth/Login";
import Profile from "./components/Profile";
import Header from "./components/bar/header";
import Sidebar from "./components/bar/Sidebar.jsx";
import Footer from "./components/bar/footer";
import Show from "./components/service/Show.jsx";
import Data from "./components/data";
import Register from "./components/auth/register";
import Lar from "./components/auth/lar";
import Newprofile from "./components/newprofile";
import Editprofile from "./components/editprofile";
import DetailOrder from "./components/techUser/DetailOrder.jsx";
import ServiceCreate from "./components/service/servicecreate.jsx";
import ListService from "./components/service/listservice.jsx";
import SearchMyservice from "./components/service/searchmyservice.jsx";
import ServiceOption from "./components/service/serviceoption.jsx";
import ShowService from "./components/service/showservice.jsx";
import QrTest from "./components/QrTest.jsx";
import Map from "./components/map/CustomerMap.jsx";
import NewServiceArea from "./components/area/newservicearea.jsx";
import BOQPreview from "./components/Chat/BOQPreview.jsx";
import DetailOrderUser from "./components/techUser/DetailOrderUser.jsx";
import Admin from "./components/admin/admin.jsx";
import Slip from "./components/slip.jsx";

import ChatContainer from "./components/Chat/ChatContainer";
import ViewProfile from "./components/view/viewProfile";

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

// Layout สำหรับหน้าที่มี Sidebar และ Footer
function Layout({ children }) {
  return (
    <div className="page">
      <Sidebar />

      <div className="content">
        <div className="content-body">
          {children}
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-shell">

      <div className="route-area">
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/show" element={<Layout><Show /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/data" element={<Layout><Data /></Layout>} />
          <Route path="/register" element={<Register />} />
          <Route path="/lar" element={<Lar />} />
          <Route path="/newprofile" element={<Newprofile />} />
          <Route path="/editprofile" element={<Editprofile />} />
          <Route path="/servicecreate" element={<ServiceCreate />} />
          <Route path="/listservice" element={<ListService />} />
          <Route path="/searchmyservice" element={<SearchMyservice />} />
          <Route path="/serviceoption" element={<ServiceOption />} />
          <Route path="/showservice" element={<ShowService />} />

          <Route path="/chat" element={<Layout><ChatContainer /></Layout>} />
          <Route path="/map" element={<Layout><Map /></Layout>} />
          <Route path="/newservicearea" element={<Layout><NewServiceArea /></Layout>} />
          <Route path="/BOQPreview" element={<Layout><BOQPreview /></Layout>} />
          <Route path="/DetailOrder" element={<Layout><DetailOrder /></Layout>} />
          <Route path="/DetailOrderUser" element={<Layout><DetailOrderUser /></Layout>} />
          <Route path="/viewProfile/:Users_Id" element={<Layout><ViewProfile /></Layout>} />

          <Route path="/QrTest/:orderId" element={<QrTest />} />
          <Route path="/admin" element={<Layout><Admin /></Layout>} />
          <Route path="/slip" element={<Layout><Slip /></Layout>} />
        </Routes>
      </div>
    </div>
  );
}
