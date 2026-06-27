// bibleData.js
// Loads and queries Bible text and cross-reference data from public/data/

let bible = null;
let crossrefs = null;
let books = null;

async function loadData() {
  if (bible && crossrefs && books) return;

  const [bibleRes, crossrefsRes, booksRes] = await Promise.all([
    fetch("/data/bible.json"),
    fetch("/data/crossrefs.json"),
    fetch("/data/books.json"),
  ]);

  bible = await bibleRes.json();
  crossrefs = await crossrefsRes.json();
  books = await booksRes.json();
}

/**
 * Get a single verse.
 * @param {string} abbrev - Book abbreviation, e.g. "John"
 * @param {number|string} chapter
 * @param {number|string} verse
 * @returns {string|null} verse text, or null if not found
 */
export function getVerse(abbrev, chapter, verse) {
  return bible?.[abbrev]?.[String(chapter)]?.[String(verse)] ?? null;
}

/**
 * Get all verses in a chapter.
 * @param {string} abbrev
 * @param {number|string} chapter
 * @returns {Array<{verse: string, text: string}>}
 */
export function getChapter(abbrev, chapter) {
  const ch = bible?.[abbrev]?.[String(chapter)];
  if (!ch) return [];
  return Object.entries(ch).map(([verse, text]) => ({ verse, text }));
}

/**
 * Get cross-references for a verse.
 * @param {string} abbrev - e.g. "John"
 * @param {number|string} chapter
 * @param {number|string} verse
 * @returns {Array<{abbrev: string, chapter: string, verse: string, ref: string}>}
 */
export function getCrossRefs(abbrev, chapter, verse) {
  const key = `${abbrev}.${chapter}.${verse}`;
  const refs = crossrefs?.[key] ?? [];
  return refs.map((ref) => {
    const [b, c, v] = ref.split(".");
    return { abbrev: b, chapter: c, verse: v, ref };
  });
}

/**
 * Get book metadata list.
 * @returns {Array<{id: number, abbrev: string, name: string}>}
 */
export function getBooks() {
  return books ?? [];
}

/**
 * Parse a cross-ref string like "John.3.16" into parts.
 */
export function parseRef(ref) {
  const [abbrev, chapter, verse] = ref.split(".");
  return { abbrev, chapter, verse };
}

/**
 * Format a ref as a human-readable string, e.g. "John 3:16"
 */
export function formatRef(abbrev, chapter, verse) {
  return `${abbrev} ${chapter}:${verse}`;
}

export { loadData };

/**
 * Get number of chapters in a book.
 * @param {string} abbrev
 * @returns {number}
 */
export function getChapterCount(abbrev) {
  const book = bible?.[abbrev];
  if (!book) return 0;
  return Object.keys(book).length;
}

/**
 * Get all book abbreviations (in canonical order).
 */
export function getAllChapterCounts() {
  if (!bible) return {};
  const counts = {};
  for (const abbrev of Object.keys(bible)) {
    counts[abbrev] = Object.keys(bible[abbrev]).length;
  }
  return counts;
}
