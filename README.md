
# 🚀 MERN Forum 

This is a web forum app similar to Twitter(X) where I use the MERN stack to develop this application to help familiarize how web development works. This helps me get to know Typescript, TailwindCSS, React, NextJS, Node, Express, MongoDB, Nodemailer, Multer, and Firebase for my cloud storage where I store the images for deployment.

## 📸 Demo (fully functional finally) 

- https://mernforum-frontend.onrender.com


## 📂 Features

- OTP verification for email
- Cloud Storage (Firebase) Read and Write in cloud storage
    - Stored in a folder based on their ID to determine who owns the image (used Data.now() and original filename to name the image)
    - Processed file uploads using multer that only accepts PNG,JPG, GIF and 5MB of size
- Sign up and Logging in and out
- Basic CRUD for the profile, posts
- Hashed Passwords

## 🛠️ Tech Stack

**Frontend:** React, TailwindCSS, Typescript  
**Backend:** Node.js, Express, Multer, Firebase  
**Database:** MongoDB

**Others:** Nodemailer, Validator, JSON Webtokens, DotEnv, OTPGenerator, bcrypt

## These are my ENV files that I use while developing the web application
```markdown
# Add a env File [BACKEND] (.env)

- PORT=4000
- MONGO_URI=mongodb+srv://chiwasushuba:<db_password>@mernapp.9gzhw5s.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp
- SECRET=( ? ) mkns
- 
### For OTP
- EMAIL_USER=joshuaprogrammingnotes@gmail.com
- EMAIL_PASS=(passApp in google)

### For my cloud storage (firebase)
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY_ID
- FIREBASE_PRIVATE_KEY
- FIREBASE_CLIENT_EMAIL

# Add a env.local file [FRONTEND] (.env.local)
- NEXT_PUBLIC_API_URL=http://localhost:4000

```

## GGS
