import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="feature bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
            <div className="feature-icon bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <i className="fas fa-users text-2xl"></i>
            </div>
            <div className="feature-text">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Collaborate</h3>
              <p className="text-gray-700 dark:text-gray-400">Work together with your team in real-time.</p>
            </div>  
          </div>
              
          {/* Feature 2 */}
          <div className="feature bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
            <div className="feature-icon bg-yellow-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <i className="fas fa-lightbulb text-2xl"></i>
            </div>
            <div className="feature-text">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Innovate</h3>
              <p className="text-gray-700 dark:text-gray-400">Explore new ideas and turn them into reality.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="feature bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
            <div className="feature-icon bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <i className="fas fa-cogs text-2xl"></i>
            </div>
            <div className="feature-text">
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Customize</h3>
              <p className="text-gray-700 dark:text-gray-400">Adapt the platform to fit your workflow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
