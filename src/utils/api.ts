import axios from 'axios';
import { User, MenuItem, Order } from '../types';

const API_URL = 'http://localhost:5137';

// Authentication
export const loginUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

// Menu
export const getMenu = async (): Promise<MenuItem[]> => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    return response.data;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return [];
  }
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await axios.get(`${API_URL}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const placeOrder = async (order: Omit<Order, 'id' | 'status' | 'createdAt'>): Promise<Order | null> => {
  try {
    const response = await axios.post(`${API_URL}/orders`, order);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: number, status: Order['status']): Promise<Order | null> => {
  try {
    const response = await axios.put(`${API_URL}/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    return null;
  }
};