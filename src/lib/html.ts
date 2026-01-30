export function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x3C;": "<",
    "&#x3E;": ">",
    "&#x26;": "&",
  };
  return text.replace(/&(?:#x[0-9a-fA-F]+|#[0-9]+|\w+);/g, (match) => {
    if (entities[match]) return entities[match];
    if (match.startsWith("&#x")) {
      return String.fromCodePoint(Number.parseInt(match.slice(3, -1), 16));
    }
    if (match.startsWith("&#")) {
      return String.fromCodePoint(Number.parseInt(match.slice(2, -1), 10));
    }
    return match;
  });
}

export function extractPlainText(html: string): string | undefined {
  const plain = decodeHtmlEntities(html.replace(/<[^>]*>/g, "")).trim();
  return plain.length > 0 ? plain.slice(0, 200) : undefined;
}
