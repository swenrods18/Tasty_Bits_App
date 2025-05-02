import React, { useState, useEffect } from 'react';
import { getOrders, updateOrderStatus } from '../../utils/api';
import { Order } from '../../types';
import { Clock, CheckCircle2 } from 'lucide-react';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up polling to refresh orders every 30 seconds
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus } 
          : order
      ));
    } catch (err) {
      setError('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    switch (currentStatus) {
      case 'received':
        return 'preparing';
      case 'preparing':
        return 'completed';
      case 'completed':
        return null; // No next status
      default:
        return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  const activeOrders = orders.filter(order => order.status !== 'completed');
  const completedOrders = orders.filter(order => order.status === 'completed');

  return (
    <div className="order-list-container">
      <h2>Active Orders</h2>
      
      {activeOrders.length === 0 ? (
        <div className="no-orders">
          <CheckCircle2 size={48} />
          <p>No active orders at the moment</p>
        </div>
      ) : (
        <div className="orders">
          {activeOrders.map((order) => {
            const nextStatus = getNextStatus(order.status);
            return (
              <div key={order.id} className={`order-card status-${order.status}`}>
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <div className="order-time">
                    <Clock size={16} />
                    <span>{formatTime(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-status">
                  Status: <span className={`status-badge ${order.status}`}>{order.status}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    Total: <span>${order.total.toFixed(2)}</span>
                  </div>
                  {nextStatus && (
                    <button 
                      onClick={() => handleUpdateStatus(order.id, nextStatus)}
                      className="btn-update-status"
                      disabled={updatingOrderId === order.id}
                    >
                      {updatingOrderId === order.id ? 'Updating...' : `Mark as ${nextStatus}`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {completedOrders.length > 0 && (
        <>
          <h2 className="completed-header">Completed Orders</h2>
          <div className="orders completed">
            {completedOrders.map((order) => (
              <div key={order.id} className="order-card status-completed">
                <div className="order-header">
                  <h3>Order #{order.id}</h3>
                  <div className="order-time">
                    <Clock size={16} />
                    <span>{formatTime(order.createdAt)}</span>
                  </div>
                </div>
                <div className="order-status">
                  Status: <span className="status-badge completed">{order.status}</span>
                </div>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-footer">
                  <div className="order-total">
                    Total: <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderList;