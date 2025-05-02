import React from 'react';
import Navbar from '../components/common/Navbar';
import OrderList from '../components/Chef/OrderList';

const ChefDashboard: React.FC = () => {
  return (
    <div className="dashboard chef-dashboard">
      <Navbar />
      <div className="dashboard-content">
        <OrderList />
      </div>
    </div>
  );
};

export default ChefDashboard;