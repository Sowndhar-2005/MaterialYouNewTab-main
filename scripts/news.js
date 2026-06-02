/*
 * Material You NewTab - Multi-Category News Widget
 * Fetches and displays latest tech, AI, developer, and anime news using standard RSS feeds.
 */

document.addEventListener("DOMContentLoaded", function () {
    const newsList = document.getElementById("newsList");
    const newsReadMore = document.getElementById("newsReadMore");
    const newsRefreshBtn = document.getElementById("newsRefreshBtn");
    const tabButtons = document.querySelectorAll(".news-tab");

    if (!newsList || !newsReadMore) return;

    // Separate category configs (Feeds, View More URL, Fallbacks)
    const CATEGORY_CONFIG = {
        ai: {
            feeds: [
                "https://openai.com/news/rss.xml",
                "https://blog.google/technology/ai/rss/",
                "https://www.anthropic.com/news.rss",
                "https://huggingface.co/blog/feed.xml",
                "https://blogs.microsoft.com/ai/feed/"
            ],
            viewMoreUrl: "https://news.google.com/search?q=artificial+intelligence",
            fallbacks: [
                { title: "OpenAI launches new GPT models with enhanced reasoning abilities", link: "https://openai.com" },
                { title: "Google DeepMind introduces advanced agents for daily tasks", link: "https://deepmind.google" },
                { title: "Anthropic updates Claude with multimodal computer use capabilities", link: "https://anthropic.com" },
                { title: "Hugging Face surpasses 1 million open-source AI models", link: "https://huggingface.co" },
                { title: "Microsoft integrates deeper agentic workflows into Copilot suite", link: "https://blogs.microsoft.com/ai/" }
            ]
        },
        anime: {
            feeds: [
                "https://www.animenewsnetwork.com/all/rss.xml",
                "https://www.crunchyroll.com/news/feed",
                "https://myanimelist.net/rss/news.xml"
            ],
            viewMoreUrl: "https://www.animenewsnetwork.com",
            fallbacks: [
                { title: "Top-rated anime series receives surprise movie sequel announcement", link: "https://animenewsnetwork.com" },
                { title: "Crunchyroll Anime Awards reveals full list of nominees", link: "https://crunchyroll.com" },
                { title: "Highly anticipated dark fantasy anime scheduled for Fall release", link: "https://myanimelist.net" },
                { title: "New light novel adaptation tops active streaming charts", link: "https://crunchyroll.com" },
                { title: "Classic retro anime series announced for high-definition remaster", link: "https://animenewsnetwork.com" }
            ]
        },
        dev: {
            feeds: [
                "https://dev.to/feed",
                "https://news.ycombinator.com/rss",
                "https://feeds.feedburner.com/TechCrunch/",
                "https://www.theverge.com/rss/index.xml"
            ],
            viewMoreUrl: "https://dev.to",
            fallbacks: [
                { title: "TypeScript 5.x introduces advanced static analysis features", link: "https://dev.to" },
                { title: "React 19 officially hits stable with Server Components updates", link: "https://react.dev" },
                { title: "Ollama adds support for direct hosting of custom vision models", link: "https://ollama.com" },
                { title: "Modern CSS features like container queries gain universal support", link: "https://caniuse.com" },
                { title: "Hugging Face expands JS libraries for client-side local models", link: "https://huggingface.co" }
            ]
        },
        general: {
            feeds: [
                "https://news.google.com/rss",
                "https://feeds.bbci.co.uk/news/rss.xml"
            ],
            viewMoreUrl: "https://news.google.com",
            fallbacks: [
                { title: "Global summits focus on renewable energy and climate frameworks", link: "https://news.google.com" },
                { title: "Space exploration mission successfully completes lunar orbital entry", link: "https://bbc.com/news" },
                { title: "Major technical standard adopted for secure passwordless logins", link: "https://news.google.com" },
                { title: "International trade agreements aim to stabilize supply chain routes", link: "https://bbc.com/news" },
                { title: "Historic archaeological discovery found in southern European cavern", link: "https://news.google.com" }
            ]
        }
    };

    // Specific developer focus keywords
    const DEV_KEYWORDS = [
        "react", "angular", "typescript", "html", "css", ".net", "dotnet",
        "ai tool", "ollama", "hugging face", "huggingface", "open source", 
        "javascript", "node", "frontend", "backend", "web dev", "programming",
        "developer", "coding", "software", "api", "git", "github"
    ];

    // Selected state
    let activeCategory = localStorage.getItem("news_widget_active_category") || "ai";
    let categoryOffsets = {
        ai: 0,
        anime: 0,
        dev: 0,
        general: 0
    };

    // Clean feed source attributions from titles
    function cleanTitle(title) {
        if (!title) return "";
        let cleaned = title
            .replace(/\s*[-–—|]\s*(TechCrunch|The Verge|OpenAI|Google AI|Anthropic|Hugging Face|Microsoft|BBC News|Google News|AP News|Reuters|Crunchyroll|MyAnimeList|Anime News Network|ANN)\s*$/i, "")
            .trim();
        if (cleaned.length > 80) {
            cleaned = cleaned.substring(0, 77) + "...";
        }
        return cleaned;
    }

    // Prioritize developer/tech topics based on key requirements
    function prioritizeDevNews(items) {
        return items.sort((a, b) => {
            const aHasKey = DEV_KEYWORDS.some(kw => a.title.toLowerCase().includes(kw));
            const bHasKey = DEV_KEYWORDS.some(kw => b.title.toLowerCase().includes(kw));
            if (aHasKey && !bHasKey) return -1;
            if (!aHasKey && bHasKey) return 1;
            return 0; // Maintain original relative chronological ordering
        });
    }

    // Render loading skeletons to prevent layout shift
    function renderSkeleton() {
        newsList.innerHTML = `
            <div class="news-skeleton">
                <div class="news-skeleton-item"><span class="skeleton-bullet"></span><span class="skeleton-text"></span></div>
                <div class="news-skeleton-item"><span class="skeleton-bullet"></span><span class="skeleton-text"></span></div>
                <div class="news-skeleton-item"><span class="skeleton-bullet"></span><span class="skeleton-text"></span></div>
            </div>
        `;
    }

    // Fetch and sort category items
    async function fetchCategoryNews(category, forceRefresh = false) {
        const config = CATEGORY_CONFIG[category];
        if (!config) return [];

        const cacheKey = `news_widget_cache_${category}`;
        const cacheTimeKey = `news_widget_cache_time_${category}`;
        const cacheDuration = 30 * 60 * 1000; // 30 minutes

        // Load from cache if valid
        if (!forceRefresh) {
            const cached = localStorage.getItem(cacheKey);
            const cachedTime = localStorage.getItem(cacheTimeKey);
            if (cached && cachedTime && (Date.now() - parseInt(cachedTime)) < cacheDuration) {
                try {
                    return JSON.parse(cached);
                } catch (e) {
                    // Ignore corrupted cache
                }
            }
        }

        const items = [];
        const fetchPromises = config.feeds.map(async (feedUrl) => {
            const encodedUrl = encodeURIComponent(feedUrl);
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                const data = await response.json();
                if (data && data.status === "ok" && data.items) {
                    data.items.forEach(item => {
                        items.push({
                            title: cleanTitle(item.title),
                            link: item.link || config.viewMoreUrl,
                            pubDate: item.pubDate ? new Date(item.pubDate).getTime() : Date.now()
                        });
                    });
                }
            } catch (error) {
                console.warn(`Failed fetching RSS feed (${feedUrl}):`, error);
            }
        });

        // Resolve parallel requests safely
        await Promise.allSettled(fetchPromises);

        if (items.length > 0) {
            // Sort by publish date descending
            items.sort((a, b) => b.pubDate - a.pubDate);

            // Special keyword boosting for Developer news
            let processedItems = items;
            if (category === "dev") {
                processedItems = prioritizeDevNews(items);
            }

            // Title-based de-duplication
            const seenTitles = new Set();
            const uniqueItems = [];
            for (const item of processedItems) {
                const clean = item.title.toLowerCase().trim();
                if (!seenTitles.has(clean)) {
                    seenTitles.add(clean);
                    uniqueItems.push(item);
                }
            }

            const sliced = uniqueItems.slice(0, 30);

            // Cache data
            localStorage.setItem(cacheKey, JSON.stringify(sliced));
            localStorage.setItem(cacheTimeKey, Date.now().toString());

            return sliced;
        }

        // Return curated fallbacks if network fails completely (offline support)
        return config.fallbacks;
    }

    // Render loaded articles (maximum of 3) starting from an offset
    function renderNewsItems(items, offset = 0) {
        if (!items || items.length === 0) {
            newsList.innerHTML = `<div class="news-item news-loading"><span class="news-bullet"></span><span class="news-text">No articles found.</span></div>`;
            return;
        }

        newsList.innerHTML = "";
        
        // Cycle slice based on offset
        let visibleItems = [];
        const count = items.length;
        if (count <= 3) {
            visibleItems = items;
        } else {
            // Get 3 items starting from offset, wrapping around if necessary
            for (let i = 0; i < 3; i++) {
                const idx = (offset + i) % count;
                visibleItems.push(items[idx]);
            }
        }

        visibleItems.forEach((news, index) => {
            const item = document.createElement("div");
            item.className = "news-item";
            item.style.animationDelay = `${index * 0.08}s`;

            const bullet = document.createElement("span");
            bullet.className = "news-bullet";

            const text = document.createElement("a");
            text.className = "news-text";
            text.textContent = news.title;
            text.href = news.link;
            text.target = "_blank";
            text.rel = "noopener noreferrer";
            text.title = news.title;

            item.appendChild(bullet);
            item.appendChild(text);
            newsList.appendChild(item);
        });
    }

    // Load category workflow
    async function loadCategory(category, forceRefresh = false, cycleCachedOnly = false) {
        activeCategory = category;
        localStorage.setItem("news_widget_active_category", category);

        // Highlight active tab
        tabButtons.forEach(btn => {
            btn.classList.toggle("active", btn.getAttribute("data-category") === category);
        });

        // Update read/view more link
        if (CATEGORY_CONFIG[category]) {
            newsReadMore.href = CATEGORY_CONFIG[category].viewMoreUrl;
        }

        if (cycleCachedOnly) {
            // Cycle instantly from cached items without showing loading skeleton
            const cacheKey = `news_widget_cache_${category}`;
            const cached = localStorage.getItem(cacheKey);
            let items = [];
            if (cached) {
                try {
                    items = JSON.parse(cached);
                } catch (e) {}
            }
            if (items.length === 0) {
                items = CATEGORY_CONFIG[category]?.fallbacks || [];
            }

            if (items.length > 3) {
                // Cycle the offset by 3
                categoryOffsets[category] = (categoryOffsets[category] + 3) % items.length;
            }
            renderNewsItems(items, categoryOffsets[category]);

            // Silently fetch and update cache in the background for next cycle
            fetchCategoryNews(category, true).catch(err => console.warn("Background news fetch failed:", err));
            return;
        }

        renderSkeleton();

        try {
            const items = await fetchCategoryNews(category, forceRefresh);
            
            if (forceRefresh && items.length > 3) {
                // Advance the offset by 3 to show other articles on reload, wrapping around
                categoryOffsets[category] = (categoryOffsets[category] + 3) % items.length;
            } else if (!forceRefresh) {
                // Reset offset to 0 when changing tabs or initial load
                categoryOffsets[category] = 0;
            }

            renderNewsItems(items, categoryOffsets[category]);
        } catch (error) {
            console.error("Error loading news category:", error);
            renderNewsItems(CATEGORY_CONFIG[category]?.fallbacks || [], 0);
        }
    }

    // Set up tab events
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const cat = btn.getAttribute("data-category");
            if (cat && cat !== activeCategory) {
                loadCategory(cat);
            }
        });
    });

    // Refresh click handler
    if (newsRefreshBtn) {
        newsRefreshBtn.addEventListener("click", async () => {
            if (newsRefreshBtn.classList.contains("spinning")) return;

            newsRefreshBtn.classList.add("spinning");
            await loadCategory(activeCategory, false, true);
            
            // Allow animation to complete smoothly before allowing next click
            setTimeout(() => {
                newsRefreshBtn.classList.remove("spinning");
            }, 850);
        });
    }

    // Auto refresh every 30 minutes
    setInterval(() => {
        loadCategory(activeCategory, true);
    }, 30 * 60 * 1000);

    // Initial load
    loadCategory(activeCategory);
});
