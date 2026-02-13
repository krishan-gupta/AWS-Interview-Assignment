// --- Configuration ---
const API_KEY = "df2948f9c8a8dd51686c3efa46d2d9f3";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const GENRE_MAP = {
  Action: 28,
  Adventure: 12,
  Comedy: 35,
  Drama: 18,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  Horror: 27,
  Family: 10751,
  Fantasy: 14,
  Mystery: 9648,
  Crime: 80,
};

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const elements = {
    moodInput: document.getElementById("mood-input"),
    analyzeBtn: document.getElementById("analyze-btn"),
    langSelect: document.getElementById("language-select"),
    errorMsg: document.getElementById("error-msg"),
    heroSection: document.getElementById("hero-section"),
    transitionSection: document.getElementById("transition-section"),
    resultsSection: document.getElementById("results-section"),
    moviesContainer: document.getElementById("movies-container"),
    detectedMoods: document.getElementById("detected-moods"),
    resultMoodText: document.getElementById("result-mood-text"),
    rootElement: document.getElementById("root"),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.getElementById("theme-icon"),
    resetBtn: document.getElementById("reset-btn"),
  };

  // --- 1. Analyze Mood ---
  function analyzeMood(text) {
    text = text.toLowerCase();
    let genreIds = [],
      displayGenres = [],
      mood = "Neutral";

    if (
      text.includes("sad") ||
      text.includes("cry") ||
      text.includes("breakup")
    ) {
      genreIds = [GENRE_MAP.Drama, GENRE_MAP.Romance, GENRE_MAP.Family];
      displayGenres = ["Drama", "Romance", "Comfort"];
      mood = "Comforting";
    } else if (
      text.includes("happy") ||
      text.includes("laugh") ||
      text.includes("fun")
    ) {
      genreIds = [GENRE_MAP.Comedy, GENRE_MAP.Adventure, GENRE_MAP.Fantasy];
      displayGenres = ["Comedy", "Adventure", "Fantasy"];
      mood = "Upbeat";
    } else if (
      text.includes("scared") ||
      text.includes("horror") ||
      text.includes("ghost")
    ) {
      genreIds = [GENRE_MAP.Horror, GENRE_MAP.Thriller, GENRE_MAP.Mystery];
      displayGenres = ["Horror", "Thriller", "Mystery"];
      mood = "Spooky";
    } else if (
      text.includes("action") ||
      text.includes("fight") ||
      text.includes("thrill")
    ) {
      genreIds = [GENRE_MAP.Action, GENRE_MAP.Thriller, GENRE_MAP.Crime];
      displayGenres = ["Action", "Thriller"];
      mood = "Thrilling";
    } else {
      genreIds = [GENRE_MAP.Drama, GENRE_MAP.Comedy, GENRE_MAP.Adventure];
      displayGenres = ["Drama", "Comedy"];
      mood = "Mixed Vibe";
    }
    return { mood, genreIds, displayGenres };
  }

  // --- 2. Fetch Movies ---
  async function fetchMovies(genreIds, lang) {
    try {
      // Logic: Use Pipe | for OR condition to get more results
      const genreStr = genreIds.join("|");
      const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=${lang}&with_genres=${genreStr}&page=1`;

      // *** FIXED VARIABLE TYPO HERE ***
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results) return [];

      // Filter: Must have valid poster path AND description
      let validMovies = data.results.filter(
        (m) => m.poster_path && m.overview && m.overview.length > 10,
      );

      // FALLBACK: If strict filtering returns 0, try fetching popular movies without genre strictness
      if (validMovies.length === 0) {
        console.log("No strict matches, fetching fallback...");
        const fallbackUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=${lang}&page=1`;
        const fallbackRes = await fetch(fallbackUrl);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.results) {
          validMovies = fallbackData.results.filter(
            (m) => m.poster_path && m.overview,
          );
        }
      }

      return validMovies;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  // --- 3. Handle Interaction ---
  async function handleSearch() {
    const text = elements.moodInput.value.trim();
    if (!text) {
      elements.errorMsg.classList.remove("hidden");
      return;
    }
    elements.errorMsg.classList.add("hidden");

    const analysis = analyzeMood(text);
    const lang = elements.langSelect.value;

    // UI State: Loading
    elements.heroSection.style.display = "none";
    elements.transitionSection.classList.remove("hidden");
    elements.transitionSection.style.display = "flex";

    elements.detectedMoods.innerHTML = analysis.displayGenres
      .map(
        (g) =>
          `<span class="bg-[var(--accent)] text-white px-4 md:px-6 py-2 rounded-full text-base md:text-xl font-bold animate-bounce shadow-lg">${g}</span>`,
      )
      .join("");

    // Fetch Data
    setTimeout(async () => {
      const movies = await fetchMovies(analysis.genreIds, lang);

      elements.transitionSection.style.display = "none";
      elements.rootElement.classList.remove("justify-center");
      elements.rootElement.classList.add("justify-start");

      renderMovies(movies, analysis.mood, lang);
    }, 1500);
  }

  function renderMovies(movies, mood, lang) {
    elements.resultsSection.classList.remove("hidden");
    elements.resultMoodText.innerText = `${mood} (${lang === "hi" ? "Hindi" : "English"})`;

    if (movies.length === 0) {
      elements.moviesContainer.innerHTML = `<div class="text-center col-span-full text-lg md:text-xl opacity-60">No movies found. Try different keywords.</div>`;
      return;
    }

    elements.moviesContainer.innerHTML = movies
      .map(
        (movie, index) => `
            <div class="glass-card rounded-2xl overflow-hidden group movie-card-hover relative h-full flex flex-col" 
                 style="animation: slideUp 0.5s ease-out ${index * 0.1}s forwards; opacity: 0; transform: translateY(20px);">
                <div class="relative aspect-[2/3] overflow-hidden bg-gray-800">
                    <img src="${IMAGE_URL + movie.poster_path}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         onerror="this.closest('.glass-card').style.display='none'">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span class="bg-white text-black font-bold px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            ⭐ ${movie.vote_average.toFixed(1)}
                        </span>
                    </div>
                </div>
                <div class="p-4 md:p-5 flex flex-col flex-grow">
                    <h3 class="font-bold text-base md:text-lg mb-1 leading-tight text-[var(--text-primary)] line-clamp-1">${movie.title}</h3>
                    <p class="text-sm text-[var(--accent)] font-semibold mb-3">${movie.release_date?.split("-")[0] || "N/A"}</p>
                    <p class="text-sm text-[var(--text-secondary)] line-clamp-3 leading-relaxed">${movie.overview}</p>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Reset Function
  elements.resetBtn.addEventListener("click", () => {
    elements.resultsSection.classList.add("hidden");
    elements.heroSection.style.display = "block";
    elements.rootElement.classList.add("justify-center");
    elements.rootElement.classList.remove("justify-start");
    elements.moodInput.value = "";
  });

  // Event Listeners
  elements.analyzeBtn.addEventListener("click", handleSearch);
  elements.moodInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Theme Toggle
  let isDark = true;
  elements.themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    elements.themeIcon.textContent = isDark ? "🌚" : "🌞";
  });
});
