# MoodFlix 🎬 - AI Movie Recommender

MoodFlix is a sleek, responsive web application that suggests movies based on your current emotional state. This project was developed as part of the recruitment process for the **AWS Cloud Club at VIT Chennai** to demonstrate proficiency in frontend development, API integration, and dynamic UI design.

[Live Demo](https://aws-interview-assignment.vercel.app/)

---

## 🚀 Features

* **Mood Analysis Engine:** Uses keyword detection (e.g., "sad", "happy", "action") to map user emotions to specific movie genres.
* **Bilingual Support:** Offers movie recommendations for both English (EN) and Hindi (HI) languages.
* **Dynamic UI/UX:** Features a modern glassmorphism design, interactive blob background animations, and smooth transitions.
* **Real-time API Integration:** Fetches live data from The Movie Database (TMDB), including posters, ratings, and plot summaries.
* **Theme Toggle:** Includes a dark and light mode switcher to suit user preference.
* **Responsive Grid:** A fully responsive layout that adapts from mobile devices to large desktops.

## 🛠️ Tech Stack

* **HTML5:** Structural foundation of the application.
* **Tailwind CSS:** Used for rapid, utility-first styling and responsive design.
* **JavaScript (ES6+):** Handles the core logic, mood analysis, and asynchronous API calls.
* **Deployment:** Hosted and deployed via Vercel.

## 🌐 API Used

This project integrates with **The Movie Database (TMDB) API** to provide dynamic content:
* **Functionality:** The app filters movies by `genre_ids` and `original_language` based on user input to provide curated results.
* **Data Points:** Displays movie titles, release years, vote averages (ratings), and overviews.

## 📂 Project Structure

* `index.html`: The main entry point and UI skeleton.
* `script.js`: Contains the mood analysis logic and API fetch functions.
* `styles.css`: Defines the custom variables, glassmorphism effects, and keyframe animations.

---

Developed with ❤️ by Krishan Gupta
