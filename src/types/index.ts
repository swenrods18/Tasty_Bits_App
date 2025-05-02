export interface User {
  username: string;
  password: string;
  role: 'customer' | 'chef';
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
}

export interface OrderItem {
  menuItemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: number;
  customerId: string;
  items: OrderItem[];
  status: 'received' | 'preparing' | 'completed';
  total: number;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}