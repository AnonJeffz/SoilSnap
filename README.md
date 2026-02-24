# SoilSnap

**AI-Powered Soil Analysis & Crop Recommendation System**

SoilSnap is a comprehensive web application designed to revolutionize agricultural practices through artificial intelligence. The platform enables farmers, agricultural experts, and researchers to analyze soil composition instantly and receive data-driven crop recommendations to maximize productivity.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

### Core Functionality
- **AI Soil Classification**: Upload soil images for instant AI-powered analysis and classification
- **Crop Recommendations**: Get personalized crop suggestions based on soil type and conditions
- **Interactive Soil Map**: Geographic visualization of soil types and locations
- **Real-time Analysis**: Instant results using TensorFlow-based machine learning models

### User Management
- **Multi-role Authentication**: Support for Admin, Soil Expert, and User roles
- **Email Verification**: Secure account verification via SendGrid
- **OAuth Integration**: Sign in with Google
- **Password Reset**: Secure password recovery with OTP verification

### Expert Features
- **Verification System**: Apply to become a certified Soil Expert
- **Content Management**: Upload and manage soil classifications and crop data
- **Document Upload**: Submit credentials for expert verification (PDF, images, etc.)

### Administrative Tools
- **User Management**: Admin dashboard for account oversight
- **Request Handling**: Review and approve/decline expert applications
- **Activity Logs**: Complete audit trail of system actions
- **Analytics Dashboard**: Track system usage and metrics

### Technical Features
- **Progressive Web App (PWA)**: Install and use offline
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Dark Mode**: Built-in theme support
- **SEO Optimized**: Sitemap, robots.txt, and meta tags for search engines
- **Git LFS**: Efficient handling of large ML model files

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Authentication**: JWT with httpOnly cookies
- **Notifications**: React Toastify, SweetAlert2

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js, JWT, bcrypt
- **Email Service**: SendGrid
- **File Upload**: Multer
- **Security**: Rate limiting, CORS, helmet
- **Session Management**: Express Session with MongoDB store

### Machine Learning
- **Model**: TensorFlow/Keras CNN model (.h5)
- **Storage**: Git LFS for version control
- **Model Size**: 166 MB trained model

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: AWS EC2 (Ubuntu)
- **Process Management**: PM2
- **Version Control**: Git with Git LFS
- **CI/CD**: Automated deployment via GitHub integration

## Architecture

```
┌─────────────────┐
│   Client Layer  │  (React + Vite)
│   PWA Enabled   │
└────────┬────────┘
         │
         │ HTTPS/WSS
         │
┌────────▼────────┐
│   API Gateway   │  (Express.js)
│  Authentication │
│  Rate Limiting  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│MongoDB│ │ML Model │
│ Atlas │ │Processing│
└───────┘ └─────────┘
```

## Prerequisites

Before installation, ensure you have the following installed:

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **MongoDB**: v6.x or higher (or MongoDB Atlas account)
- **Git**: v2.x or higher
- **Git LFS**: v3.x or higher

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AnonJeffz/SoilSnap.git
cd SoilSnap
```

### 2. Install Git LFS

```bash
git lfs install
git lfs pull
```

This will download the ML model file (`backend/final_model_20251027_131112.h5`).

### 3. Install Backend Dependencies

```bash
npm install
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/soilsnap
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/soilsnap

# JWT Secret
TOKEN_KEY=your_jwt_secret_key_here

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM=noreply@yourdomain.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Frontend URL
CLIENT_URL=http://localhost:5173

# Encryption
ENCRYPTION_KEY=your_32_byte_encryption_key

# ML Model
REACT_APP_USE_SERVER_PREDICTION=false

# API URL (for frontend)
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

#### Start Backend Server
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

#### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`

### Production Mode

#### Build Frontend
```bash
cd frontend
npm run build
```

#### Start Production Server
```bash
npm start
```

Both frontend and backend will be served from `http://localhost:5000`

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_URL=https://api.soilsnap.site`
3. Deploy automatically on push to main branch

### Backend (AWS EC2)

1. **SSH into EC2 instance**
```bash
ssh -i soilsnap-ec2-key.pem ubuntu@your-ec2-ip
```

2. **Clone and setup**
```bash
git clone https://github.com/AnonJeffz/SoilSnap.git
cd SoilSnap
npm install
```

3. **Configure environment variables**
```bash
nano backend/.env
# Add production environment variables
```

4. **Install PM2 and start**
```bash
sudo npm install -g pm2
pm2 start backend/server.js --name soilsnap
pm2 save
pm2 startup
```

