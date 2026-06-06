# NandiAgro - Premium Agricultural E-commerce Platform

A complete MERN stack e-commerce web application designed specifically for agricultural products. Built with modern technologies and best practices.

## 🎯 Project Overview

NandiAgro is a full-stack MERN application that connects farmers and agricultural enthusiasts with premium products ranging from seeds and fertilizers to tools and irrigation systems.

### Key Features

✅ **Authentication System**
- JWT-based Login/Signup
- Modal popup authentication
- Secure token storage in localStorage
- User session management

✅ **Product Management**
- Advanced filtering (Category, Price, Brand)
- Search functionality
- Product details page
- Real-time inventory tracking

✅ **Shopping Cart**
- Add/remove products
- Quantity management
- Cart persistence with localStorage
- Real-time cart updates

✅ **Order Management**
- Secure checkout process
- Order history tracking
- Order status management
- Shipping address storage

✅ **Premium UI/UX**
- Glassmorphism design system
- Dark green theme with golden accents
- Smooth animations with Framer Motion
- Mobile-first responsive design
- Premium rounded cards

## 🏗️ Project Structure

```
NandiAgro/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── cartController.js   # Cart management
│   │   ├── orderController.js  # Order processing
│   │   └── productController.js # Product CRUD
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   └── errorHandler.js     # Global error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── server.js
│   ├── seed.js                 # Sample data seeding
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── AuthModal.jsx
    │   │   └── ProductCard.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── pages/
    │   │   ├── Landing.jsx
    │   │   ├── Shop.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   └── Profile.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Design System
- **Theme**: Dark Green (#14532d), Light Green (#dcfce7), Golden (#fbbf24)
- **UI Style**: Glassmorphism with premium rounded cards
- **Animations**: Smooth transitions with Framer Motion
- **Responsive**: Mobile-first approach

## 📋 API Endpoints

### Authentication
```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login
GET    /api/auth/profile       - Get user profile (protected)
```

### Products
```
GET    /api/products           - Get all products (with filters)
GET    /api/products/:id       - Get product details
POST   /api/products           - Create product (admin only)
PUT    /api/products/:id       - Update product (admin only)
DELETE /api/products/:id       - Delete product (admin only)
```

### Cart
```
GET    /api/cart               - Get user cart (protected)
POST   /api/cart/add           - Add item to cart (protected)
PUT    /api/cart/update        - Update cart item (protected)
DELETE /api/cart/remove/:id    - Remove item from cart (protected)
DELETE /api/cart/clear         - Clear cart (protected)
```

### Orders
```
POST   /api/orders             - Create order (protected)
GET    /api/orders/myorders    - Get user orders (protected)
GET    /api/orders/:id         - Get order details (protected)
GET    /api/orders             - Get all orders (admin only)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nandiagro
   JWT_SECRET=your_secure_jwt_secret_key_here
   NODE_ENV=development
   ```

   **For MongoDB Atlas**, use:
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nandiagro
   ```

5. **Seed database with sample products**
   ```bash
   npm run seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

   Backend will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   Frontend will run at `http://localhost:3000`

## 📦 Sample Product Categories

The database is seeded with agricultural products in the following categories:
- **Seeds** - High-quality crop seeds
- **Fertilizers** - Organic and chemical fertilizers
- **Tools** - Farming and gardening tools
- **Pesticides** - Crop protection products
- **Irrigation** - Water management systems
- **Other** - Miscellaneous products

## 🔐 Authentication Flow

1. User registers/logs in via AuthModal
2. JWT token received and stored in localStorage
3. Token used for authenticated API requests
4. User data stored in AuthContext for app-wide access
5. Logout clears token and resets authentication state

## 🛒 Shopping Flow

1. Browse products on Shop page with advanced filters
2. Click on product to view details
3. Add items to cart with quantity selection
4. View cart summary and proceed to checkout
5. Enter shipping address for delivery
6. Place order (COD - Cash on Delivery)
7. Track order from Profile page

## 💅 Styling & Theming

### Custom Tailwind Classes

The project uses custom Tailwind configuration with:
- `darkGreen`: Primary dark color (#14532d)
- `lightGreen`: Secondary light color (#dcfce7)
- `golden`: Accent color (#fbbf24)

### CSS Features

- **Glassmorphism Effect** (`.glass-effect`)
  - Backdrop blur and transparency
  - Perfect for navbar and modals

- **Premium Cards** (`.card-premium`)
  - Rounded corners (20px)
  - Glass effect background
  - Smooth hover animations
  - Elevation on hover

## 🔧 Development

### Running Both Servers Simultaneously

**Option 1: Two Terminal Windows**
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

**Option 2: Using Concurrently (from root)**
```bash
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```

### Building for Production

**Backend**
```bash
npm start
```

**Frontend**
```bash
npm run build
npm run preview
```

## 🧪 Testing the Application

### Test User Account (after seeding)
The seed script creates sample data but doesn't create test users by default. Create your own:
- Email: `test@example.com`
- Password: Any secure password

### Sample Products
The database is seeded with 12+ agricultural products across all categories.

## 📝 Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  name: String,
  brand: String,
  category: String,
  price: Number,
  quantity: Number,
  description: String,
  imageURL: String,
  rating: Number,
  numReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  shippingAddress: String,
  phone: String,
  totalPrice: Number,
  shippingPrice: Number,
  taxPrice: Number,
  status: String (pending/processing/shipped/delivered),
  createdAt: Date
}
```

## 🎨 UI Components

### Navbar
- Glassmorphism effect
- Sticky positioning
- Cart item counter
- Mobile-responsive menu
- Authentication toggle

### AuthModal
- Login/Register toggle
- Form validation
- Error handling
- Smooth animations

### ProductCard
- Image with hover zoom
- Category badge
- Star rating display
- Price and stock status
- Quick add to cart

### Footer
- Company information
- Quick links
- Social media links
- Contact information

## 🚨 Error Handling

The application includes comprehensive error handling:
- Frontend: Try-catch blocks with user-friendly messages
- Backend: Express error middleware
- Validation: Express-validator for input validation
- Auth: JWT verification with proper error responses

## 📱 Responsive Design

The application is fully responsive across:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 🖥️ Desktops (1024px+)

Key responsive features:
- Mobile menu in navbar
- Collapsible filters on Shop page
- Grid layout adjustments
- Touch-friendly buttons

## 🔄 State Management

### Frontend State
- **AuthContext**: User authentication and profile
- **CartContext**: Shopping cart items and operations
- **Local State**: Component-specific state with React hooks
- **localStorage**: Persistence of token and cart

## 🌐 API Integration

All API calls use the fetch API configured in `services/api.js`:
- Base URL: `http://localhost:5000/api`
- Automatic error handling
- JWT token injection in headers
- Response JSON parsing

## 📖 Environment Variables

### Backend (.env)
```
PORT                 - Server port (default: 5000)
MONGODB_URI         - MongoDB connection string
JWT_SECRET          - JWT signing secret
NODE_ENV            - Environment (development/production)
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify network access if using Atlas

### CORS Error
- Check backend CORS configuration
- Verify frontend API URL
- Ensure both servers are running

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Seed Script Issues
- Ensure MongoDB is connected
- Clear existing data if conflicts
- Check seed.js for correct product format

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs (browser and terminal)
3. Verify all environment variables
4. Ensure MongoDB is running and accessible

## 📄 License

ISC License - Feel free to use this project for personal or commercial purposes.

## 🎉 Success!

Your NandiAgro e-commerce platform is now ready. Start the backend and frontend servers and begin exploring the application at `http://localhost:3000`!

Happy coding! 🚀
