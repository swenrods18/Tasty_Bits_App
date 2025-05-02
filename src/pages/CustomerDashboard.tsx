import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Menu from '../components/Customer/Menu';
import OrderSummary from '../components/Customer/OrderSummary';
import OrderStatus from '../components/Customer/OrderStatus';
import { OrderItem, Order } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { placeOrder, getOrders } from '../utils/api';
import { CheckCircle } from 'lucide-react';
import '../styles/OrderStatus.css';

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [currentOrders, setCurrentOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const orders = await getOrders();
          const userOrders = orders.filter(order => order.customerId === user.username);
          setCurrentOrders(userOrders);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [user]);

  const handleAddToOrder = (item: OrderItem) => {
    if (item.quantity === 0) {
      // Remove the item
      setOrderItems(orderItems.filter(i => i.menuItemId !== item.menuItemId));
    } else {
      // Check if item already exists
      const existingItemIndex = orderItems.findIndex(i => i.menuItemId === item.menuItemId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...orderItems];
        updatedItems[existingItemIndex] = item;
        setOrderItems(updatedItems);
      } else {
        // Add new item
        setOrderItems([...orderItems, item]);
      }
    }
  };

  const handlePlaceOrder = async () => {
    if (!user || orderItems.length === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const order: Omit<Order, 'id' | 'status' | 'createdAt'> = {
        customerId: user.username,
        items: orderItems,
        total: orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
      
      const result = await placeOrder(order);
      
      if (result) {
        setOrderSuccess(true);
        setOrderNumber(result.id);
        setOrderItems([]);
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setOrderSuccess(false);
          setOrderNumber(null);
        }, 5000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dashboard customer-dashboard">
      <Navbar />
      
      <div className="dashboard-content">
        {orderSuccess && (
          <div className="order-success">
            <CheckCircle size={48} />
            <h2>Order Placed Successfully!</h2>
            <p>Your order #{orderNumber} has been received and is being processed.</p>
          </div>
        )}

        {currentOrders.length > 0 && (
          <div className="current-orders">
            <h2>Your Orders</h2>
            {currentOrders.map(order => (
              <OrderStatus key={order.id} order={order} />
            ))}
          </div>
        )}
        
        <div className="dashboard-grid">
          <div className="menu-section">
            <Menu 
              onAddToOrder={handleAddToOrder} 
              orderItems={orderItems} 
            />
          </div>
          <div className="order-section">
            <OrderSummary 
              orderItems={orderItems}
              onUpdateQuantity={handleAddToOrder}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;