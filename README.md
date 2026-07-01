# CrewChat 💬

A modern real-time chat application built with the MERN stack that enables secure one-to-one messaging with instant communication using Socket.IO. CrewChat provides authentication, online user status, media sharing, and a responsive user interface for a seamless chatting experience.

---

## 🚀 Features

- User Authentication (JWT)
- Secure Login & Registration
- Real-time Messaging using Socket.IO
- Online/Offline User Status
- Image Sharing with Cloudinary
- Protected Routes
- Responsive User Interface
- MongoDB Database Integration
- RESTful API Architecture

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Cloudinary
- Bcrypt.js

---

## 📂 Project Structure

```
CrewChat/
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── lib/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/Kuresh-98/CrewChat.git
```

### Navigate into the project

```bash
cd CrewChat
```

---

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the server directory.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend

```bash
npm start
```

---

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 📡 API Features

- User Registration
- User Login
- Logout
- Update Profile
- Send Messages
- Receive Messages
- Upload Images
- Get Chat History

---

## 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Routes
- Environment Variable Configuration

---

## 📸 Screenshots

Add screenshots of:

- Login Page
- Registration Page
- Chat Dashboard
- Messaging Screen
- Profile Page

---

## 📈 Future Enhancements

- Group Chats
- Voice Calling
- Video Calling
- Message Reactions
- Read Receipts
- Typing Indicators
- Push Notifications
- Message Search

---

## 👨‍💻 Author

**Kuresh Garbada**

GitHub: https://github.com/Kuresh-98

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.