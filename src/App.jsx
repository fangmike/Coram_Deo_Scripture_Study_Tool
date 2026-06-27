import { useState, useEffect } from "react";
import { loadData, getVerse, getCrossRefs, formatRef } from "./bibleData";
import "./App.css";

function VersePanel({ abbrev, chapter, verse }) {
  const text = getVerse(abbrev, chapter, verse);
  const refs = getCrossRefs(abbrev, chapter, verse);
  const reference = formatRef(abbrev, chapter, verse);

  return (
    <div className="verse-panel">
      <div className="verse-reference">{reference}</div>
      <div className="verse-text">{text ?? "Verse not found"}</div>
      {refs.length > 0 && (
        <div className="cross-refs">
          <div className="cross-refs-label">Cross References</div>
          <ul>
            {refs.map((r) => (
              <li key={r.ref}>{formatRef(r.abbrev, r.chapter, r.verse)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadData().then(() => setReady(true));
  }, []);

  if (!ready) {
    return <div className="loading">Loading scripture data...</div>;
  }

  return (
    <div className="app">
      <VersePanel abbrev="John" chapter="3" verse="15" />
    </div>
  );
}

export default App;
