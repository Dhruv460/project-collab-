import React ,{useContext,useState} from 'react';
import {Link} from 'react-router-dom'

import { AuthContext } from '../AuthContext';


const HeroSection = () => {
   const {userId,setUserId} = useContext(AuthContext)

  return (
    <section className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-24">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Our Platform</h1>
        <p className="text-xl mb-6">The best place to collaborate, innovate, and customize your workflow.</p>

  
{
  userId?(
<Link to='/projects' className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md" >
          Get Started
        </Link>
  ):(
    <Link to='/login' className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md" >
          Get Started
        </Link>
  )
}
        
        
      </div>
    </section>
  );
};

export default HeroSection;
