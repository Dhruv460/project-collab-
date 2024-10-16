import React from 'react';

const Testimonials = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-12">
      <div className="container mx-auto">
        <div className="testimonial flex flex-col items-center mb-8">
          <img src="../public/user1.jpg" alt="User 1" className="w-24 h-24 rounded-full mb-4" />
          <blockquote className="text-lg italic">"This platform changed the way we collaborate."</blockquote>
          <cite className="mt-2 text-sm">John Doe</cite>
        </div>
        <div className="testimonial flex flex-col items-center">
          <img src="../public/user2.jpg" alt="User 2" className="w-24 h-24 rounded-full mb-4" />
          <blockquote className="text-lg italic">"Easy to use and effective. Highly recommended!"</blockquote>
          <cite className="mt-2 text-sm">Jane Smith</cite>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
