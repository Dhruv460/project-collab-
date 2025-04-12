// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./component/Header.jsx";
import HeroSection from "./component/HeroSection.jsx";
import FeaturesSection from "./component/FeaturesSection.jsx";
import Testimonials from "./component/Testimonials.jsx";
import Footer from "./component/Footer.jsx";
import RegisterForm from "./component/RegisterForm.jsx";
import ProfilePage from "./component/ProfilePage.jsx";
import Login from "./component/Login.jsx";
import ProjectSubmissionForm from "./component/ProjectSubmissionForm.jsx";
import ProjectListing from "./component/ProjectListing.jsx";
import ProjectDetails from "./component/ProjectDetails.jsx";
import ThemeProvider from "./ThemeContext";
import AboutUsPage from "./component/About.jsx";
import ContactUs from "./component/contact.jsx";
import Chat from "./component/ChatComponent.jsx"; // Import the ChatComponent
import MyProjects from "./component/MyProjects.jsx";
import ChatAi from "./component/chatAi.jsx";
import ForgotPassword from "./component/forgotPassword.jsx";
import "./index.css";
import { AuthProvider } from "./AuthContext";
import EmailVerify from "./component/emailVerify.jsx";
import SearchResults from "./component/SearchResults.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import ChatProvider from "./context/chatProvider.jsx";
import ChatPage from "./component/chatPages.jsx";
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <Header />
      {isHomePage && <HeroSection />}

      <Routes>
        {/* <Route path="/" element={<HeroSection />} /> */}
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/projects/submit" element={<ProjectSubmissionForm />} />
        <Route path="/projects" element={<ProjectListing />} />
        <Route path="/projects/:id" element={<ProjectDetails />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/myprojects" element={<MyProjects />} />
        <Route path="/projects/:projectId/chat" element={<Chat />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/chatAi" element={<ChatAi />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
        <Route path="/chats" element={<ChatPage />} />
      </Routes>
      {isHomePage && <FeaturesSection />}
      {isHomePage && <Testimonials />}
      <Footer />
      {/* <Route path="/chat/:projectId" element= {<Chat/>} /> */}
      {/* Add the ChatComponent here */}
    </>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ChatProvider>
              <div className="App">
                <AppContent />
              </div>
            </ChatProvider>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
