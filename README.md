# 🦅 ThreatHawk 

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://postgresql.org/)

> **ThreatHawk** is a comprehensive, full-stack web application that provides automated vulnerability scanning for web applications and networks. Built with modern technologies, it offers enterprise-grade security scanning capabilities with an intuitive user interface.


## ✨ Features

###  Security Scanning
- **OWASP Top 10 Detection** - Comprehensive vulnerability scanning
- **Network Security Analysis** - Port scanning and network vulnerability assessment
- **Web Application Security** - SQL injection, XSS, CSRF detection
- **Real-time Scanning** - Live progress tracking and results

### 🛡️ Authentication & Authorization
- **Multi-provider Authentication** - Google, GitHub, and email/password login
- **JWT-based Security** - Secure token-based authentication
- **Role-based Access Control** - User and admin permissions
- **Session Management** - Secure user session handling

### 📊 Dashboard & Analytics
- **Interactive Dashboard** - Real-time security metrics and statistics
- **Scan History** - Complete audit trail of all security scans
- **Detailed Reports** - Comprehensive vulnerability reports with remediation steps
- **Export Capabilities** - Download reports in multiple formats

###  Technical Features
- **Microservices Architecture** - Scalable and maintainable codebase
- **Real-time Updates** - WebSocket integration for live scan progress
- **API-First Design** - RESTful API for easy integration
- **Responsive Design** - Mobile-friendly interface

## 🏗️ Architecture

```markdown:README.md
<code_block_to_apply_changes_from>
ThreatHawk/
├── frontend/                 # Next.js 14 React Application
│   ├── src/app/             # App Router & Components
│   ├── src/lib/             # Utilities & Configuration
│   └── public/              # Static Assets
├── backend/                 # Node.js Express API Server
│   ├── src/routes/          # API Endpoints
│   ├── src/middleware/      # Authentication & Security
│   └── src/utils/           # Business Logic
├── scanner/                 # Python Flask Security Scanner
│   ├── app/                 # Scanner Core Logic
│   └── reports/             # Generated Security Reports
└── prisma/                  # Database Schema & Migrations
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework
- **NextAuth.js** - Authentication library
- **React Icons** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development
- **Prisma** - Database ORM
- **JWT** - JSON Web Tokens for authentication

### Database
- **PostgreSQL** - Primary database
- **Prisma** - Database migrations and schema management

### Security Scanner
- **Python 3.8+** - Core scanning engine
- **Flask** - Web framework for scanner API
- **OWASP ZAP** - Web application security scanner
- **Nmap** - Network security scanner

### DevOps & Tools
- **Docker** - Containerization
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **PostgreSQL** (v13 or higher)
- **Git** (for version control)
- **npm**

##  Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/threathawk.git
cd threathawk
```

### 2. Environment Setup

Create the required environment files:

#### Frontend Environment (`frontend/.env.local`)
```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Backend API URLs
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
BACKEND_API_URL=http://localhost:5000

# OAuth Providers (Optional)
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
```

#### Backend Environment (`backend/.env`)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# NextAuth Secret (MUST match frontend)
NEXTAUTH_SECRET=your-super-secret-key-here

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/threathawk

# Flask Scanner API
FLASK_API_URL=http://localhost:5001

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Install Prisma CLI
npm install -g prisma

# Set up the database
cd backend
npx prisma generate
npx prisma db push
```

### 4. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Install Python scanner dependencies
cd ../scanner
pip install -r requirements.txt
```

### 5. Start the Application

#### Option A: Start All Services (Recommended)
```bash
# From the root directory
npm run dev
```

#### Option B: Start Services Individually
```bash
# Terminal 1: Start Frontend
cd frontend
npm run dev

# Terminal 2: Start Backend
cd backend
npm run dev

# Terminal 3: Start Python Scanner
cd scanner
python app/main.py
```

### 6. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Scanner API:** http://localhost:5001

##  Usage Guide

### 1. User Registration & Authentication
1. Visit the application at `http://localhost:3000`
2. Click "Sign Up" to create an account or use OAuth providers
3. Verify your email (if required)
4. Log in to access the dashboard

### 2. Running Security Scans
1. Navigate to "New Scan" in the dashboard
2. Enter the target URL (e.g., `https://example.com`)
3. Select scan type:
   - **Web Application Scan** - OWASP Top 10 vulnerabilities
   - **Network Scan** - Port scanning and network analysis
   - **Deep Scan** - Comprehensive security assessment
4. Click "Start Scan" and monitor real-time progress

### 3. Viewing Results
1. Check "Your Scans" for scan history
2. Click on any scan to view detailed results
3. Download reports in HTML/XML format
4. Review vulnerability details and remediation steps

### 4. Admin Features (Admin Users)
1. Access user management dashboard
2. View system-wide scan statistics
3. Manage user permissions and roles
4. Monitor system health and performance

##  Configuration

### Customizing Scan Parameters

Edit `scanner/app/config.py` to modify scanning behavior:

```python
# Scan timeout settings
SCAN_TIMEOUT = 300  # 5 minutes

# Concurrent scan limits
MAX_CONCURRENT_SCANS = 5

# Report storage settings
REPORT_RETENTION_DAYS = 30
```

### Database Configuration

Update `prisma/schema.prisma` for database schema changes:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  username  String   @unique
  // ... other fields
}
```

##  Testing

### Frontend Tests
```bash
cd frontend
npm run test
npm run test:e2e
```

### Backend Tests
```bash
cd backend
npm run test
npm run test:integration
```

### API Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test scan endpoint (with auth token)
curl -X POST http://localhost:5000/api/scan-and-scrape \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"target":"https://example.com","type":"WEB"}'
```

## 📊 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/oauth` | OAuth authentication |

### Scan Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan-and-scrape` | Start new security scan |
| GET | `/api/scan-and-scrape/my-scans` | Get user's scan history |
| GET | `/api/scan-and-scrape/download/:id` | Download scan report |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/users` | Get all users (Admin only) |
| PUT | `/api/auth/users/role` | Update user role (Admin only) |

## 🚀 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
cd frontend
vercel --prod
```

### Backend Deployment (Heroku)

```bash
# Install Heroku CLI
# Create Heroku app
heroku create threathawk-api

# Set environment variables
heroku config:set NEXTAUTH_SECRET=your-production-secret
heroku config:set DATABASE_URL=your-production-db-url

# Deploy
git push heroku main
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- **OWASP** for security standards and guidelines
- **Next.js** team for the amazing React framework
- **Prisma** team for the excellent database toolkit
- **Tailwind CSS** for the utility-first CSS framework

## 📞 Support

- **Documentation:** [https://threathawk-docs.vercel.app](https://threathawk-docs.vercel.app)
- **Issues:** [GitHub Issues](https://github.com/Dhruv-Jain31/threathawk/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Dhruv-Jain31/threathawk/discussions)
- **Email:** jain.dhruv3103@gmail.com

##  Links

- **Website:** [https://threathawk.com](https://threathawk.com)
- **Blog:** [https://blog.threathawk.com](https://blog.threathawk.com)


---

<div align="center">
  <p>Made with ❤️ by the ThreatHawk Team</p>
  <p>Secure your applications with confidence</p>
</div>
```
