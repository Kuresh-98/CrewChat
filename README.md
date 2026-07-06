# CrewChat 💬

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-brightgreen)](https://crew-chat.vercel.app)

A modern real-time chat application built with the MERN stack that enables secure one-to-one messaging with instant communication using Socket.IO. CrewChat requires users to add each other as friends using unique usernames before they can chat, ensuring privacy and control over who can message you.

---

## 🚀 Features

- **Rebranded to CrewChat**: Modern design system and updated typography.
- **Unique Username Sign-up**: Register with a unique username for easy identification.
- **Friend Invitation System**: 
  - Search other users by their unique username.
  - Send and receive friend invitations.
  - Accept or decline pending requests with real-time updates and notification badges.
  - Chat is restricted until a friend invitation is accepted.
- **Real-time Messaging**: Instant message delivery using Socket.IO.
- **Online/Offline User Status**: See who's online in real-time.
- **Image Sharing**: Send images within chat using Cloudinary storage.
- **Protected Routes**: JWT-secured endpoints and middleware.
- **Database Seeding**: Easily seed realistic user profiles for local testing.

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
- MongoDB / Mongoose
- Socket.IO
- Cloudinary
- Bcrypt.js
- JWT Authentication

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
│   ├── seed.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Kuresh-98/CrewChat.git
cd CrewChat
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Seed Database
To clear the database and seed it with 6 pre-connected genuine users (great for testing messaging right away):
```bash
npm run seed
```

#### Run the backend
```bash
npm start
```

---

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_BACKEND_URL=http://localhost:5000
```

#### Run the frontend
```bash
npm run dev
```

---

## 📡 API Endpoints

### Authentication & Users
- `POST /api/auth/signup` - Register a new user with fullName, username, email, password, and bio.
- `POST /api/auth/login` - Login with email and password.
- `PUT /api/auth/update-profile` - Update user bio, avatar, and fullName.
- `GET /api/auth/check` - Check user JWT token status.

### Friend Invitation System
- `GET /api/auth/search-user?username=...` - Search for a user globally by username and see friendship status.
- `POST /api/auth/friend-request/send` - Send a friend request.
- `GET /api/auth/friend-requests` - Get pending received friend requests.
- `POST /api/auth/friend-request/respond` - Accept or decline friend requests.

### Messages
- `GET /api/messages/users` - Fetch list of active friends (chat sidebar contacts).
- `GET /api/messages/:id` - Fetch chat history with a specific friend.
- `POST /api/messages/send/:id` - Send a text or image message.
- `PUT /api/messages/mark/:id` - Mark messages as read.

---

## 👨‍💻 Author

**Kuresh Garbada**

GitHub: [https://github.com/Kuresh-98](https://github.com/Kuresh-98)

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.