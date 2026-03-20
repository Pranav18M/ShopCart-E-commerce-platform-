# ShopKart — Full-Stack E-Commerce Platform

![ShopKart Banner](https://via.placeholder.com/1200x300/2874f0/ffffff?text=ShopKart+E-Commerce+Platform)

A production-grade, full-stack e-commerce web application built with **React.js** (frontend) and **Spring Boot** (backend), featuring JWT authentication, role-based access control, a multi-tier seller system, and manual payment verification workflow.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Setup](#environment-setup)
- [API Reference](#api-reference)
- [Payment Flow](#payment-flow)
- [Role System](#role-system)
- [Screenshots](#screenshots)
- [Deployment](#deployment)

---

## Features

### 🛍️ Shopping
- Product listing with search, filter (category, price range), and sort
- Product detail page with image gallery, quantity selector
- Shopping cart with real-time updates
- Multi-step checkout (Address → Payment → Review)

### 💳 Payment System
- **Cash on Delivery (COD)** — confirmed after admin approval
- **UPI** — Google Pay, PhonePe, UPI ID `mohnapranav-1@okaxis`
- QR code display for scanning
- Transaction ID + screenshot submission
- **All payments manually verified by admin — never auto-confirmed**

### 👤 User System
- Single unified login/register (no separate seller portal)
- JWT-based authentication with refresh
- Role-based access: `USER` → `SELLER` → `ADMIN`
- Profile management

### 🏪 Seller System
- "Become a Seller" flow inside user account
- ₹399/month subscription via UPI
- Subscription pending admin approval
- Seller dashboard: add/edit/delete products
- Sales stats and order tracking

### ⚙️ Admin Panel
- Dashboard analytics (users, orders, revenue)
- Verify seller subscription payments
- Verify order payments
- Approve/reject products
- Manage categories and users

### 📦 Order Management
- Order history with full tracking timeline
- Status flow: `PAYMENT_PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED`
- Cancel orders (before shipment)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Redux Toolkit, React Router v6 |
| UI | Custom CSS, CSS Variables, Google Fonts |
| State | Redux Toolkit + Context API |
| HTTP | Axios with interceptors |
| Backend | Java 17, Spring Boot 3.2 |
| Security | Spring Security + JWT (JJWT 0.12) |
| Database | MySQL 8.0 + Spring Data JPA + Hibernate |
| File Storage | Local filesystem (configurable to S3) |
| Build | Maven (backend), Create React App (frontend) |

---

## Project Structure

```
shopkart/
├── frontend/                          # React Application
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/                    # Static images
│   │   ├── components/
│   │   │   ├── common/                # Navbar, Footer, ProtectedRoute, LoadingSpinner
│   │   │   ├── product/               # ProductCard
│   │   │   ├── auth/                  # (shared auth components)
│   │   │   ├── home/                  # Home-specific components
│   │   │   ├── cart/                  # Cart components
│   │   │   ├── order/                 # Order components
│   │   │   ├── seller/                # Seller components
│   │   │   ├── admin/                 # Admin components
│   │   │   └── profile/               # Profile components
│   │   ├── context/
│   │   │   ├── AuthContext.js         # Auth state & helpers
│   │   │   └── CartContext.js         # Cart operations
│   │   ├── hooks/                     # Custom hooks
│   │   ├── pages/
│   │   │   ├── HomePage.js            # Landing page with banner & categories
│   │   │   ├── LoginPage.js           # Login form
│   │   │   ├── RegisterPage.js        # Registration form
│   │   │   ├── ProductListPage.js     # Product listing + filters
│   │   │   ├── ProductDetailPage.js   # Product detail + gallery
│   │   │   ├── CartPage.js            # Shopping cart
│   │   │   ├── CheckoutPage.js        # Multi-step checkout
│   │   │   ├── OrdersPage.js          # Order history
│   │   │   ├── OrderDetailPage.js     # Order tracking
│   │   │   ├── BecomeSellerPage.js    # Seller subscription flow
│   │   │   ├── SellerDashboard.js     # Seller management panel
│   │   │   ├── AdminDashboard.js      # Admin panel
│   │   │   ├── ProfilePage.js         # User profile
│   │   │   └── NotFoundPage.js        # 404 page
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance + interceptors
│   │   │   ├── authService.js         # Auth API calls
│   │   │   ├── productService.js      # Product API calls
│   │   │   ├── cartService.js         # Cart API calls
│   │   │   ├── orderService.js        # Order API calls
│   │   │   └── adminService.js        # Admin + Seller API calls
│   │   ├── store/
│   │   │   ├── index.js               # Redux store config
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── cartSlice.js
│   │   │       ├── productSlice.js
│   │   │       ├── orderSlice.js
│   │   │       └── adminSlice.js
│   │   ├── styles/
│   │   │   └── global.css             # Design system / global styles
│   │   ├── utils/                     # Helper functions
│   │   ├── App.js                     # Root component + routing
│   │   └── index.js                   # Entry point
│   └── package.json
│
├── backend/                           # Spring Boot Application
│   ├── src/main/java/com/ecommerce/
│   │   ├── ShopKartApplication.java   # Main class + data seeder
│   │   ├── config/
│   │   │   ├── SecurityConfig.java    # Spring Security + CORS
│   │   │   └── WebConfig.java         # Static resource handler
│   │   ├── controller/
│   │   │   ├── AuthController.java    # POST /api/auth/*
│   │   │   ├── ProductController.java # GET/POST/PUT/DELETE /api/products/*
│   │   │   ├── CartController.java    # /api/cart/*
│   │   │   ├── OrderController.java   # /api/orders/*
│   │   │   ├── SellerController.java  # /api/seller/*
│   │   │   ├── AdminController.java   # /api/admin/*
│   │   │   └── CategoryController.java
│   │   ├── service/
│   │   │   ├── AuthService.java
│   │   │   ├── ProductService.java
│   │   │   ├── CartService.java
│   │   │   ├── OrderService.java
│   │   │   ├── SellerService.java
│   │   │   ├── AdminService.java
│   │   │   └── impl/                  # All service implementations
│   │   ├── repository/                # JPA repositories
│   │   ├── model/
│   │   │   ├── entity/                # JPA entities
│   │   │   └── enums/                 # Role, OrderStatus, etc.
│   │   ├── dto/
│   │   │   ├── request/               # Request payload DTOs
│   │   │   └── response/              # Response DTOs
│   │   ├── security/
│   │   │   ├── UserDetailsServiceImpl.java
│   │   │   └── jwt/
│   │   │       ├── JwtUtils.java
│   │   │       └── JwtAuthFilter.java
│   │   ├── exception/                 # Custom exceptions + GlobalExceptionHandler
│   │   └── utils/                     # FileStorageUtil, SecurityUtils
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── static/uploads/            # File upload storage
│   └── pom.xml
│
└── docs/
    ├── schema.sql                     # Full MySQL schema
    └── README.md                      # This file
```

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| npm | 9+ |
| MySQL | 8.0+ |

---

### 1. Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE shopkart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Run schema (optional — Hibernate auto-creates tables)
USE shopkart_db;
SOURCE docs/schema.sql;
```

---

### 2. Backend Setup

```bash
cd backend

# Edit database credentials
nano src/main/resources/application.properties
# Set: spring.datasource.username=root
# Set: spring.datasource.password=YOUR_PASSWORD

# Build and run
mvn clean install -DskipTests
mvn spring-boot:run
```

Backend starts at: `http://localhost:8080`

On first startup, the app automatically creates:
- Admin account: `admin@shopkart.com` / `admin123`
- 10 default product categories

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend starts at: `http://localhost:3000`

---

## Environment Setup

### Backend — `application.properties`

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/shopkart_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT (change secret in production!)
app.jwt.secret=ShopKartSecretKeyForJWTSigningMustBe256BitsOrMore!
app.jwt.expiration=86400000   # 24 hours in ms

# File upload path
app.upload.dir=src/main/resources/static/uploads

# Allowed CORS origins
app.cors.allowed-origins=http://localhost:3000
```

### Frontend — `.env`

Create `frontend/.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

## API Reference

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register new user |
| POST | `/api/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| PUT | `/api/auth/profile` | ✅ | Update profile |

### Products

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | List products (search, filter, sort, page) |
| GET | `/api/products/{id}` | ❌ | Get product detail |
| GET | `/api/products/featured` | ❌ | Get featured products |
| GET | `/api/categories` | ❌ | Get all categories |

### Seller (requires SELLER or ADMIN role)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/seller/subscribe` | ✅ | Submit subscription + UPI proof |
| GET | `/api/seller/subscription-status` | ✅ | Check subscription status |
| GET | `/api/seller/products` | SELLER | Get own products |
| POST | `/api/seller/products` | SELLER | Create product (multipart) |
| PUT | `/api/seller/products/{id}` | SELLER | Update product (multipart) |
| DELETE | `/api/seller/products/{id}` | SELLER | Delete product |
| GET | `/api/seller/stats` | SELLER | Get seller statistics |

### Cart (requires authentication)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/cart` | ✅ | Get user's cart |
| POST | `/api/cart/add` | ✅ | Add item to cart |
| PUT | `/api/cart/update/{itemId}` | ✅ | Update item quantity |
| DELETE | `/api/cart/remove/{itemId}` | ✅ | Remove item |
| DELETE | `/api/cart/clear` | ✅ | Clear entire cart |

### Orders (requires authentication)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/orders` | ✅ | Place order (multipart) |
| GET | `/api/orders/my` | ✅ | Get own orders |
| GET | `/api/orders/{id}` | ✅ | Get order detail |
| POST | `/api/orders/{id}/cancel` | ✅ | Cancel order |

### Admin (requires ADMIN role)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/stats` | Dashboard analytics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/subscriptions/pending` | Pending seller approvals |
| POST | `/api/admin/subscriptions/{id}/approve` | Approve seller |
| POST | `/api/admin/subscriptions/{id}/reject` | Reject seller |
| GET | `/api/admin/orders/pending-payment` | Orders awaiting payment verification |
| POST | `/api/admin/orders/{id}/approve-payment` | Confirm order payment |
| POST | `/api/admin/orders/{id}/reject-payment` | Reject order payment |
| PUT | `/api/admin/orders/{id}/status` | Update order status |
| GET | `/api/admin/products` | All products |
| POST | `/api/admin/products/{id}/approve` | Approve product |
| POST | `/api/admin/products/{id}/reject` | Reject product |
| POST | `/api/admin/categories` | Create category |
| DELETE | `/api/admin/categories/{id}` | Delete category |

---

## Payment Flow

### Order Payment Flow

```
Customer places order
        │
        ▼
┌─────────────────┐
│  PAYMENT_PENDING │  ← status on order creation
└────────┬────────┘
         │
    Admin verifies UPI transaction ID + screenshot
         │
    ┌────┴────┐
    │         │
  Approve   Reject
    │         │
    ▼         ▼
CONFIRMED  CANCELLED
(stock kept) (stock restored)
    │
    ▼
PROCESSING → SHIPPED → DELIVERED
```

### Seller Subscription Flow

```
User clicks "Become a Seller"
        │
        ▼
Pays ₹399 to mohnapranav-1@okaxis
        │
        ▼
Submits Transaction ID + Screenshot
        │
        ▼
  Status: PENDING
        │
   Admin reviews
        │
    ┌───┴───┐
    │       │
 Approve  Reject
    │
    ▼
User role upgraded to SELLER
Seller Dashboard unlocked
```

---

## Role System

| Role | Register | Shop | Sell | Admin Panel |
|------|----------|------|------|-------------|
| USER | default | ✅ | ❌ | ❌ |
| SELLER | after subscription | ✅ | ✅ | ❌ |
| ADMIN | manual DB / seed | ✅ | ✅ | ✅ |

---

## Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| `< 480px` | Small phones |
| `< 600px` | Phones |
| `< 768px` | Tablets (portrait) |
| `< 900px` | Tablets (landscape) |
| `< 1024px` | Small laptops |
| `≥ 1200px` | Desktop |

---

## Deployment

### Backend (JAR)

```bash
cd backend
mvn clean package -DskipTests
java -jar target/shopkart-backend-1.0.0.jar \
  --spring.datasource.password=PROD_PASSWORD \
  --app.jwt.secret=PROD_SECRET_256_CHARS \
  --app.cors.allowed-origins=https://yourdomain.com
```

### Frontend (Build)

```bash
cd frontend
REACT_APP_API_URL=https://api.yourdomain.com/api npm run build
# Serve /build with nginx or Vercel/Netlify
```

### nginx Config (sample)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    root /var/www/shopkart/build;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
    }

    location /uploads/ {
        proxy_pass http://localhost:8080/uploads/;
    }
}
```

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@shopkart.com | admin123 |

> Change the admin password immediately after first login in production.

---

## License

MIT © 2024 ShopKart. Built for educational and commercial use.


Run commands:-

# MySQL open command
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p
EXIT;

# Backend run command
mvn spring-boot:run
