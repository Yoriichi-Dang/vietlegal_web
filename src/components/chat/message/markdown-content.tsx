"use client";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  // Process code blocks first (before line splitting)
  const processCodeBlocks = (text: string) => {
    // Handle code blocks with language specification
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

  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    const { processedText, codeBlocks } = processCodeBlocks(text);
    const lines = processedText.split("\n");

    return lines.map((line, index) => {
      // Check if line is a code block placeholder
      const codeBlock = codeBlocks.find((block) => line.trim() === block.id);
      if (codeBlock) {
        return (
          <div key={index}>
            {renderCodeBlock(codeBlock.content, codeBlock.language)}
          </div>
        );
      }

      // Handle headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-xl font-bold mb-2 text-white">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-bold mb-2 text-white">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-base font-bold mb-2 text-white">
            {line.slice(4)}
          </h3>
        );
      }

      // Handle lists
      if (line.match(/^\s*[-*+]\s/)) {
        const listContent = line.replace(/^\s*[-*+]\s/, "");
        return (
          <ul key={index} className="mb-2">
            <li className="text-neutral-200 leading-relaxed ml-4 list-disc">
              {processInlineFormatting(listContent)}
            </li>
          </ul>
        );
      }

      // Handle numbered lists
      if (line.match(/^\s*\d+\.\s/)) {
        const listContent = line.replace(/^\s*\d+\.\s/, "");
        return (
          <ol key={index} className="mb-2">
            <li className="text-neutral-200 leading-relaxed ml-4 list-decimal">
              {processInlineFormatting(listContent)}
            </li>
          </ol>
        );
      }

      // Handle blockquotes
      if (line.startsWith("> ")) {
        return (
          <blockquote
            key={index}
            className="border-l-4 border-blue-500 pl-4 mb-2 italic text-neutral-300"
          >
            {processInlineFormatting(line.slice(2))}
          </blockquote>
        );
      }

      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p
          key={index}
          className="mb-2 last:mb-0 text-neutral-200 leading-relaxed"
        >
          {processInlineFormatting(line)}
        </p>
      );
    });
  };

  // Process inline formatting (bold, italic, inline code, links)
  const processInlineFormatting = (text: string) => {
    // Handle links
    let processed = text.replace(
      /\[([^\]]+)\]$$([^)]+)$$/g,
      '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Handle bold text
    processed = processed.replace(
      /\*\*(.*?)\*\*/g,
      "<strong class='font-bold text-white'>$1</strong>"
    );

    // Handle italic text
    processed = processed.replace(/\*(.*?)\*/g, "<em class='italic'>$1</em>");

    // Handle inline code
    processed = processed.replace(
      /`(.*?)`/g,
      '<code class="bg-neutral-700 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    return <span dangerouslySetInnerHTML={{ __html: processed }} />;
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent(content)}
    </div>
  );
}
