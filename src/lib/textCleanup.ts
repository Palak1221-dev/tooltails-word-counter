/**
 * Patterns that should be protected from aggressive cleanup actions.
 * These cover URLs, emails, IP addresses, version numbers, decimals, and file paths.
 */
const PROTECTED_PATTERNS = [
  /https?:\/\/[\w\-\.\/\?\#\%\&\=\+\@\!\~\(\)]+[\w\-\/\#\%\&\=\+\@\!\~\(\)]/g, // Full URLs
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,    // Email addresses
  /\b[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?\b/g,    // Domain names and simple paths
  /[vV]?\d+(?:\.\d+)+\b/g,                         // IP addresses, version numbers
  /\b\d+\.\d+\b/g,                                   // Decimal numbers
  /(?:[a-zA-Z]:\\|[\\\/])[a-zA-Z0-9._\-\/\\]+/g,    // Common file path patterns
];

interface CleanupResult {
  text: string;
  count: number;
}

/**
 * Higher-order function to apply a transformation while protecting technical tokens.
 */
const withProtectionCount = (text: string, transform: (t: string) => CleanupResult): CleanupResult => {
  const protectedMap = new Map<string, string>();
  let counter = 0;
  let processedText = text;

  // Identify and replace protected tokens with unique placeholders
  PROTECTED_PATTERNS.forEach((pattern) => {
    processedText = processedText.replace(pattern, (match) => {
      const placeholder = `__CLEANUP_PROTECT_${counter++}__`;
      protectedMap.set(placeholder, match);
      return placeholder;
    });
  });

  // Apply the requested transformation
  const result = transform(processedText);
  let finalText = result.text;

  // Restore the original tokens from placeholders
  const placeholders = Array.from(protectedMap.keys()).reverse();
  placeholders.forEach((placeholder) => {
    const original = protectedMap.get(placeholder)!;
    finalText = finalText.replace(placeholder, () => original);
  });

  return { text: finalText, count: result.count };
};

/**
 * Normalizes repeated punctuation marks (.,!?) into a single instance,
 * while protecting technical tokens like URLs and decimals.
 */
export const normalizePunctuation = (text: string): CleanupResult => {
  return withProtectionCount(text, (t) => {
    let count = 0;
    const res = t.replace(/([.,!?])\1+/g, (match, p1) => {
      count++;
      return p1;
    });
    return { text: res, count };
  });
};

/**
 * Removes all common punctuation marks while protecting technical tokens.
 */
export const removeAllPunctuation = (text: string): CleanupResult => {
  return withProtectionCount(text, (t) => {
    let count = 0;
    const res = t.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\"\'<>\\\|\?\@]/g, () => {
      count++;
      return "";
    });
    return { text: res, count };
  });
};

/**
 * Converts multiple spaces into a single space and trims leading/trailing whitespace.
 */
export const removeExtraSpaces = (text: string): CleanupResult => {
  let count = 0;
  // Replace 2+ spaces with 1 space
  let res = text.replace(/[ \t]{2,}/g, () => {
    count++;
    return ' ';
  });
  
  // Trim individual lines
  res = res.split('\n').map(line => {
    const trimmed = line.trim();
    if (trimmed !== line) count++;
    return trimmed;
  }).join('\n');
  
  // Final trim for the whole block
  const finalTrimmed = res.trim();
  if (finalTrimmed !== res) count++;

  return { text: finalTrimmed, count };
};

/**
 * Removes completely empty lines from the text.
 */
export const removeEmptyLines = (text: string): CleanupResult => {
  let count = 0;
  const res = text.split('\n').filter(line => {
    if (line.trim() === '') {
      count++;
      return false;
    }
    return true;
  }).join('\n');
  return { text: res, count };
};

/**
 * Removes consecutive duplicate words (case-insensitive).
 */
export const removeDuplicateWords = (text: string): CleanupResult => {
  return withProtectionCount(text, (t) => {
    let count = 0;
    const res = t.replace(/\b(\w+)(\s+\1)+\b/gi, (match, p1) => {
      // Calculate how many duplicates were actually removed
      const wordsCount = match.trim().split(/\s+/).length;
      count += (wordsCount - 1);
      return p1;
    });
    return { text: res, count };
  });
};

/**
 * Converts text to Title Case.
 */
export const toTitleCase = (text: string): string => {
  return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
