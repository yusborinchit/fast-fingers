export function parseTextToWords({ text }: { text: string }) {
  return text.split(" ").map((word, index) => ({
    index,
    word,
    state: "none",
  }));
}
