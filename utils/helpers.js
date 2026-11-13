const asText = (value) => (value == null ? "" : String(value));
const excerpt = (value, length = 140) => {
  const text = asText(value).replace(/\s+/g, " ").trim();
  const limit = Number.isInteger(length) ? Math.min(500, Math.max(20, length)) : 140;
  if (text.length <= limit) return text;
  const sliced = text.slice(0, limit).replace(/\s+\S*$/, "").trimEnd();
  return (sliced || text.slice(0, limit)) + "…";
};
const readingTime = (value) => Math.max(1, Math.ceil(asText(value).trim().split(/\s+/).filter(Boolean).length / 220));
module.exports = {
  excerpt,
  reading_time: readingTime,
  format_date: (date) => date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
  iso_date: (date) => date ? new Date(date).toISOString() : "",
  initial: (value) => asText(value).charAt(0).toUpperCase() || "?",
  card_color: (id) => Math.abs(Number(id) || 0) % 5,
  card_symbol: (id) => ["{ }","//","<>","*","#"][Math.abs(Number(id) || 0) % 5],
};