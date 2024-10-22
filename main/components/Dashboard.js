import React from 'react';
import QuizCategories from './QuizCategories';

const Dashboard = () => {
  return (
    
    <div className="dashboard-background">
      <h2 className="dashboard-title">Welcome to PathGen</h2>
      <p className="dashboard-intro">
        Manage your quizzes and learning paths here. Select a category to get started!
      </p>

     

      {/* Overview Section */}
      <div className="overview-section">
        <h3>About PathGen</h3>
        <p>
          PathGen is a personalized learning path generator that helps students navigate their educational journeys.
          We provide tailored quizzes and resources based on your interests and goals.
        </p>
      </div>

      {/* Quiz Categories Section */}
      <QuizCategories />
    </div> 
    
  ); 
};

export default Dashboard;
