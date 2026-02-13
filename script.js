// --- Configuration ---
const API_KEY = "df2948f9c8a8dd51686c3efa46d2d9f3";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500"; // --- CONFIGURATION ---
// --- CONFIGURATION ---

const GENRE_MAP = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  "Sci-Fi": 878,
  "TV Movie": 10770,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const KEYWORD_DB = {
  sad: { Drama: 5, Romance: 2 },
  cry: { Drama: 6, Romance: 3 },
  depressed: { Drama: 5 },
  happy: { Comedy: 5, Family: 3, Animation: 3 },
  laugh: { Comedy: 6 },
  fun: { Comedy: 3, Adventure: 4, Animation: 3 },
  scared: { Horror: 6, Thriller: 4 },
  fear: { Horror: 5 },
  shock: { Thriller: 5, Mystery: 3 },
  excited: { Action: 5, Adventure: 3 },
  adrenaline: { Action: 6, Thriller: 3 },
  tense: { Thriller: 5, Mystery: 4 },
  curious: { Mystery: 5, "Sci-Fi": 3, Documentary: 4 },
  smart: { "Sci-Fi": 4, Documentary: 4, Mystery: 3 },
  love: { Romance: 6, Drama: 2 },
  heartbreak: { Romance: 4, Drama: 5 },
  angry: { Action: 4, Crime: 4, War: 3 },
  space: { "Sci-Fi": 6, Adventure: 3 },
  alien: { "Sci-Fi": 6, Horror: 2 },
  future: { "Sci-Fi": 5 },
  magic: { Fantasy: 6, Family: 2 },
  wizard: { Fantasy: 6 },
  ghost: { Horror: 6, Mystery: 3 },
  gun: { Action: 4, Crime: 5 },
  fight: { Action: 5 },
  history: { History: 6, War: 4, Drama: 2 },
  war: { War: 6, Action: 3 },
  music: { Music: 6 },
  song: { Music: 5 },
  kid: { Family: 5, Animation: 5 },
  child: { Family: 5 },
  cartoon: { Animation: 6, Family: 3 },
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
    iconSun: document.getElementById("icon-sun"),
    iconMoon: document.getElementById("icon-moon"),
    resetBtn: document.getElementById("reset-btn"),
    backToTopBtn: document.getElementById("back-to-top"),
    modal: document.getElementById("movie-modal"),
    closeModal: document.getElementById("close-modal"),
    trailerFrame: document.getElementById("trailer-frame"),
    modalTitle: document.getElementById("modal-title"),
    modalGenres: document.getElementById("modal-genres"),
    modalRating: document.getElementById("modal-rating"),
    modalOverview: document.getElementById("modal-overview"),
    modalRuntime: document.getElementById("modal-runtime"),
    modalYear: document.getElementById("modal-year"),
    modalCast: document.getElementById("modal-cast"),
  };

  // --- 1. MOOD ANALYSIS ---
  function analyzeMood(text) {
    text = text.toLowerCase().replace(/[.,!?;]/g, "");
    const tokens = text.split(/\s+/);

    let genreScores = {};
    Object.keys(GENRE_MAP).forEach((g) => (genreScores[g] = 0));

    const negationWords = ["no", "not", "dont", "don't", "never", "without"];

    tokens.forEach((word, index) => {
      const prevWord = index > 0 ? tokens[index - 1] : "";
      const isNegated = negationWords.includes(prevWord);
      const multiplier = isNegated ? -2 : 1;

      if (KEYWORD_DB[word]) {
        const impacts = KEYWORD_DB[word];
        Object.keys(impacts).forEach((genre) => {
          genreScores[genre] += impacts[genre] * multiplier;
        });
      }
    });

    const sortedGenres = Object.entries(genreScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .filter(([, score]) => score > 0);

    if (sortedGenres.length === 0) {
      return {
        mood: "Mixed Bag",
        genreIds: [],
        displayGenres: ["Popular"],
      };
    }

    const topGenres = sortedGenres.slice(0, 3);
    const topGenreIds = topGenres.map(([name]) => GENRE_MAP[name]);
    const topGenreNames = topGenres.map(([name]) => name);

    const dominantGenre = topGenreNames[0];
    let moodLabel = "Custom Vibe";
    if (dominantGenre === "Comedy") moodLabel = "Upbeat & Fun";
    else if (dominantGenre === "Horror") moodLabel = "Spooky & Dark";
    else if (dominantGenre === "Drama") moodLabel = "Emotional";
    else if (dominantGenre === "Action") moodLabel = "Adrenaline Rush";
    else if (dominantGenre === "Romance") moodLabel = "Romantic";

    return {
      mood: moodLabel,
      genreIds: topGenreIds,
      displayGenres: topGenreNames,
    };
  }

  // --- 2. FETCH MOVIES ---
  async function fetchMovies(genreIds, lang) {
    try {
      const today = new Date().toISOString().split("T")[0];
      let validMovies = [];

      const isValid = (m) => {
        return (
          m.poster_path &&
          m.overview &&
          m.overview.length > 10 &&
          m.release_date &&
          m.release_date <= today
        );
      };

      // Primary Search
      if (genreIds.length > 0) {
        const genreStr = genreIds.join("|");
        const url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=${lang}&with_genres=${genreStr}&page=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.results) {
          validMovies = data.results.filter(isValid);
        }
      }

      // FALLBACK
      if (validMovies.length === 0) {
        console.log("No matches. Fetching popular fallback...");
        const fallbackUrl = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_original_language=${lang}&page=1`;
        const fallbackRes = await fetch(fallbackUrl);
        const fallbackData = await fallbackRes.json();
        if (fallbackData.results) {
          validMovies = fallbackData.results.filter(isValid);
        }
      }

      return validMovies;
    } catch (err) {
      console.error("Fetch error:", err);
      return [];
    }
  }

  // --- 3. DETAILS MODAL ---
  async function openMovieDetails(movieId) {
    try {
      const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`;
      const res = await fetch(url);
      const movie = await res.json();

      const trailer =
        movie.videos.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube",
        ) || movie.videos.results.find((v) => v.site === "YouTube");
      elements.trailerFrame.src = trailer
        ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`
        : "";

      elements.modalTitle.innerText = movie.title;
      elements.modalRating.innerText = movie.vote_average.toFixed(1);
      elements.modalOverview.innerText = movie.overview;
      elements.modalYear.innerText = movie.release_date
        ? movie.release_date.split("-")[0]
        : "N/A";

      const hours = Math.floor(movie.runtime / 60);
      const minutes = movie.runtime % 60;
      elements.modalRuntime.innerText = `${hours}h ${minutes}m`;

      elements.modalGenres.innerHTML = movie.genres
        .map(
          (g) =>
            `<span class="bg-white/10 px-3 py-1 rounded-full text-xs border border-white/10">${g.name}</span>`,
        )
        .join("");

      elements.modalCast.innerHTML = movie.credits.cast
        .slice(0, 5)
        .map(
          (actor) => `
                <div class="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                    <img src="${actor.profile_path ? IMAGE_URL + actor.profile_path : "https://via.placeholder.com/50"}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                        <p class="font-bold text-sm leading-tight">${actor.name}</p>
                        <p class="text-xs text-gray-400 leading-tight">${actor.character}</p>
                    </div>
                </div>
            `,
        )
        .join("");

      elements.modal.classList.remove("hidden");
      setTimeout(() => elements.modal.classList.remove("opacity-0"), 10);
    } catch (err) {
      console.error(err);
    }
  }

  function closeModal() {
    elements.modal.classList.add("opacity-0");
    elements.trailerFrame.src = "";
    setTimeout(() => elements.modal.classList.add("hidden"), 300);
  }

  // --- 4. RENDER UI ---
  function renderMovies(movies, mood, lang) {
    elements.resultsSection.classList.remove("hidden");
    elements.resultMoodText.innerText = `${mood} (${lang === "hi" ? "Hindi" : "English"})`;

    if (movies.length === 0) {
      elements.moviesContainer.innerHTML = `<div class="text-center col-span-full text-lg md:text-xl opacity-60">No movies found. The API might be busy. Try again!</div>`;
      return;
    }

    elements.moviesContainer.innerHTML = movies
      .map(
        (movie, index) => `
            <div class="glass-card rounded-2xl overflow-hidden group movie-card-hover relative h-full flex flex-col cursor-pointer" 
                 onclick="window.openMovieDetails(${movie.id})"
                 style="animation: slideUp 0.5s ease-out ${index * 0.1}s forwards; opacity: 0; transform: translateY(20px);">
                <div class="relative aspect-[2/3] overflow-hidden bg-gray-800">
                    <img src="${IMAGE_URL + movie.poster_path}" 
                         class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         onerror="this.closest('.glass-card').style.display='none'">
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <span class="bg-white text-black font-bold px-4 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            View Details
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

  // --- 5. EVENT LISTENERS ---
  window.openMovieDetails = openMovieDetails;
  elements.closeModal.addEventListener("click", closeModal);
  elements.modal.addEventListener("click", (e) => {
    if (e.target === elements.modal) closeModal();
  });

  async function handleSearch() {
    const text = elements.moodInput.value.trim();
    if (!text) {
      elements.errorMsg.classList.remove("hidden");
      return;
    }
    elements.errorMsg.classList.add("hidden");

    const analysis = analyzeMood(text);
    const lang = elements.langSelect.value;

    elements.heroSection.style.display = "none";
    elements.transitionSection.classList.remove("hidden");
    elements.transitionSection.style.display = "flex";
    elements.detectedMoods.innerHTML = analysis.displayGenres
      .map(
        (g) =>
          `<span class="bg-[var(--accent)] text-white px-4 md:px-6 py-2 rounded-full text-base md:text-xl font-bold animate-bounce shadow-lg">${g}</span>`,
      )
      .join("");

    setTimeout(async () => {
      const movies = await fetchMovies(analysis.genreIds, lang);
      elements.transitionSection.style.display = "none";
      elements.rootElement.classList.remove("justify-center");
      elements.rootElement.classList.add("justify-start");
      renderMovies(movies, analysis.mood, lang);
    }, 1500);
  }

  elements.resetBtn.addEventListener("click", () => {
    elements.resultsSection.classList.add("hidden");
    elements.heroSection.style.display = "block";
    elements.rootElement.classList.add("justify-center");
    elements.rootElement.classList.remove("justify-start");
    elements.moodInput.value = "";
  });

  elements.analyzeBtn.addEventListener("click", handleSearch);
  elements.moodInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });

  // Theme
  let isDark = true;

  // FORCE INITIAL SYNC
  if (isDark) {
    elements.iconMoon.classList.add("hidden");
    elements.iconSun.classList.remove("hidden");
  }

  elements.themeToggle.addEventListener("click", () => {
    isDark = !isDark;
    document.documentElement.setAttribute(
      "data-theme",
      isDark ? "dark" : "light",
    );
    if (isDark) {
      elements.iconMoon.classList.add("hidden");
      elements.iconSun.classList.remove("hidden");
    } else {
      elements.iconMoon.classList.remove("hidden");
      elements.iconSun.classList.add("hidden");
    }
  });

  // Back to Top
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      elements.backToTopBtn.classList.add("show-scroll");
    } else {
      elements.backToTopBtn.classList.remove("show-scroll");
    }
  });

  elements.backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});
