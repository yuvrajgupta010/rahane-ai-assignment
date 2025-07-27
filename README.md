# Role-Based Access Control (RBAC) Application

A full-stack web application implementing Role-Based Access Control with JWT authentication, built using Node.js/Express backend and Next.js/React frontend.

## 🚀 Overview

This RBAC application provides a comprehensive user management system with three distinct user roles (Admin, Editor, Viewer), each with specific permissions and capabilities. The system includes user authentication, post management, system logging, and administrative dashboards.

## 🏗️ Architecture

```
rbac-application/
├── backend/           # Node.js Express API server
├── frontend/          # Next.js React application
└── README.md         # This file
```

## ✨ Key Features

- **🔐 JWT Authentication**: Secure token-based authentication system
- **👥 Role-Based Access**: Three user roles with different permission levels
- **📝 Post Management**: Create, read, update, delete posts with role restrictions
- **👤 User Management**: Admin-only user creation and management
- **📊 System Analytics**: Dashboard with user statistics and activity logs
- **📱 Responsive Design**: Mobile-friendly Bootstrap UI
- **🔍 System Logging**: Comprehensive activity tracking and audit trails

## 🎭 User Roles

| Role       | Permissions                                                                  |
| ---------- | ---------------------------------------------------------------------------- |
| **Admin**  | Full access: manage users, view system logs, CRUD posts, dashboard analytics |
| **Editor** | Create/edit own posts, view all posts, add comments                          |
| **Viewer** | Read-only access to posts                                                    |

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator

### Frontend

- **Framework**: Next.js 14 (React 18)
- **Styling**: Bootstrap 5.3.5
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios
- **State**: React Context API

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone <repository-url>
cd rbac-application
```

### 2. Setup Backend

```bash
cd backend
npm install
# Configure .env file (see backend README)
npm run dev
```

### 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/health

## 📚 Documentation

For detailed setup instructions, API documentation, and development guidelines, please refer to the respective README files:

### 📖 [Backend Documentation](./backend/README.md)

- API endpoints and authentication
- Database setup and configuration
- Role-based access control implementation
- Development and deployment guides

### 📖 [Frontend Documentation](./frontend/README.md)

- Component architecture and routing
- User interface for different roles
- Form validation and state management
- Styling and responsive design

## 🔑 Default Credentials

The system automatically creates an admin user on first startup. Check the backend README for environment variable configuration.

**Default Login**:

- Email: `admin@rahaneai.com`
- Password: (configured in backend environment variables)

## 📸 Application Screenshots

### Admin Dashboard

- User management interface
- System logs and analytics
- Role-based user creation

### Editor/Viewer Dashboard

- Post management interface
- Role-appropriate action buttons
- Responsive design across devices

## 🚦 Getting Started Guide

1. **Start with Backend Setup**: Follow the [Backend README](./backend/README.md) to configure your database and environment variables
2. **Launch Frontend**: Use the [Frontend README](./frontend/README.md) to set up the user interface
3. **Test the System**: Login with admin credentials and explore the role-based features
4. **Create Users**: Use the admin interface to create Editor and Viewer accounts
5. **Explore Features**: Test post creation, user management, and system logging

## 🤝 Contributing

We welcome contributions! Please see the individual README files in backend and frontend directories for specific development guidelines.

### Development Workflow

1. Fork the repository
2. Create feature branches for backend and/or frontend changes
3. Follow the coding standards outlined in respective README files
4. Test your changes thoroughly
5. Submit pull requests with clear descriptions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter issues:

1. **Backend Issues**: Check the [Backend README](./backend/README.md) troubleshooting section
2. **Frontend Issues**: Refer to the [Frontend README](./frontend/README.md) development guide
3. **Database Connection**: Ensure MongoDB is running and properly configured
4. **Environment Variables**: Verify all required environment variables are set

## 🎯 Next Steps

Ready to explore? Start with:

- 📁 **[Backend Setup](./backend/README.md)** - API server and database configuration
- 🎨 **[Frontend Setup](./frontend/README.md)** - User interface and component architecture

---

**Happy Coding! 🚀**
