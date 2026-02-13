# CineCipher 🎬

**Unlock the perfect movie for your mood.**

CineCipher is a smart, responsive web application designed to cure "decision paralysis." Instead of manually filtering by genre, users simply describe how they feel. The application uses a custom-built weighted scoring algorithm to decode complex emotional inputs and fetch highly relevant movie recommendations from The Movie Database (TMDB).

## 🚀 Key Features

* **🧠 Intelligent Mood Analysis:** Unlike simple keyword matching, CineCipher uses a weighted scoring system. It understands nuance (e.g., *"I want to cry but also laugh"*) by assigning positive/negative points to genres based on your input.
* **🎞️ Instant Movie Details:** Click any card to open a glass-morphic modal featuring the official YouTube trailer, top cast members, runtime, and release details.
* **📱 Fully Responsive Design:** Built with a mobile-first approach, ensuring a seamless experience on phones, tablets, and desktops.
* **🌗 Dynamic Theming:** Includes a beautiful Dark/Light mode toggle with persistent state management.
* **🛡️ Robust Error Handling:** Never hit a dead end. If a specific mood search yields no results, the system intelligently falls back to top-rated movies for the selected language.
* **📅 Smart Filtering:** Automatically filters out unreleased or future movies so you only get recommendations you can watch *today*.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript (ES6+)
* **Styling:** Tailwind CSS (via CDN)
* **API:** [The Movie Database (TMDB) API](https://www.themoviedb.org/documentation/api)
* **Animations:** Custom CSS keyframes (Shimmer, Blobs, Slide-up)

## ⚙️ How It Works

1.  **Input:** The user types a phrase (e.g., *"fast paced action with no romance"*).
2.  **Analysis:** The JS engine tokenizes the input, detects negations (words like "no", "don't"), and calculates a score for every genre.
3.  **Fetch:** The top-scoring genres are sent to the TMDB API.
4.  **Filter:** Results are sanitized to ensure they have valid posters, descriptions, and have already been released.
5.  **Render:** Movies are displayed in a responsive grid with a "View Details" modal.

## 📦 Setup & Usage

Since CineCipher is built with vanilla web technologies, no build step is required!

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/krishan-gupta/cinecipher.git](https://github.com/krishan-gupta/cinecipher.git)
    ```
2.  **Open the project:**
    Simply open the `index.html` file in your browser.
    * *Tip: For the best experience, use the "Live Server" extension in VS Code.*

## 🔮 Future Improvements

* **Watchlist:** LocalStorage based "Save for Later" feature.
* **Streaming Providers:** Show where to watch the movie (Netflix, Hulu, etc.).
* **More Languages:** Expand the language selector to support Spanish, French, and more.

---

**Note:** This product uses the TMDB API but is not endorsed or certified by TMDB.
