# 🚀 MERN Forum
![MERN Stack](https://img.shields.io/badge/MERN-Stack-4DB33D?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-4DB33D?logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?logo=tailwind-css&logoColor=white)
![Amazon S3](https://img.shields.io/badge/Amazon%20S3-569A31?logo=amazons3&logoColor=white)


A web forum application inspired by Twitter (X), built using the **MERN stack**.  
This project helped me strengthen my skills in **TypeScript, TailwindCSS, React, Next.js, Node.js, Express, MongoDB**, and other modern web technologies.  
It also integrates **Firebase** for cloud storage. (I just migrated to S3 because of issues with payment using GCP)

---

## 📂 Features

- **OTP email verification**
- **Cloud Storage (Firebase)** – organized by user ID  
  - Filenames generated with `Date.now()` + original filename  
  - Multer for file uploads (PNG, JPG, GIF only, max 5MB)
- **Authentication** – Sign up, log in, log out
- **Basic CRUD** – Profiles and posts
- **Security** – Hashed passwords

---

## 🛠️ Tech Stack

**Frontend:** React, TailwindCSS, TypeScript  
**Backend:** Node.js, Express, Multer, Firebase  
**Database:** MongoDB  

**Others:** Nodemailer, Validator, JSON Web Tokens (JWT), DotEnv, OTP Generator, bcrypt

---

## 🔑 Environment Variables

This project requires both backend (`.env`) and frontend (`.env.local`) configuration.  
To prevent exposing sensitive information, please **contact me directly** for the exact `.env` setup.

---

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chiwasushuba/MERNForum.git
   cd MERNForum
2. **Install dependencies**
   ```bash
   # Backend
    cd backend
    npm install
    
    # Frontend
    cd ../frontend
    npm install
   ```
3. **Set up environment variables (ask me for details)**
4. Run the application
   ```bash
    # Backend
    cd backend
    npm run dev
    
    # Frontend
    cd ../frontend
    npm run dev
   ```
---

## Notes
- Image uploads are stored in Firebase Storage and organized per user.
- Passwords are encrypted with bcrypt.
- OTP email verification is handled via Nodemailer.
