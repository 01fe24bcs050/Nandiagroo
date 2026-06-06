# 🗺️ NandiAgro User Journey Map

## Complete User Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    NANDIAGRO USER JOURNEY                   │
└─────────────────────────────────────────────────────────────┘

START
  ↓
┌──────────────────────────────────────┐
│    LANDING PAGE (/)                  │
│  • Hero Section                      │
│  • Features Overview                 │
│  • Featured Products (6)             │
│  • Call to Action                    │
└──────────────────────────────────────┘
  ↓
  ├─→ [Click "Start Shopping"]
  │
  ├─→ [Login/Register]
  │    ↓
  │   ┌──────────────────────────────┐
  │   │  AUTH MODAL                  │
  │   │  • Enter Email               │
  │   │  • Enter Password            │
  │   │  • Register/Login            │
  │   └──────────────────────────────┘
  │    ↓
  │   ✅ Token Stored in localStorage
  │   ✅ User Logged In
  │
  └─→ SHOP PAGE (/shop)
     ↓
     ┌──────────────────────────────┐
     │  SHOP PAGE WITH FILTERS      │
     │  • Search Bar                │
     │  • Category Filter           │
     │  • Price Range Filter        │
     │  • Brand Filter              │
     │  • Product Grid              │
     └──────────────────────────────┘
     ↓
     ├─→ [Click Product Card]
     │    ↓
     │   ┌──────────────────────────────┐
     │   │ PRODUCT DETAIL PAGE          │
     │   │ • Full Product Image         │
     │   │ • Description                │
     │   │ • Price & Stock              │
     │   │ • Quantity Selector          │
     │   │ • [Add to Cart Button]       │
     │   └──────────────────────────────┘
     │    ↓
     │   ✅ Product Added to Cart
     │   ✅ Cart Count Updated
     │
     ├─→ [Click Cart Icon]
     │    ↓
     │   ┌──────────────────────────────┐
     │   │  CART PAGE (/cart)           │
     │   │  • Cart Items List           │
     │   │  • Quantity Adjustment       │
     │   │  • Remove Items              │
     │   │  • Cart Summary              │
     │   │    - Subtotal                │
     │   │    - Shipping                │
     │   │    - Tax                     │
     │   │    - Total                   │
     │   │  • [Proceed to Checkout]     │
     │   └──────────────────────────────┘
     │    ↓
     │   [Continue Shopping?]
     │   ├─→ YES: Back to /shop
     │   │
     │   └─→ NO: Proceed to Checkout
     │
     └─→ CHECKOUT PAGE (/checkout)
        ↓
        ┌──────────────────────────────┐
        │ CHECKOUT PAGE                │
        │ • Shipping Address Form      │
        │   - Street Address           │
        │   - City                     │
        │   - State                    │
        │   - Postal Code              │
        │   - Phone Number             │
        │ • Order Items Review         │
        │ • Payment Method (COD)       │
        │ • Order Summary              │
        │ • [Place Order Button]       │
        └──────────────────────────────┘
        ↓
        ✅ Order Created
        ✅ Cart Cleared
        ✅ Order ID Generated
        ↓
        ┌──────────────────────────────┐
        │ ORDER CONFIRMATION           │
        │ • Success Message            │
        │ • Order Details              │
        │ • Redirect to Profile        │
        └──────────────────────────────┘
        ↓
        PROFILE PAGE (/profile)
        ↓
        ┌──────────────────────────────┐
        │ PROFILE PAGE                 │
        │ • User Information           │
        │   - Name                     │
        │   - Email                    │
        │   - Member Since             │
        │ • Order History              │
        │   - Order ID                 │
        │   - Order Date               │
        │   - Items Count              │
        │   - Total Price              │
        │   - Order Status             │
        │   - Shipping Address         │
        │ • [Logout Button]            │
        └──────────────────────────────┘
        ↓
        [Continue Shopping?]
        ├─→ YES: Go to /shop
        │
        └─→ NO / [Logout]
           ↓
           Back to LANDING PAGE
           ✅ Session Ended
