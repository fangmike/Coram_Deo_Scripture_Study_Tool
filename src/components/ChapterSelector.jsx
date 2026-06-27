import "./Selectors.css";
function ChapterSelector({ totalChapters, currentChapter, onSelect, onClose }) {
  const chapters = Array.from({ length: totalChapters }, (_, i) => i + 1);

  function handleSelect(ch) {
    onSelect(ch);
    onClose();
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div className="chapter-selector" onClick={(e) => e.stopPropagation()}>
        <div className="selector-header">
          <span className="selector-title">Select a chapter</span>
          <button className="selector-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="chapter-grid">
          {chapters.map((ch) => (
            <button
              key={ch}
              className={`chapter-btn ${ch === currentChapter ? "chapter-btn--active" : ""}`}
              onClick={() => handleSelect(ch)}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChapterSelector;
