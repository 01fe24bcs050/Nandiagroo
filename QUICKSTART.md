# 🚀 NandiAgro Quick Start Guide

Get your MERN e-commerce application up and running in 5 minutes!

## ⚡ Quick Setup

### Step 1: Backend Setup (2 minutes)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env
```

**If using local MongoDB:**
- Ensure MongoDB is running
- .env is already configured correctly

**If using MongoDB Atlas:**
- Update MONGODB_URI in .env:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nandiagro
```

```bash
# Seed database with sample products
npm run seed

# Start backend server
npm run dev
```

✅ Backend running at `http://localhost:5000`

### Step 2: Frontend Setup (2 minutes)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at `http://localhost:3000`

### Step 3: Test the Application (1 minute)

1. Open `http://localhost:3000` in your browser
2. Click "Login" in the navbar
3. Click "Register" to create a new account
4. Enter your details and register
5. Browse products on the Shop page
6. Add items to cart
7. Proceed to checkout

## 📦 What's Included

### Backend Features
✅ JWT Authentication (Login/Register)
✅ Product CRUD operations
✅ Advanced product filtering
✅ Shopping cart management
✅ Order processing
✅ User profile management
✅ Sample data (12+ agricultural products)

### Frontend Features
✅ Responsive design (Mobile-first)
✅ Glassmorphism UI design
✅ Dark Green/Light Green/Golden theme
✅ Authentication modal
✅ Product filtering and search
✅ Shopping cart with persistence
✅ Order checkout flow
✅ User profile with order history
✅ Smooth animations with Framer Motion

## 🎯 Key Pages & Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page with hero and featured products |
| `/shop` | Product listing with advanced filters |
| `/product/:id` | Product detail page |
| `/cart` | Shopping cart management |
| `/checkout` | Order checkout process |
| `/profile` | User profile and order history |

## 🔐 Authentication

After seeding, create your test account:
1. Click "Login" → "Register"
2. Enter any email and password
3. Create account and start shopping

**Default admin account:** (if needed)
- Email: `admin@nandiagro.com`
- Password: `Admin@123` (customize in seed.js)

## 🛒 Shopping Experience

```
Landing Page
    ↓
Browse/Search Products (Shop)
    ↓
View Product Details
    ↓
Add to Cart
    ↓
Manage Cart Items
    ↓
Proceed to Checkout
    ↓
Enter Shipping Address
    ↓
Place Order (COD)
    ↓
View Order in Profile
```

## 🎨 Customization

### Change Theme Colors

Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      darkGreen: '#14532d',    // Primary
      lightGreen: '#dcfce7',   // Secondary
      golden: '#fbbf24',       // Accent
    },
  },
}
```

### Change Product Categories

Edit `frontend/src/pages/Shop.jsx`:
```javascript
const CATEGORIES = ['Seeds', 'Fertilizers', 'Tools', 'Pesticides', 'Irrigation', 'Other'];
```

### Add More Sample Products

Edit `backend/seed.js` and add products to the `products` array, then run:
```bash
npm run seed
```

## 📊 Sample Products Included

The database is seeded with agricultural products:
- 🌾 Seeds (High-quality crop seeds)
- 🧪 Fertilizers (Organic & chemical)
- 🔧 Tools (Farming equipment)
- 🦟 Pesticides (Crop protection)
- 💧 Irrigation (Water systems)

## 🔧 Useful Commands

### Backend
```bash
npm run dev      # Start dev server with nodemon
npm run seed     # Seed database with sample products
npm start        # Start production server
```

### Frontend
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

### Can't connect to MongoDB?
```bash
# Ensure MongoDB is running
# For Windows: Check Services or use MongoDB Compass
# For Mac: brew services start mongodb-community
```

### Port 5000 or 3000 already in use?
```bash
# Kill process on port
lsof -ti:5000 | xargs kill -9  # Port 5000
lsof -ti:3000 | xargs kill -9  # Port 3000
```

### CORS errors?
- Ensure backend is running on 5000
- Ensure frontend is running on 3000
- Check API URL in `frontend/src/services/api.js`

### Not seeing seeded products?
```bash
# Reseed the database
cd backend
npm run seed
```

## 📈 Performance Tips

1. **Optimize Images**: Use compressed images for products
2. **Enable Caching**: Configure browser caching headers
3. **Database Indexing**: Add indexes to frequently queried fields
4. **Production Build**: Use `npm run build` for optimized frontend

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
```bash
# Ensure Node.js version is specified
# Push .env variables to platform
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

## 📚 Project Structure

```
NandiAgro/
├── backend/
│   ├── controllers/    # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth, error handling
│   └── server.js       # Express app
│
└── frontend/
    ├── pages/          # Route components
    ├── components/     # Reusable UI components
    ├── context/        # React Context (Auth, Cart)
    └── services/       # API integration
```

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

## ✨ Features Breakdown

### Authentication
- JWT token-based
- localStorage persistence
- Modal popup interface
- Session management

### Products
- Advanced filtering (category, price, brand)
- Search functionality
- Real-time inventory
- Product details page

### Cart & Orders
- Add/remove items
- Quantity management
- Cart persistence
- Checkout flow
- Order history

### UI/UX
- Glassmorphism design
- Dark mode optimized
- Mobile responsive
- Smooth animations
- Premium styling

## 🎉 You're All Set!

Your MERN e-commerce platform is ready to go!

**Next Steps:**
1. Explore the application
2. Create your first order
3. Customize the design and content
4. Deploy to production

**Happy Farming! 🌾**

admin emailid : admin@nandiagro.com
Admin Password : admin123