```

---

## 📱 Page Breakdown

### 1️⃣ Landing Page (/)
**Purpose**: First impression & conversion
```
┌─────────────────────────┐
│   NAVBAR (Sticky)       │ 🏠 Logo | Home | Shop | 🛒 Cart | 👤 Login
├─────────────────────────┤
│   HERO SECTION          │ "Grow Better With NandiAgro"
├─────────────────────────┤
│   FEATURES (4 cols)     │ Organic | Quality | Support | Delivery
├─────────────────────────┤
│   FEATURED PRODUCTS     │ 6 Product Cards
│   (Grid 3 cols)         │
├─────────────────────────┤
│   CTA SECTION           │ "Ready to Grow Better?" + Shop Now
├─────────────────────────┤
│   FOOTER                │ Links | Social | Contact
└─────────────────────────┘
```

### 2️⃣ Shop Page (/shop)
**Purpose**: Browse & filter products
```
┌──────────────┬──────────────────┐
│  FILTERS     │  PRODUCT GRID    │
│  (Sidebar)   │  (Responsive)    │
│              │                  │
│ • Search     │  [Card] [Card]   │
│ • Category   │  [Card] [Card]   │
│ • Brand      │  [Card] [Card]   │
│ • Price      │  [Card] [Card]   │
│ • Reset      │  ...             │
│              │                  │
└──────────────┴──────────────────┘
```

### 3️⃣ Product Detail Page (/product/:id)
**Purpose**: View full product info
```
┌─────────────────────────┐
│  ← Back to Shop         │
├─────────────────────────┤
│  [Image]  │  Details    │
│           │  • Name     │
│           │  • Brand    │
│           │  • Rating   │
│           │  • Price    │
│           │  • Stock    │
│           │  • Desc     │
│           │  • Qty ±    │
│           │  [Add Cart] │
└─────────────────────────┘
```

### 4️⃣ Cart Page (/cart)
**Purpose**: Review & adjust cart
```
┌────────────────────────────┐
│  CART ITEMS                │
│  ┌──────────────────────┐  │
│  │[Img]  Name     Qty  $│  │
│  │       Subtotal   x   │  │
│  └──────────────────────┘  │
├────────────────────────────┤
│  SUMMARY         │ TOTAL   │
│  Subtotal:  $    │  $$$$$  │
│  Shipping:  FREE │ CHECKOUT│
│  Tax: $          │         │
└────────────────────────────┘
```

### 5️⃣ Checkout Page (/checkout)
**Purpose**: Complete order
```
┌─────────────────────────────┐
│  SHIPPING ADDRESS FORM      │
│  • Address                  │
│  • City, State, Postal      │
│  • Phone                    │
├─────────────────────────────┤
│  ORDER ITEMS REVIEW         │
├─────────────────────────────┤
│  PAYMENT METHOD             │
│  ○ Cash on Delivery         │
├─────────────────────────────┤
│  ORDER SUMMARY    [PLACE]   │
│  • Subtotal:  $   [ORDER]   │
│  • Shipping:  $             │
│  • Tax:       $             │
│  • TOTAL:    $$             │
└─────────────────────────────┘
```

### 6️⃣ Profile Page (/profile)
**Purpose**: Account & order history
```
┌─────────────────────────┐
│  USER PROFILE CARD      │
│  👤 Name                │
│  ✉️ Email              │
│  [LOGOUT]               │
├─────────────────────────┤
│  ACCOUNT INFORMATION    │
│  • Name: ...            │
│  • Email: ...           │
│  • Member Since: ...    │
├─────────────────────────┤
│  ORDER HISTORY          │
│  ┌───────────────────┐  │
│  │ ID │ Date │ Items │  │
│  │ $$ │ PENDING      │  │
│  └───────────────────┘  │
│  (Repeat for all orders)│
└─────────────────────────┘
```

---

## 🔄 State Flow

```
User State (AuthContext)
    ↓
├─ isAuthenticated: Boolean
├─ user: {name, email, _id}
├─ token: JWT (stored in localStorage)
└─ Methods: login(), register(), logout()

Cart State (CartContext)
    ↓
├─ items: Product[]
│   └─ Each: {_id, name, price, quantity, imageURL, ...}
├─ Methods: addToCart(), removeFromCart(), updateQuantity()
├─ Computed: getTotalItems(), getTotalPrice()
└─ Persisted: localStorage

Local State (Component Level)
    ↓
├─ Loading states
├─ Form inputs
├─ Modal visibility
└─ Filter selections
```

---

## 🛒 Shopping Cart Lifecycle

```
EMPTY CART
    ↓
Add Product
    ↓
[CART HAS ITEMS]
├─ Update quantity (same product)
├─ Add another product
├─ Remove product
│    ↓
│   [Check if empty]
│   ├─ YES → EMPTY CART
│   └─ NO → [CART HAS ITEMS]
│
└─ Proceed to Checkout
    ↓
