import express from 'express';
import cors from 'cors';
import { users, menu, orders } from './data/index.js';

const app = express();
const PORT = 5137;

// Middleware
app.use(cors());
app.use(express.json());

// Auth Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => 
    u.username === username && u.password === password
  );
  
  if (user) {
    // Don't send password to client
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Menu Route
app.get('/menu', (req, res) => {
  res.json(menu);
});

// Orders Routes
app.get('/orders', (req, res) => {
  // Sort orders by creation time (newest first)
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sortedOrders);
});

app.post('/orders', (req, res) => {
  const { customerId, items, total } = req.body;
  
  if (!customerId || !items || !total) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  // Generate order ID
  const id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
  
  const newOrder = {
    id,
    customerId,
    items,
    status: 'received',
    total,
    createdAt: new Date().toISOString()
  };
  
  orders.push(newOrder);
  res.status(201).json(newOrder);
});

app.put('/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const orderIndex = orders.findIndex(o => o.id === parseInt(id));
  
  if (orderIndex === -1) {
    return res.status(404).json({ message: 'Order not found' });
  }
  
  if (!['received', 'preparing', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    status
  };
  
  res.json(orders[orderIndex]);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});