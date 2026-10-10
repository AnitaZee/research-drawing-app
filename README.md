Research Drawing App

A small interactive drawing application created for my Capstone Research Milestone. The goal of this project was to experiment with different frontend and backend technologies and explore how they could be used in our team's capstone project.

Technologies Used

Frontend: React (JavaScript/JSX), Vite, Tailwind CSS, HTML5 Canvas API, Anime.js

Backend: Node.js,Express.js, Socket.IO

Development Tools: Git and GitHub,npm,VS Code, Ubuntu/WSL

Features: Draw on an HTML5 canvas, Change brush colors and sizes,
Switch between brush and eraser, Clear the canvas, Submit drawings to a shared gallery,
View drawings in real time across connected browser tabs using Socket.IO
Animate submitted drawings using Anime.js

Running the Project:
1. Start the backend

cd server
npm install
node index.js

The backend runs on port 3001.

2. Start the frontend in a separate terminal

cd client
npm install
npm run dev

Open http://localhost:5173 in your browser.

To test real-time communication, open the application in two browser tabs. Select Main Display in one tab and Controller in the other. Draw something and submit it to see it appear in the gallery.

Research Takeaways

This project helped me get hands-on experience with React, frontend styling, canvas-based drawing, animations, and real-time client-server communication.

Socket.IO was particularly useful for understanding how multiple clients can communicate through a shared server, which may be valuable for our team's multiplayer capstone project.

TypeScript was also considered, but JavaScript was sufficient for this prototype.
