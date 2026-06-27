import "./Navbar.css";
import { getBooks } from "../bibleData";

// OT ends at id 39 (Malachi), NT starts at 40 (Matthew)
const OT_LAST_ID = 39;

function Navbar({ bookAbbrev, chapter, totalChapters, onPrev, onNext, onBookClick, onChapterClick }) {
  const books = getBooks();
  const book = books.find((b) => b.abbrev === bookAbbrev);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* App wordmark */}
        <div className="navbar-brand">Coram Deo</div>

        {/* Navigation: book · chapter */}
        <nav className="navbar-nav">
          <button
            className="nav-btn nav-btn--book"
            onClick={onBookClick}
            title="Choose book"
          >
            {book?.name ?? bookAbbrev}
          </button>

          <span className="nav-sep">·</span>

          <button
            className="nav-btn nav-btn--chapter"
            onClick={onChapterClick}
            title="Choose chapter"
          >
            Ch. {chapter}
          </button>
        </nav>

        {/* Prev / Next */}
        <div className="navbar-arrows">
          <button
            className="arrow-btn"
            onClick={onPrev}
            disabled={chapter <= 1}
            aria-label="Previous chapter"
          >
            ←
          </button>
          <button
            className="arrow-btn"
            onClick={onNext}
            disabled={chapter >= totalChapters}
            aria-label="Next chapter"
          >
            →
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
