import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

const AboutUsPage = () => {
  const { theme } = useContext(ThemeContext);

  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-gray-700';
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const linkColor = theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500';
  const headingColor = theme === 'dark' ? 'text-gray-100' : 'text-gray-900';

  return (
    <div className={`container mx-auto px-4 py-8 ${bgColor}`}>
      <h1 className={`text-4xl font-bold text-center mb-8 ${headingColor}`}>About Us</h1>

      <div className="max-w-3xl mx-auto">
        <p className={`text-lg leading-relaxed mb-6 ${textColor}`}>
          Welcome to Project Collab, where collaboration meets innovation! Our platform is designed to bring together individuals from diverse backgrounds and expertise to collaborate on exciting projects and ideas. Whether you're a developer, designer, marketer, or entrepreneur, Project Collab provides the perfect environment to connect, brainstorm, and execute your next big venture.
        </p>

        <div className="flex flex-wrap justify-center mb-8">
          <img src="user1.jpg" alt="Team Photo" className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4" />
          <img src="user2.jpg" alt="Team Photo" className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4" />
          <img src="user1.jpg" alt="Team Photo" className="w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-4" />
        </div>

        <h2 className={`text-2xl font-bold mb-4 ${headingColor}`}>Our Mission</h2>
        <p className={`text-lg leading-relaxed mb-6 ${textColor}`}>
          At Project Collab, our mission is to foster creativity and innovation by facilitating meaningful collaborations. We believe that great ideas are born from collaboration, where different perspectives and skills converge to solve complex problems and create impactful solutions.
        </p>

        <h2 className={`text-2xl font-bold mb-4 ${headingColor}`}>What We Offer</h2>
        <ul className="list-disc pl-6">
          <li className={`text-lg mb-2 ${textColor}`}>Collaboration Tools: Our platform provides robust tools to facilitate collaboration, including project management, communication channels, file sharing, and more.</li>
          <li className={`text-lg mb-2 ${textColor}`}>Networking Opportunities: Connect with like-minded individuals across various industries and disciplines to expand your network and build lasting professional relationships.</li>
          <li className={`text-lg mb-2 ${textColor}`}>Project Showcase: Showcase your projects and achievements to gain recognition and attract potential collaborators or investors.</li>
          <li className={`text-lg mb-2 ${textColor}`}>Learning and Development: Access resources, workshops, and expert advice to enhance your skills and knowledge, empowering you to take your projects to the next level.</li>
        </ul>

        <h2 className={`text-2xl font-bold mb-4 ${headingColor}`}>Why Choose Project Collab?</h2>
        <ul className="list-disc pl-6">
          <li className={`text-lg mb-2 ${textColor}`}>Diverse Community: Join a diverse community of creators, innovators, and experts passionate about making a difference in their respective fields.</li>
          <li className={`text-lg mb-2 ${textColor}`}>User-Friendly Interface: Our platform is designed with simplicity and ease of use in mind, ensuring a seamless experience for all users.</li>
          <li className={`text-lg mb-2 ${textColor}`}>Security and Privacy: We prioritize the security and privacy of our users' data, ensuring a safe environment for collaboration.</li>
        </ul>

        <h2 className={`text-2xl font-bold mb-4 ${headingColor}`}>Get Started</h2>
        <p className={`text-lg leading-relaxed mb-6 ${textColor}`}>
          Ready to turn your ideas into reality? Join Project Collab today and start collaborating with the brightest minds from around the world. Whether you're looking to start a new venture,find collaborators for an existing project, or simply explore new opportunities, Project Collab is your gateway to success.
        </p>

        <button className={`bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ${linkColor}`}>
          Join Now
        </button>

        <h2 className={`text-2xl font-bold mb-4 ${headingColor}`}>Contact Us</h2>
        <p className={`text-lg leading-relaxed mb-6 ${textColor}`}>
          Have questions or feedback? We'd love to hear from you! Contact our support team at <a href="mailto:support@projectcollab.com" className={`${linkColor}`}>support@projectcollab.com</a> or connect with us on social media.
        </p>
      </div>
    </div>
  );
};

export default AboutUsPage;