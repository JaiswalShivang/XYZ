# Government Schemes Portal

A modern, full-stack web application for managing and accessing government schemes with beautiful UI and comprehensive functionality.

## 🚀 Features

### For Users
- **Beautiful Modern UI**: Responsive design with gradient backgrounds, smooth animations, and intuitive navigation
- **Scheme Discovery**: Browse and search through available government schemes
- **Eligibility Checking**: Real-time eligibility assessment with detailed scoring and feedback
- **Personalized Dashboard**: View schemes, manage feedback, and track applications
- **Feedback System**: Submit, edit, and delete feedback with full CRUD operations
- **Smart Filtering**: Advanced search and filter options by department, category, and keywords

### For Administrators
- **Complete Scheme Management**: Create, edit, and delete government schemes
- **File Upload Support**: Upload multiple images for schemes
- **Admin Dashboard**: Comprehensive dashboard with scheme management tools
- **Role-based Access**: Secure admin-only access to management features

### Technical Features
- **Modern Authentication**: JWT-based authentication with role-based access control
- **Real-time Updates**: Instant feedback and notifications using toast messages
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **API Integration**: RESTful API with proper error handling
- **File Management**: Cloudinary integration for image uploads

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Toastify** - Toast notifications
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Cloud image management
- **Multer** - File upload handling

## 📁 Project Structure

```
hackathon/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API services
│   │   ├── layouts/       # Layout components
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
└── server/                # Backend Node.js application
    ├── controllers/       # Route controllers
    ├── models/           # Database models
    ├── routes/           # API routes
    ├── middlewares/      # Custom middlewares
    ├── config/          # Configuration files
    └── utils/           # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hackathon
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**

   Create `.env` file in the server directory:
   ```env
   PORT=4000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRETS=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FOLDER_NAME=your_cloudinary_folder_name
   ```

5. **Start the development servers**

   **Backend:**
   ```bash
   cd server
   npm start
   ```

   **Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📱 Key Pages & Features

### Home Page
- Hero section with call-to-action buttons
- Feature highlights with icons
- Statistics section
- Beautiful gradient backgrounds

### Authentication
- **User Signup**: Clean form with validation
- **Admin Signup**: Separate registration for administrators
- **Login**: Unified login with role-based redirection

### User Dashboard
- Eligibility checker with form inputs
- Scheme recommendations with eligibility scores
- Personal feedback management
- Real-time eligibility assessment

### Admin Dashboard
- Scheme management with CRUD operations
- File upload for scheme images
- Modal forms for creating/editing schemes
- Beautiful card-based layout

### Schemes Page
- Advanced search and filtering
- Responsive grid layout
- Tag-based categorization
- Quick apply buttons

### Scheme Detail Page
- Comprehensive scheme information
- Image gallery
- Eligibility checker sidebar
- Application links

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can browse schemes, check eligibility, submit feedback
- **Admin**: Can manage schemes, view all feedback, access admin dashboard

### Protected Routes
- User routes require "User" role
- Admin routes require "Admin" role
- JWT token validation on protected endpoints

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Blue and purple gradients
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing using Tailwind utilities
- **Animations**: Smooth transitions and hover effects

### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Collapsible navigation menu
- Touch-friendly interface

### User Experience
- Loading states with spinners
- Toast notifications for feedback
- Form validation with error messages
- Confirmation dialogs for destructive actions

## 🔧 API Endpoints

### Authentication
- `POST /api/login` - User login
- `POST /api/signup` - User registration

### Schemes
- `GET /api/getScheme` - Get all schemes
- `POST /api/createScheme` - Create new scheme (Admin only)
- `PUT /api/updateScheme/:id` - Update scheme (Admin only)
- `DELETE /api/deleteScheme/:id` - Delete scheme (Admin only)

### Feedback
- `POST /api/createFeedback` - Create feedback (User only)
- `GET /api/getallFeedback` - Get all feedback
- `PUT /api/updateFeedback/:id` - Update feedback
- `DELETE /api/deleteFeedback/:id` - Delete feedback

### Eligibility
- `POST /api/createEligibility` - Create eligibility criteria (Admin only)

## 🚀 Deployment

### Frontend Deployment
```bash
cd client
npm run build
```

### Backend Deployment
```bash
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🎯 Future Enhancements

- [ ] Email notifications
- [ ] Application tracking system
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Integration with government APIs
- [ ] Document upload functionality
- [ ] Real-time chat support

---

**Built with ❤️ for better government scheme accessibility** 