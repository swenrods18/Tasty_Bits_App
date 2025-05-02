import React, { useState, useEffect } from 'react';
import { getMenu } from '../../utils/api';
import { MenuItem, OrderItem } from '../../types';
import { PlusCircle, MinusCircle, ShoppingCart } from 'lucide-react';

interface MenuProps {
  onAddToOrder: (item: OrderItem) => void;
  orderItems: OrderItem[];
}

const Menu: React.FC<MenuProps> = ({ onAddToOrder, orderItems }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await getMenu();
        setMenuItems(data);
      } catch (err) {
        setError('Failed to load menu items');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const getItemQuantity = (id: number) => {
    const item = orderItems.find(item => item.menuItemId === id);
    return item ? item.quantity : 0;
  };

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem) {
      onAddToOrder({
        ...existingItem,
        quantity: existingItem.quantity + 1
      });
    } else {
      onAddToOrder({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1
      });
    }
  };

  const handleRemoveItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id);
    
    if (existingItem && existingItem.quantity > 1) {
      onAddToOrder({
        ...existingItem,
        quantity: existingItem.quantity - 1
      });
    } else if (existingItem && existingItem.quantity === 1) {
      // Remove item completely
      const updatedItems = orderItems.filter(item => item.menuItemId !== menuItem.id);
      // This will require modifying the parent component to handle item removal
      onAddToOrder({
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 0
      });
    }
  };

  if (isLoading) return <div className="loading">Loading menu...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="menu-container">
      <h2>Our Menu</h2>
      <div className="menu-items">
        {menuItems.map((item) => {
          const quantity = getItemQuantity(item.id);
          return (
            <div key={item.id} className="menu-item">
              <div className="menu-item-image">
                <img src={item.image || `https://via.placeholder.com/150?text=${item.name}`} alt={item.name} />
              </div>
              <div className="menu-item-content">
                <h3>{item.name}</h3>
                <p className="menu-item-description">{item.description || 'Delicious food item'}</p>
                <div className="menu-item-footer">
                  <span className="menu-item-price">${item.price.toFixed(2)}</span>
                  <div className="menu-item-actions">
                    {quantity > 0 && (
                      <>
                        <button onClick={() => handleRemoveItem(item)} className="btn-circle">
                          <MinusCircle size={20} />
                        </button>
                        <span className="item-quantity">{quantity}</span>
                      </>
                    )}
                    <button onClick={() => handleAddItem(item)} className="btn-circle">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
                {quantity > 0 && (
                  <div className="menu-item-cart">
                    <ShoppingCart size={16} />
                    <span>{quantity} in cart</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;