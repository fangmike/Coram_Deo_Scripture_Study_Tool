import "./ReaderPane.css";
import { getChapter, getBooks } from "../bibleData";

function ReaderPane({ bookAbbrev, chapter }) {
  const verses = getChapter(bookAbbrev, chapter);
  const books = getBooks();
  const book = books.find((b) => b.abbrev === bookAbbrev);

  if (!verses.length) {
    return (
      <div className="reader-pane">
        <p className="reader-empty">No text found for {bookAbbrev} {chapter}.</p>
      </div>
    );
  }

  return (
    <div className="reader-pane">
      <div className="reader-heading">
        <h1 className="reader-book">{book?.name ?? bookAbbrev}</h1>
        <span className="reader-chapter">Chapter {chapter}</span>
      </div>

      <div className="reader-text">
        {verses.map(({ verse, text }) => (
          <span key={verse} className="verse">
            <sup className="verse-num">{verse}</sup>
            {text}{" "}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ReaderPane;
