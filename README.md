# TimeTravel - Travel Journal Application

## Table of Contents
- [About the Project](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Documentation](#api-documentation)
- [Installation](#installation)


## About

TimeTravel is a full-stack MERN application that lets users document and manage their travel experiences with rich media content.

## Features

- 🔐 Secure user authentication with JWT
- 📝 Create, edit and delete travel stories
- 📸 Upload and manage travel photos
- 📍 Tag multiple locations per story
- ⭐ Mark stories as favorites
- 🔍 Search through stories
- 📅 Filter stories by date range
- 📱 Responsive design with Tailwind CSS

## Tech Stack

- Frontend:
  - React
  - TailwindCSS
  - Axios
  - React Router DOM
  - React Day Picker
  - React Icons

- Backend:
  - Node.js & Express
  - MongoDB & Mongoose
  - JWT Authentication
  - Multer for file uploads
  - BCrypt for password hashing

- DevOps:
  - Docker
  - GitHub Actions
  - AWS EC2


## API Documentation

## **API Documentation**

### **Base URL**
`http://localhost:3000`

---

## **Endpoints**

### **Authentication**

#### **1. Create Account**
**POST** `/create-account`

**Description:** Registers a new user.

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK`: Registration successful, returns user info and access token.
- `400 Bad Request`: Missing or invalid input, or user already exists.

---

#### **2. Login**
**POST** `/login`

**Description:** Logs in an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Responses:**
- `200 OK`: Login successful, returns user info and access token.
- `400 Bad Request`: Missing input, user not found, or invalid credentials.

---

#### **3. Get User Details**
**GET** `/get-user`

**Description:** Fetches authenticated user details.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200 OK`: Returns user details.
- `401 Unauthorized`: Invalid or missing token.

---

### **Story Management**

#### **4. Add Story**
**POST** `/add-story`

**Description:** Adds a new story.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "story": "string",
  "visitedLocation": "string",
  "imageUrl": "string",
  "visitedDate": "timestamp"
}
```

**Responses:**
- `201 Created`: Story added successfully.
- `400 Bad Request`: Missing required fields.
- `500 Internal Server Error`: Error occurred during story creation.

---

#### **5. Get All Stories**
**GET** `/get-all-stories`

**Description:** Retrieves all stories for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200 OK`: Returns an array of stories.
- `500 Internal Server Error`: Error fetching stories.

---

#### **6. Edit Story**
**PUT** `/edit-story/:id`

**Description:** Edits an existing story by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "story": "string",
  "visitedLocation": "string",
  "imageUrl": "string",
  "visitedDate": "timestamp"
}
```

**Responses:**
- `200 OK`: Story updated successfully.
- `404 Not Found`: Story not found.
- `500 Internal Server Error`: Error occurred during update.

---

#### **7. Delete Story**
**DELETE** `/delete-story/:id`

**Description:** Deletes a story by ID.

**Headers:**
- `Authorization: Bearer <token>`

**Responses:**
- `200 OK`: Story deleted successfully.
- `404 Not Found`: Story not found.
- `500 Internal Server Error`: Error occurred during deletion.

---

#### **8. Update Story Favorite Status**
**PUT** `/update-is-favourite/:id`

**Description:** Updates the "isFavourite" status of a story.

**Headers:**
- `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isFavourite": "boolean"
}
```

**Responses:**
- `200 OK`: Status updated successfully.
- `404 Not Found`: Story not found.
- `500 Internal Server Error`: Error occurred during update.

---

### **Image Management**

#### **9. Upload Image**
**POST** `/image-upload`

**Description:** Uploads an image.

**Form Data:**
- `image`: File (image)

**Responses:**
- `201 Created`: Image uploaded successfully, returns URL.
- `400 Bad Request`: No image uploaded.
- `500 Internal Server Error`: Error during upload.

---

#### **10. Delete Image**
**DELETE** `/delete-image`

**Description:** Deletes an image.

**Query Parameters:**
- `imageUrl`: URL of the image to delete.

**Responses:**
- `200 OK`: Image deleted successfully.
- `400 Bad Request`: Missing `imageUrl`.
- `500 Internal Server Error`: Error during deletion.

---

### **Search and Filtering**

#### **11. Search Stories**
**GET** `/search`

**Description:** Searches stories by title, content, or location.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `query`: Search string.

**Responses:**
- `200 OK`: Returns matching stories.
- `500 Internal Server Error`: Error occurred during search.

---

#### **12. Filter Stories by Date**
**GET** `/stories/filter`

**Description:** Filters stories by date range.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate`: Timestamp (start date).
- `endDate`: Timestamp (end date).

**Responses:**
- `200 OK`: Returns filtered stories.
- `500 Internal Server Error`: Error occurred during filtering.


---


## Getting Started

### Prerequisites
- Node.js
- MongoDB
- Docker (optional)

### Environment Variables

Backend `.env`:
```env
connectionString=<your_mongodb_uri>
ACCESS_TOKEN_SECRET=<your_jwt_secret>
```

Frontend `.env`:
```env
VITE_BASE_URL=<backend_api_url>
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timetravel.git
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start backend server:
```bash
cd backend
npm start
```

2. Start frontend development server:
```bash
cd frontend
npm run dev
```

### Docker Setup

Build and run using Docker:
```bash
docker build -t timetravel .
docker run -p 3000:3000 timetravel
```
