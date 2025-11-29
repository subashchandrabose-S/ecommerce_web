# 🌿 Nursery E-Commerce Platform

A modern, full-stack e-commerce application for plant nurseries and garden chemicals.

## Features

- 🎨 Modern glassmorphism UI design
- 📱 Fully responsive with mobile hamburger menu
- 🔐 Dual authentication (User & Admin)
- 🛍️ Shopping cart with localStorage persistence
- 👨‍💼 Comprehensive admin dashboard
- 📊 User activity analytics
- 🌱 Pre-seeded with sample products

## Tech Stack

**Frontend:** Vue 3, Vue Router, Pinia, Axios  
**Backend:** Express.js, MongoDB, Mongoose  
**Auth:** JWT, bcryptjs

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo>
   cd nursery-ecomerse
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment**
   Create `server/.env`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/nursery_ecommerce
   JWT_SECRET=your_secret_key_here
   ```

4. **Seed Database** (Optional)
   ```bash
   node seed.js
   ```

5. **Start Backend**
   ```bash
   npm run dev
   ```

6. **Setup Frontend** (new terminal)
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Usage

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000

### Creating Admin User

1. Register normally at `/register`
2. Connect to MongoDB
3. Update user document: `db.users.updateOne({email: "admin@example.com"}, {$set: {role: "admin"}})`
4. Login at `/admin-login`

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/user-stats` - Get user statistics

## Project Structure

```
nursery-ecomerse/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── index.js         # Server entry
│   └── seed.js          # Database seeding
├── client/
│   ├── src/
│   │   ├── components/  # Vue components
│   │   ├── views/       # Page components
│   │   ├── stores/      # Pinia stores
│   │   ├── router/      # Vue Router
│   │   └── assets/      # CSS & images
│   └── index.html
└── README.md
```

## License

MIT
