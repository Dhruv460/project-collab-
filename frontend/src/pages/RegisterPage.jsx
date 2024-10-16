// App.jsx
import React,{useContext} from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '../component/Header.jsx';

import Footer from '../component/Footer.jsx';
import RegisterForm from '../component/RegisterForm.jsx';
// import ProfilePage from './component/ProfilePage.jsx';
// import Login from './component/Login.jsx';
// import ProjectSubmissionForm from './component/ProjectSubmissionForm.jsx';
// import ProjectListing from './component/ProjectListing.jsx';
// import ProjectDetails from './component/ProjectDetails.jsx';
import ThemeProvider from '../ThemeContext';
// import AboutUsPage from './component/About.jsx';
import '../index.css';
import { AuthProvider } from '../AuthContext'; // Import AuthProvider
// import ContactUs from './component/contact.jsx';

const RegisterPage = () => {          
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            {/* <Routes>
              <Route path="/" element={<HeroSection />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/login" element={<Login />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/projects/submit" element={<ProjectSubmissionForm />} />

              <Route path="/projects" element={<ProjectListing />} />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route path="/contact" element={<ContactUs />} />
            </Routes> */}
            <RegisterForm/>
            {/* <FeaturesSection />
            <Testimonials /> */}
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default RegisterPage;
