# RBAC Frontend

A Next.js React frontend application for Role-Based Access Control (RBAC) system with responsive design and role-based UI components.

## Features

- **Role-Based Dashboard**: Different interfaces for Admin, Editor, and Viewer roles
- **User Management**: Admin interface for creating, editing, and deleting users
- **Post Management**: Create, edit, and delete posts with role-based permissions
- **System Analytics**: Admin dashboard with user statistics and system logs
- **Responsive Design**: Bootstrap-based responsive UI
- **Form Validation**: Client-side validation with Yup and Formik
- **Authentication Flow**: JWT-based authentication with automatic token management
- **Toast Notifications**: User-friendly feedback for all actions

## Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Styling**: Bootstrap 5.3.5
- **Form Management**: Formik with Yup validation
- **HTTP Client**: Axios with interceptors
- **State Management**: React Context API
- **Notifications**: react-hot-toast
- **Icons**: Bootstrap Icons (via SVG)

## User Interfaces

### Admin Dashboard
- **User Management Tab**: Create, edit, delete users with role assignment
- **System Logs Tab**: View all system activities and user actions
- **Dashboard Statistics**: Overview of total users and system events
- **Full CRUD Operations**: Complete control over users and posts

### Editor/Viewer Dashboard
- **Posts Interface**: View all posts with creation timestamps and authors
- **Post Creation**: Create new posts (Editor only)
- **Post Editing**: Edit own posts (Editor only)
- **Role-Based Actions**: UI elements adapt based on user permissions

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file (if needed for additional configuration):
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Application Structure

```
frontend/
├── components/
│   ├── Dashboard/
│   │   ├── Admin.jsx           # Admin dashboard with user management
│   │   ├── AdminStat.jsx       # Statistics cards for admin
│   │   ├── Dashboard.jsx       # Main dashboard component
│   │   ├── DashboardLayout.jsx # Common layout wrapper
│   │   ├── UserDashboard.jsx   # Editor/Viewer dashboard
│   │   └── Dashboard.module.css
│   └── Login/
│       ├── Login.jsx           # Login form component
│       └── login.module.css
├── helpers/
│   ├── formatData.js           # Date formatting utilities
│   └── validation.js          # Form validation schemas
├── pages/
│   ├── api/
│   │   └── hello.js            # API route example
│   ├── dashboard/
│   │   └── index.js            # Dashboard page
│   ├── _app.js                 # App wrapper with providers
│   ├── _document.js            # HTML document structure
│   └── index.js                # Login page (home)
├── service/
│   ├── axiosClient.js          # HTTP client with interceptors
│   └── restfulUrls.js          # API endpoints configuration
├── store/
│   ├── AuthCTX.jsx             # Authentication context
│   └── store.jsx               # Context store wrapper
└── styles/
    └── globals.css             # Global styles
```

## Key Components

### Authentication Context (`AuthCTX.jsx`)
- **Token Management**: Automatic token refresh and validation
- **Route Protection**: Redirects based on authentication status
- **User State**: Manages user details and authentication state
- **localStorage Integration**: Persists authentication across sessions

### Dashboard Components
- **Admin.jsx**: Complete admin interface with user management and system logs
- **UserDashboard.jsx**: Post management interface for editors and viewers
- **DashboardLayout.jsx**: Common layout with navigation and user info

### Form Management
- **Formik Integration**: Handles form state and submission
- **Yup Validation**: Schema-based form validation
- **Error Handling**: User-friendly error messages and validation feedback

## API Integration

### HTTP Client (`axiosClient.js`)
```javascript
// Automatic token attachment
config.headers["Authorization"] = `Bearer ${accessToken}`;

// Response interceptor for error handling
interceptors.response.use(
  (response) => response,
  (error) => handleError(error)
);
```

### Endpoints (`restfulUrls.js`)
- Authentication endpoints
- User management endpoints
- Post and comment endpoints
- System data endpoints

## Role-Based Features

### Admin Features
- **User Management**: Complete CRUD operations for users
- **Role Assignment**: Assign Editor/Viewer roles to users
- **System Monitoring**: View all system logs and activities
- **Dashboard Analytics**: User counts and system statistics

### Editor Features
- **Post Creation**: Create new posts
- **Post Management**: Edit and delete own posts
- **Content Viewing**: View all posts from all users

### Viewer Features
- **Read-Only Access**: View posts without modification abilities
- **Limited UI**: Only relevant actions are displayed

## Form Validation Schemas

### Login Form
```javascript
loginFormValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
});
```

### User Creation Form
```javascript
createUserFormValidation = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).when("mode", {...}),
  role: yup.string().oneOf(["editor", "viewer"]).required(),
  fullName: yup.string().min(2).required()
});
```

## Styling and UI

### Bootstrap Integration
- **Responsive Grid**: Bootstrap's grid system for layout
- **Component Library**: Cards, tables, modals, forms, and buttons
- **Utility Classes**: Spacing, typography, and color utilities

### Custom Styling
- **CSS Modules**: Component-specific styling
- **Animation**: Smooth form transitions and loading states
- **Responsive Design**: Mobile-first approach

## State Management

### Context API Structure
```javascript
const AuthCTX = React.createContext({
  isAuthenticated: false,
  userDetails: null,
  _login: () => {},
  _logout: () => {},
});
```

### Local Storage Integration
- **Token Persistence**: JWT tokens stored securely
- **User Details**: User information cached for quick access
- **Automatic Cleanup**: Tokens cleared on logout/expiration

## Error Handling

### Client-Side Error Handling
- **Form Validation**: Real-time validation with error messages
- **API Error Handling**: User-friendly error notifications
- **Network Errors**: Graceful handling of connection issues
- **Authentication Errors**: Automatic logout on token expiration

### User Feedback
- **Toast Notifications**: Success and error messages
- **Loading States**: Visual feedback during API calls
- **Confirmation Modals**: User confirmation for destructive actions

## Security Features

- **Token-Based Authentication**: JWT tokens with automatic refresh
- **Route Protection**: Unauthorized access prevention
- **Role-Based UI**: Interface elements based on user permissions
- **XSS Protection**: Input sanitization and validation

## Development

### Available Scripts
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # Run ESLint
```

### Development Server
The development server runs on `http://localhost:3000` with hot reload enabled.

### Environment Setup
Ensure the backend server is running on `http://localhost:8080` before starting the frontend.

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Configure production API endpoints in environment variables or update `restfulUrls.js`.

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Responsive Design**: Mobile and tablet compatible
- **Bootstrap Compatibility**: Supports Bootstrap 5.3.5 features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style
4. Add proper error handling
5. Test on different screen sizes
6. Submit a pull request

## License

This project is licensed under the MIT License.
