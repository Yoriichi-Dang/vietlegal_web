"use client";

import React from "react";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  // Helper function to check if URL is an image
  const isImageUrl = (url: string): boolean => {
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".webp",
      ".svg",
      ".bmp",
    ];
    const lowerUrl = url.toLowerCase();
    return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
  };

  // Process code blocks first (before line splitting)
  const processCodeBlocks = (text: string) => {
    const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
    let processedText = text;
    const codeBlocks: { id: string; content: string; language?: string }[] = [];
    let blockIndex = 0;

    // Extract code blocks and replace with placeholders
    processedText = processedText.replace(
      codeBlockRegex,
      (match, language, code) => {
        const blockId = `__CODE_BLOCK_${blockIndex}__`;
        codeBlocks.push({
          id: blockId,
          content: code.trim(),
          language: language || "text",
        });
        blockIndex++;
        return blockId;
      }
    );

    return { processedText, codeBlocks };
  };

  // Process markdown tables
  const processTables = (text: string) => {
    const tableRegex = /\|(.+)\|\n\|[-:]+\|\n((?:\|.+\|\n?)+)/g;
    let processedText = text;
    const tables: { id: string; headers: string[]; rows: string[][] }[] = [];
    let tableIndex = 0;

    processedText = processedText.replace(
      tableRegex,
      (match, headerRow, bodyRows) => {
        const tableId = `__TABLE_${tableIndex}__`;
        const headers = headerRow
          .split("|")
          .filter(Boolean)
          .map((h: string) => h.trim());
        const rows = bodyRows
          .split("\n")
          .filter(Boolean)
          .map((row: string) =>
            row
              .split("|")
              .filter(Boolean)
              .map((cell: string) => cell.trim())
          );

        tables.push({
          id: tableId,
          headers,
          rows,
        });
        tableIndex++;
        return tableId;
      }
    );

    return { processedText, tables };
  };

  // Render table component
  const renderTable = (headers: string[], rows: string[][]) => {
    return (
      <div className="my-4 overflow-x-auto">
        <table className="min-w-full border-collapse border border-neutral-700">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-neutral-700 bg-neutral-800 px-4 py-2 text-left text-sm font-medium text-neutral-200"
                >
                  {processInlineFormatting(header)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="border border-neutral-700 px-4 py-2 text-sm text-neutral-200"
                  >
                    {processInlineFormatting(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Render code block component
  const renderCodeBlock = (content: string, language = "text") => {
    return (
      <div className="my-4 rounded-lg overflow-hidden border border-neutral-700">
        {language && language !== "text" && (
          <div className="bg-neutral-800 px-4 py-2 text-xs text-neutral-400 border-b border-neutral-700">
            {language}
          </div>
        )}
        <pre className="bg-neutral-900 p-4 overflow-x-auto">
          <code className="text-sm text-neutral-200 font-mono leading-relaxed">
            {content}
          </code>
        </pre>
      </div>
    );
  };

  // Process inline formatting (bold, italic, inline code, links)
  const processInlineFormatting = (text: string) => {
    const parts: (string | React.ReactNode)[] = [];
    let currentIndex = 0;

    // Combined regex for all inline formatting
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    let match;

    while ((match = inlineRegex.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(text.slice(currentIndex, match.index));
      }

      const matchedText = match[0];

      // Handle different types of formatting
      if (matchedText.startsWith("**") && matchedText.endsWith("**")) {
        // Bold text
        const boldText = matchedText.slice(2, -2);
        parts.push(
          <strong key={match.index} className="font-bold text-white">
            {boldText}
          </strong>
        );
      } else if (
        matchedText.startsWith("*") &&
        matchedText.endsWith("*") &&
        !matchedText.startsWith("**")
      ) {
        // Italic text
        const italicText = matchedText.slice(1, -1);
        parts.push(
          <em key={match.index} className="italic">
            {italicText}
          </em>
        );
      } else if (matchedText.startsWith("`") && matchedText.endsWith("`")) {
        // Inline code
        const codeText = matchedText.slice(1, -1);
        parts.push(
          <code
            key={match.index}
            className="bg-neutral-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono"
          >
            {codeText}
          </code>
        );
      } else if (matchedText.startsWith("[") && matchedText.includes("](")) {
        // Links - fixed regex pattern
        const linkMatch = matchedText.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [, linkText, linkUrl] = linkMatch;
          if (isImageUrl(linkUrl)) {
            // If the link points to an image, render it as an image
            parts.push(
              <span key={match.index} className="inline-block my-4">
                <img
                  src={linkUrl}
                  alt={linkText}
                  className="max-w-full rounded-lg border border-neutral-700"
                  loading="lazy"
                />
                {linkText && (
                  <span className="block mt-2 text-sm text-neutral-400 text-center">
                    {linkText}
                  </span>
                )}
              </span>
            );
          } else {
            // Regular link
            parts.push(
              <a
                key={match.index}
                href={linkUrl}
                className="text-blue-400 hover:text-blue-300 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {linkText}
              </a>
            );
          }
        }
      } else {
        // Fallback - add as plain text
        parts.push(matchedText);
      }

      currentIndex = match.index + matchedText.length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(text.slice(currentIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const { processedText: textAfterCodeBlocks, codeBlocks } =
      processCodeBlocks(text);
    const { processedText, tables } = processTables(textAfterCodeBlocks);
    const lines = processedText.split("\n");
    const renderedLines: React.ReactNode[] = [];
    let currentList: string[] = [];
    let currentListType: "ul" | "ol" | null = null;

    const flushList = () => {
      if (currentList.length > 0) {
        if (currentListType === "ul") {
          renderedLines.push(
            <ul key={`list-${renderedLines.length}`} className="mb-4 ml-4">
              {currentList.map((item, idx) => (
                <li
                  key={idx}
                  className="text-neutral-200 leading-relaxed list-disc mb-1"
                >
                  {processInlineFormatting(item)}
                </li>
              ))}
            </ul>
          );
        } else if (currentListType === "ol") {
          renderedLines.push(
            <ol key={`list-${renderedLines.length}`} className="mb-4 ml-4">
              {currentList.map((item, idx) => (
                <li
                  key={idx}
                  className="text-neutral-200 leading-relaxed list-decimal mb-1"
                >
                  {processInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }
        currentList = [];
        currentListType = null;
      }
    };

    lines.forEach((line, index) => {
      // Check if line is a code block placeholder
      const codeBlock = codeBlocks.find((block) => line.trim() === block.id);
      if (codeBlock) {
        flushList();
        renderedLines.push(
          <div key={`code-${index}`}>
            {renderCodeBlock(codeBlock.content, codeBlock.language)}
          </div>
        );
        return;
      }

      // Check if line is a table placeholder
      const table = tables.find((t) => line.trim() === t.id);
      if (table) {
        flushList();
        renderedLines.push(
          <div key={`table-${index}`}>
            {renderTable(table.headers, table.rows)}
          </div>
        );
        return;
      }

      // Handle headers
      if (line.startsWith("# ")) {
        flushList();
        renderedLines.push(
          <h1
            key={`h1-${index}`}
            className="text-2xl font-bold mb-4 text-white mt-6 first:mt-0"
          >
            {processInlineFormatting(line.slice(2))}
          </h1>
        );
        return;
      }
      if (line.startsWith("## ")) {
        flushList();
        renderedLines.push(
          <h2
            key={`h2-${index}`}
            className="text-xl font-bold mb-3 text-white mt-5 first:mt-0"
          >
            {processInlineFormatting(line.slice(3))}
          </h2>
        );
        return;
      }
      if (line.startsWith("### ")) {
        flushList();
        renderedLines.push(
          <h3
            key={`h3-${index}`}
            className="text-lg font-bold mb-2 text-white mt-4 first:mt-0"
          >
            {processInlineFormatting(line.slice(4))}
          </h3>
        );
        return;
      }

      // Handle horizontal rule
      if (line.trim() === "---") {
        flushList();
        renderedLines.push(
          <hr key={`hr-${index}`} className="my-6 border-neutral-600" />
        );
        return;
      }

      // Handle lists
      if (line.match(/^\s*[-*+]\s/)) {
        const listContent = line.replace(/^\s*[-*+]\s/, "");
        if (currentListType !== "ul") {
          flushList();
          currentListType = "ul";
        }
        currentList.push(listContent);
        return;
      }

      // Handle numbered lists
      if (line.match(/^\s*\d+\.\s/)) {
        const listContent = line.replace(/^\s*\d+\.\s/, "");
        if (currentListType !== "ol") {
          flushList();
          currentListType = "ol";
        }
        currentList.push(listContent);
        return;
      }

      // Handle blockquotes
      if (line.startsWith("> ")) {
        flushList();
        renderedLines.push(
          <blockquote
            key={`quote-${index}`}
            className="border-l-4 border-blue-500 pl-4 mb-4 italic text-neutral-300 bg-neutral-800/30 py-2"
          >
            {processInlineFormatting(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Handle empty lines
      if (line.trim() === "") {
        flushList();
        return;
      }

      // Handle regular paragraphs
      flushList();
      renderedLines.push(
        <p
          key={`p-${index}`}
          className="mb-4 last:mb-0 text-neutral-200 leading-relaxed"
        >
          {processInlineFormatting(line)}
        </p>
      );
    });

    // Flush any remaining list
    flushList();

    return renderedLines;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent(content)}
    </div>
  );
}
