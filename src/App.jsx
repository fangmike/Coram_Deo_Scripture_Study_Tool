import "./App.css";

function VersePanel({ reference, text }) {
  return (
    <div className="verse-panel">
      <div className="verse-reference">{reference}</div>
      <div className="verse-text">{text}</div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <VersePanel
        reference="John 3:16"
        text="For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life."
      />
    </div>
  );
}

export default App;
