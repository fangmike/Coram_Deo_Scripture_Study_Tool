import "./Selectors.css";
import { getBooks } from "../bibleData";

// Books 1–39 are OT, 40–66 are NT
const OT_LAST_ID = 39;

function BookSelector({ currentAbbrev, onSelect, onClose }) {
  const books = getBooks();
  const ot = books.filter((b) => b.id <= OT_LAST_ID);
  const nt = books.filter((b) => b.id > OT_LAST_ID);

  function handleSelect(abbrev) {
    onSelect(abbrev);
    onClose();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="book-selector" onClick={(e) => e.stopPropagation()}>
        <div className="selector-header">
          <span className="selector-title">Select a book</span>
          <button className="selector-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="testament-columns">
          <div className="testament">
            <div className="testament-label">Old Testament</div>
            <div className="book-list">
              {ot.map((b) => (
                <button
                  key={b.abbrev}
                  className={`book-btn ${b.abbrev === currentAbbrev ? "book-btn--active" : ""}`}
                  onClick={() => handleSelect(b.abbrev)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          <div className="testament-divider" />

          <div className="testament">
            <div className="testament-label">New Testament</div>
            <div className="book-list">
              {nt.map((b) => (
                <button
                  key={b.abbrev}
                  className={`book-btn ${b.abbrev === currentAbbrev ? "book-btn--active" : ""}`}
                  onClick={() => handleSelect(b.abbrev)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookSelector;
