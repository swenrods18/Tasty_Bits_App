import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../../types';

interface OrderStatusProps {
  order: Order;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ order }) => {
  const getStatusIcon = () => {
    switch (order.status) {
      case 'preparing':
        return <Clock className="status-icon preparing" />;
      case 'completed':
        return <CheckCircle className="status-icon completed" />;
      case 'cancelled':
        return <XCircle className="status-icon cancelled" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (order.status) {
      case 'preparing':
        return 'Your order is being prepared';
      case 'completed':
        return 'Your order is ready!';
      case 'cancelled':
        return 'Order cancelled';
      default:
        return 'Order received';
    }
  };

  return (
    <div className="order-status">
      {getStatusIcon()}
      <div className="status-details">
        <h3>Order #{order.id}</h3>
        <p className="status-text">{getStatusText()}</p>
        <p className="status-time">Ordered at: {new Date(order.createdAt).toLocaleTimeString()}</p>
      </div>
    </div>
  );
};

export default OrderStatus; 