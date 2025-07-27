# RBAC Backend

A Node.js Express backend application implementing Role-Based Access Control (RBAC) with JWT authentication and MongoDB integration.

## Features

- **Role-Based Access Control**: Three user roles (Admin, Editor, Viewer) with different permissions
- **JWT Authentication**: Secure token-based authentication
- **User Management**: Create, read, update, and delete users (Admin only)
- **Post Management**: CRUD operations for posts with role-based permissions
- **System Logging**: Comprehensive activity tracking
- **Password Security**: Bcrypt hashing for secure password storage
- **MongoDB Integration**: Mongoose ODM for database operations

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Security**: Helmet.js, CORS
- **Environment**: dotenv

## User Roles & Permissions

### Admin
- Full access to all endpoints
- Can create, edit, and delete users
- Can view system logs and dashboard statistics
- Can manage posts and comments

### Editor
- Can view and create posts
- Can edit their own posts
- Can add comments
- Cannot manage users or view system logs

### Viewer
- Can only view posts
- Cannot create, edit, or delete content
- Cannot access user management or system logs

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=8080
   SERVER_ENV=DEV

   # Database Configuration
   MONGO_DB_USERNAME=your_mongodb_username
   MONGO_DB_PASSWORD=your_mongodb_password

   # JWT Configuration
   JWT_SECRET_KEY=your_super_secret_jwt_key

   # Admin User Configuration
   ADMIN_EMAIL=admin@rahaneai.com
   ADMIN_PASSWORD=your_admin_password
   ADMIN_FULL_NAME=System Administrator
   ```

4. **Database Setup**
   - Ensure MongoDB is running locally on port 27017, or
   - Configure MongoDB Atlas connection in the environment variables

5. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /auth/login` - User login

### User Management (Admin Only)
- `POST /user/create-account` - Create new user
- `GET /user/all-users` - Get all users
- `PUT /user/edit-user` - Edit user details
- `PUT /user/delete-user` - Delete user

### Posts Management
- `GET /user/post` - Get all posts (All roles)
- `POST /user/post` - Create new post (Admin, Editor)
- `PUT /user/post` - Edit post (Admin, Editor - own posts)
- `PUT /user/delete-post` - Delete post (Admin, Editor - own posts)

### Comments
- `POST /comment` - Add comment (Admin, Editor)

### Data & Analytics (Admin Only)
- `GET /data/system-logs` - Get system activity logs
- `GET /data/dashboard-stat` - Get dashboard statistics

## Project Structure

```
backend/
├── config/
│   └── mongoDB.js          # Database connection configuration
├── controllers/
│   ├── auth.js             # Authentication logic
│   ├── data.js             # System logs and dashboard stats
│   └── user.js             # User and post management
├── helpers/
│   ├── accessControlCenter.js  # Role-based access control rules
│   ├── bcrypt.js           # Password hashing utilities
│   ├── constant.js         # Application constants
│   ├── initAdminUser.js    # Admin user initialization
│   ├── jwt.js              # JWT token utilities
│   └── validation.js       # Request validation helper
├── middlewares/
│   ├── bodyParser.js       # JSON body parsing
│   ├── error.js            # Global error handling
│   └── jwt.js              # JWT authentication & authorization
├── models/
│   ├── comment.js          # Comment schema
│   ├── post.js             # Post schema
│   ├── systemLog.js        # System log schema
│   └── user.js             # User schema
├── routes/
│   ├── auth.js             # Authentication routes
│   ├── data.js             # Data analytics routes
│   └── user.js             # User management routes
├── app.js                  # Main application file
└── package.json
```

## Database Schema

### User Model
- `email`: Unique user email
- `password`: Hashed password
- `fullName`: User's full name
- `role`: User role (admin, editor, viewer)
- `createdBy`: Reference to admin who created the user

### Post Model
- `title`: Post title
- `description`: Post content
- `comments`: Array of comment references
- `createdBy`: Reference to user who created the post
- `adminId`: Reference to admin user

### SystemLog Model
- `action`: Type of action performed
- `userId`: Reference to user who performed the action
- `details`: Detailed description of the action
- `adminId`: Reference to admin user

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Authorization**: Middleware to check user permissions
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet Security**: Additional HTTP security headers
- **Input Validation**: express-validator for request validation

## Error Handling

The application includes comprehensive error handling:
- **Custom Error Middleware**: Centralized error processing
- **HTTP Status Codes**: Proper status code responses
- **Validation Errors**: Detailed validation error messages
- **Authentication Errors**: Clear authentication failure messages

## Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Variables
Ensure all required environment variables are set in your `.env` file before starting the application.

### Default Admin User
On first startup, the system automatically creates an admin user with credentials from environment variables.

## Health Check

The application includes a health check endpoint:
```
GET /health
```
Returns server status and confirms the application is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
