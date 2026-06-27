import { useState, useEffect, useCallback } from "react";
import { loadData, getAllChapterCounts } from "./bibleData";
import Navbar from "./components/Navbar";
import BookSelector from "./components/BookSelector";
import ChapterSelector from "./components/ChapterSelector";
import ReaderPane from "./components/ReaderPane";
import "./App.css";

// ─── Persistence helpers ──────────────────────────────
const STORAGE_KEY = "coram-deo-position";

function loadSavedPosition() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function savePosition(abbrev, chapter) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ abbrev, chapter }));
  } catch {}
}

// ─── App ──────────────────────────────────────────────
const DEFAULT_BOOK = "John";
const DEFAULT_CHAPTER = 1;

function App() {
  const [ready, setReady] = useState(false);
  const [chapterCounts, setChapterCounts] = useState({});
  const [bookAbbrev, setBookAbbrev] = useState(DEFAULT_BOOK);
  const [chapter, setChapter] = useState(DEFAULT_CHAPTER);
  const [showBooks, setShowBooks] = useState(false);
  const [showChapters, setShowChapters] = useState(false);

  // Load data, build chapter counts, restore saved position
  useEffect(() => {
    loadData().then(() => {
      const counts = getAllChapterCounts();
      setChapterCounts(counts);

      const saved = loadSavedPosition();
      if (
        saved &&
        counts[saved.abbrev] &&
        saved.chapter >= 1 &&
        saved.chapter <= counts[saved.abbrev]
      ) {
        setBookAbbrev(saved.abbrev);
        setChapter(saved.chapter);
      }

      setReady(true);
    });
  }, []);

  // Persist position
  useEffect(() => {
    if (ready) savePosition(bookAbbrev, chapter);
  }, [bookAbbrev, chapter, ready]);

  // ── Derived
  const totalChapters = chapterCounts[bookAbbrev] ?? 1;

  // ── Navigation
  const goToPrev = useCallback(() => setChapter((c) => Math.max(1, c - 1)), []);
  const goToNext = useCallback(
    () => setChapter((c) => Math.min(totalChapters, c + 1)),
    [totalChapters],
  );

  const selectBook = useCallback((abbrev) => {
    setBookAbbrev(abbrev);
    setChapter(1);
  }, []);

  // ── Keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "Escape") {
        setShowBooks(false);
        setShowChapters(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goToPrev, goToNext]);

  // ── Scroll top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [bookAbbrev, chapter]);

  if (!ready) {
    return <div className="loading">Loading…</div>;
  }

  return (
    <div className="app">
      <Navbar
        bookAbbrev={bookAbbrev}
        chapter={chapter}
        totalChapters={totalChapters}
        onPrev={goToPrev}
        onNext={goToNext}
        onBookClick={() => {
          setShowBooks(true);
          setShowChapters(false);
        }}
        onChapterClick={() => {
          setShowChapters(true);
          setShowBooks(false);
        }}
      />

      <ReaderPane bookAbbrev={bookAbbrev} chapter={chapter} />

      {showBooks && (
        <BookSelector
          currentAbbrev={bookAbbrev}
          onSelect={selectBook}
          onClose={() => setShowBooks(false)}
        />
      )}

      {showChapters && (
        <ChapterSelector
          totalChapters={totalChapters}
          currentChapter={chapter}
          onSelect={setChapter}
          onClose={() => setShowChapters(false)}
        />
      )}
    </div>
  );
}

export default App;
