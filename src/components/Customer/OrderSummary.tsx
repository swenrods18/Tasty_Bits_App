import React from 'react';
import { OrderItem } from '../../types';
import { ShoppingBag, Trash2 } from 'lucide-react';

interface OrderSummaryProps {
  orderItems: OrderItem[];
  onUpdateQuantity: (item: OrderItem) => void;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  orderItems, 
  onUpdateQuantity, 
  onPlaceOrder,
  isSubmitting
}) => {
  if (orderItems.length === 0) {
    return (
      <div className="order-empty">
        <ShoppingBag size={48} />
        <p>Your order is empty</p>
        <p className="order-empty-hint">Add some items from the menu to get started!</p>
      </div>
    );
  }
  
  const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleRemoveItem = (item: OrderItem) => {
    onUpdateQuantity({
      ...item,
      quantity: 0 // Setting quantity to 0 to indicate removal
    });
  };

  return (
    <div className="order-summary">
      <h2>Your Order</h2>
      <div className="order-items">
        {orderItems.map((item) => (
          <div key={item.menuItemId} className="order-item">
            <div className="order-item-details">
              <span className="order-item-name">{item.name}</span>
              <span className="order-item-quantity">x{item.quantity}</span>
            </div>
            <div className="order-item-actions">
              <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
              <button 
                onClick={() => handleRemoveItem(item)} 
                className="btn-remove"
                aria-label="Remove item"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="order-total">
        <span>Total Amount:</span>
        <span className="total-amount">${totalAmount.toFixed(2)}</span>
      </div>
      <button 
        onClick={onPlaceOrder} 
        className="btn-order" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
};

export default OrderSummary;