[CHECKOUT]
├─ Fill shipping address
├─ Select payment
├─ Place order
    ↓
[ORDER CONFIRMATION]
├─ Show success message
├─ Clear cart
├─ Save order to database
    ↓
EMPTY CART (restart cycle)
```

---

## 🔐 Authentication Flow

```
UNAUTHENTICATED
    ↓
Click "Login"
    ↓
[AUTH MODAL]
├─ Toggle: Login ↔ Register
│
├─ LOGIN MODE:
│  ├─ Enter Email
│  ├─ Enter Password
│  └─ [Login]
│       ↓
│      API Call: POST /api/auth/login
│       ↓
│      Response: {token, user, email}
│       ↓
│      Store token in localStorage
│       ↓
│      Dispatch LOGIN action
│
└─ REGISTER MODE:
   ├─ Enter Name
   ├─ Enter Email
   ├─ Enter Password
   └─ [Register]
        ↓
       API Call: POST /api/auth/register
        ↓
       Response: {token, user}
        ↓
       Store token in localStorage
        ↓
       Dispatch LOGIN action
           ↓
AUTHENTICATED
├─ Token available in AuthContext
├─ Protected routes accessible
├─ Can create orders
└─ Can view profile

LOGOUT
    ↓
[Click Logout]
├─ Remove token from localStorage
├─ Dispatch LOGOUT action
└─ Redirect to home
    ↓
UNAUTHENTICATED (cycle complete)
```

---

## 🌐 Component Hierarchy

```
App
├── AuthProvider (Wraps entire app)
│   └── CartProvider (Wraps entire app)
│       ├── Navbar
│       │   ├── Logo/Brand
│       │   ├── Menu Links
│       │   ├── Cart Icon
│       │   └── Auth Toggle
│       │       └── AuthModal
│       │           └── Form
│       │
│       ├── Router
│       │   ├── Landing
│       │   │   ├── Hero
│       │   │   ├── Features
│       │   │   └── ProductCard[]
│       │   │
│       │   ├── Shop
│       │   │   ├── Filters
│       │   │   └── ProductCard[]
│       │   │
│       │   ├── ProductDetail
│       │   │   ├── Image
│       │   │   ├── Details
│       │   │   └── AddToCart Form
│       │   │
│       │   ├── Cart
│       │   │   ├── CartItems[]
│       │   │   └── OrderSummary
│       │   │
│       │   ├── Checkout
│       │   │   ├── ShippingForm
│       │   │   ├── OrderReview
│       │   │   └── OrderSummary
│       │   │
│       │   └── Profile
│       │       ├── UserCard
│       │       └── OrderHistory[]
│       │
│       └── Footer
│           ├── Links
│           ├── Contact
│           └── Social
```

---

## 📊 Data Flow

```
User Action
    ↓
Component State Update / API Call
    ↓
[If Auth Required]
├─ Check token in localStorage
├─ Include token in Authorization header
└─ API validates JWT
    ↓
Backend Processes Request
├─ Validate input
├─ Query/Update database
└─ Return response
    ↓
Frontend Receives Response
├─ Update component state
├─ Update Context (Auth/Cart)
├─ Update localStorage if needed
└─ Re-render UI
    ↓
User Sees Result
```

---

## 🎯 Key User Interactions

| Action | Flow |
|--------|------|
| Register | Register Form → API → Store Token → Login |
| Login | Login Form → API → Store Token → Redirect |
| Browse | Shop Page → Filter/Search → View Products |
| View Product | Click Card → ProductDetail Page → Read Info |
| Add to Cart | Click Button → Update CartContext → Show Toast |
| View Cart | Click Cart Icon → CartPage → See Summary |
| Checkout | Fill Address → Create Order → Success |
| View Orders | Profile Page → See Order History |
| Logout | Click Logout → Clear Token → Redirect |

---

## ✨ User Experience Features

### Feedback
- ✅ Loading spinners during API calls
- ✅ Success notifications
- ✅ Error messages
- ✅ Form validation

### Navigation
- ✅ Intuitive menu structure
- ✅ Breadcrumb navigation
- ✅ Clear CTAs
- ✅ Mobile-friendly navigation

### Accessibility
- ✅ Semantic HTML
- ✅ ARIA labels (basic)
- ✅ Keyboard navigation
- ✅ Readable text contrast

### Performance
- ✅ Fast page loads
- ✅ Smooth animations
- ✅ Responsive interactions
- ✅ Optimized images

---

**This journey map covers the complete user experience from landing to order completion!**
