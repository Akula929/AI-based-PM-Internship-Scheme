# AI JOB PORTAL - COMPLETE SETUP (FINAL SIMPLE GUIDE)

First install these software in your system:

* Node.js (download and install from official website)
* MongoDB Community Server (install locally)
* VS Code (optional but recommended)

After installing MongoDB:

* Open terminal
* Run:
  mongod

(leave it running, this starts your database)

Now install all required libraries:

npm install express mongoose cors multer nodemon jspdf dotenv groq-sdk
npm install react react-dom

Now backend setup:

* Open terminal

* Go to backend folder:
  cd backend

* Install packages:
  npm install

* Start backend:
  node server.js

Backend will run on:
http://localhost:5000

Make sure MongoDB is connected using:
mongodb://127.0.0.1:27017/jobportal

Now setup Groq AI:

* Go to Groq website

* Create account

* Generate API key

* Inside backend folder create a file:
  .env

* Add your key:
  GROQ_API_KEY=your_api_key_here

* Save file

Now frontend setup:

* Open new terminal

* Go to frontend folder:
  cd frontend

* Install packages:
  npm install

* Start frontend:
  npm run dev

Open browser:
http://localhost:5173

For file upload:

* Make sure "uploads" folder exists inside backend
* Resume will be saved there

For PDF download:

* jspdf is already installed
* It is used to generate and download PDF files

Important rules:

* Always use FormData for resume upload
* Do NOT use JSON for file upload
* MongoDB must be running before backend
* .env file must be present for Groq AI
* Each user uploads their own resume

If error happens:

* Stop server:
  CTRL + C

* Restart backend:
  node server.js

Final working:

* Student uploads resume and applies
* Data saved in MongoDB
* Recruiter sees applications
* Resume is unique for each user
* Groq AI matches jobs and ranks candidates
* PDF download works

Done.
