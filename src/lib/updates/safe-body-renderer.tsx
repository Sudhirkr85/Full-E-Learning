import React from "react";

interface SafeBodyRendererProps {
  body: string;
  className?: string;
}

/**
 * Parses bold text (**bold**) safely without dangerouslySetInnerHTML.
 */
function renderInline(text: string): React.ReactNode[] {
  // Split on **bold** boundaries
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part}
        </strong>
      );
    }
    return part;
  });
}

/**
 * Lightweight safe markdown renderer:
 * Supports:
 * - "## " H2 headings
 * - "### " H3 headings
 * - "- " unordered bullet lists
 * - Paragraphs
 * - **bold** inline
 * Absolutely NO dangerouslySetInnerHTML and zero external markdown dependencies.
 */
export function SafeBodyRenderer({ body, className = "" }: SafeBodyRendererProps) {
  if (!body) return null;

  // Normalize line endings
  const rawLines = body.replace(/\r\n/g, "\n").split("\n");
  const blocks: React.ReactNode[] = [];

  let currentList: string[] = [];
  let blockIndex = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      const items = [...currentList];
      currentList = [];
      blocks.push(
        <ul
          key={`list-${blockIndex++}`}
          className="my-3 space-y-2 list-disc list-inside text-slate-700 text-sm sm:text-base leading-relaxed pl-1"
        >
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    }
  };

  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const text = currentParagraphLines.join(" ").trim();
      currentParagraphLines = [];
      if (text.length > 0) {
        blocks.push(
          <p
            key={`p-${blockIndex++}`}
            className="my-3 text-sm sm:text-base text-slate-700 leading-relaxed"
          >
            {renderInline(text)}
          </p>
        );
      }
    }
  };

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i].trim();

    if (!line) {
      flushList();
      flushParagraph();
      continue;
    }

    if (line.startsWith("## ")) {
      flushList();
      flushParagraph();
      const headingText = line.replace(/^##\s+/, "");
      blocks.push(
        <h2
          key={`h2-${blockIndex++}`}
          className="mt-7 mb-3 text-lg sm:text-xl font-bold text-slate-900 border-b border-slate-200 pb-2 font-display"
        >
          {renderInline(headingText)}
        </h2>
      );
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      flushParagraph();
      const headingText = line.replace(/^###\s+/, "");
      blocks.push(
        <h3
          key={`h3-${blockIndex++}`}
          className="mt-5 mb-2 text-base sm:text-lg font-bold text-indigo-700"
        >
          {renderInline(headingText)}
        </h3>
      );
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      flushParagraph();
      currentList.push(line.replace(/^[-*]\s+/, ""));
      continue;
    }

    // Regular line, collect into paragraph
    flushList();
    currentParagraphLines.push(line);
  }

  flushList();
  flushParagraph();

  return <div className={`updates-body ${className}`}>{blocks}</div>;
}