5. **Configure Nginx (optional)**
```bash
sudo nano /etc/nginx/sites-available/soilsnap
# Add reverse proxy configuration
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/verify-reset-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### User Endpoints
- `GET /api/users/me` - Get current user
- `GET /api/users/all` - Get all users (Admin)
- `GET /api/users/verify/:token` - Verify email
- `DELETE /api/users/:id` - Delete user (Admin)

### Soil Endpoints
- `GET /api/soil` - Get all soil classifications
- `GET /api/soil/:id` - Get soil by ID
- `POST /api/soil/upload` - Upload new soil (Protected)
- `PUT /api/soil/:id` - Update soil (Protected)
- `DELETE /api/soil/:id` - Delete soil (Protected)

### Crop Endpoints
- `GET /api/crop` - Get all crops
- `GET /api/crop/:id` - Get crop by ID
- `POST /api/crop/upload` - Upload new crop (Protected)
- `POST /api/crop/recommendation` - Get crop recommendations
- `PUT /api/crop/:id` - Update crop (Protected)
- `DELETE /api/crop/:id` - Delete crop (Protected)

### Request Endpoints
- `POST /api/request/upload` - Submit expert verification request
- `GET /api/request` - Get all requests (Admin)
- `GET /api/request/:id` - Get request by ID (Admin)
- `PATCH /api/request/:id` - Update request status (Admin)
- `DELETE /api/request/:id` - Delete request (Admin)
- `PATCH /api/request/:id/role` - Approve and change user role (Admin)

### Location Endpoints
- `GET /api/location` - Get all locations
- `POST /api/location` - Add location (Protected)
- `DELETE /api/location/:id` - Delete location (Admin)

### Logs Endpoints
- `GET /api/logs` - Get system logs (Admin)

## Project Structure

```
SoilSnap/
├── backend/
│   ├── config/
│   │   ├── connection.js          # MongoDB connection
│   │   ├── mail.js                # Email configuration
│   │   └── OTPmessage.js          # OTP utilities
│   ├── controllers/
│   │   ├── auth-controllers.js
│   │   ├── crop-controllers.js
│   │   ├── location-controllers.js
│   │   ├── logs-controllers.js
│   │   ├── request-controller.js
│   │   ├── soil-controller.js
│   │   └── user-controllers.js
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT authentication
│   │   ├── rateLimiter.js         # Rate limiting
│   │   └── roleMiddleware.js      # Role-based access
│   ├── models/
│   │   ├── crop-model.js
│   │   ├── location-model.js
│   │   ├── logs-model.js
│   │   ├── soil-model.js
│   │   ├── user-model.js
│   │   └── upgade-request-model.js
│   ├── routes/
│   │   ├── auth-routes.js
│   │   ├── crop-routes.js
│   │   ├── location-routes.js
│   │   ├── logs-routes.js
│   │   ├── request-routes.js
│   │   ├── soil-routes.js
│   │   └── users-routes.js
│   ├── services/
│   │   └── passport.js            # Passport configuration
│   ├── uploads/                   # User uploaded files
│   ├── util/
│   │   ├── SecretToken.js
│   │   └── Security.js
│   ├── final_model_20251027_131112.h5  # ML Model (Git LFS)
│   └── server.js                  # Entry point
│
├── frontend/
│   ├── public/
│   │   ├── images/
│   │   ├── models/
│   │   ├── manifest.json
│   │   ├── robots.txt             # SEO - Crawler rules
│   │   ├── sitemap.xml            # SEO - Site structure
│   │   └── sw.js                  # Service Worker (PWA)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/              # Authentication components
│   │   │   ├── crops/             # Crop management
│   │   │   ├── soil/              # Soil classification
│   │   │   ├── map/               # Location mapping
│   │   │   ├── ml/                # ML inference
│   │   │   ├── request/           # Expert requests
│   │   │   ├── ui/                # Reusable UI components
│   │   │   └── ...
│   │   ├── context/
│   │   │   ├── AuthContext.tsx    # Auth state management
│   │   │   ├── ThemeContext.tsx   # Dark mode
│   │   │   └── ...
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API services
│   │   ├── utils/
│   │   │   └── api.ts             # Axios configuration
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   └── package.json
│
├── .gitattributes                 # Git LFS configuration
├── .gitignore
├── package.json
└── README.md
```

## Contributing

We welcome contributions to SoilSnap! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Code Standards

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

### Commit Message Convention

- `Add:` New features or files
- `Fix:` Bug fixes
- `Update:` Changes to existing features
- `Refactor:` Code refactoring
- `Docs:` Documentation updates
- `Style:` Code style changes (formatting, etc.)

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Support

For questions, issues, or feature requests:

- **Email**: cabarrubias1002@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/AnonJeffz/SoilSnap/issues)
- **Website**: [https://soilsnap.site](https://soilsnap.site)

## Acknowledgments

- TensorFlow team for the machine learning framework
- React and Vite communities for excellent documentation
- MongoDB for the flexible database solution
- All contributors who have helped improve this project

---

**Built with passion for sustainable agriculture** | © 2026 SoilSnap Team
