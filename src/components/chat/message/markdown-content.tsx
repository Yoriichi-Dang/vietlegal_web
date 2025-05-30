"use client";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  // Simple markdown-like rendering
  const renderContent = (text: string) => {
    // Split by lines and process each line
    const lines = text.split("\n");

    return lines.map((line, index) => {
      // Handle headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-xl font-bold mb-2">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-lg font-bold mb-2">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-base font-bold mb-2">
            {line.slice(4)}
          </h3>
        );
      }

      // Handle bold text
      const boldText = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

      // Handle italic text
      const italicText = boldText.replace(/\*(.*?)\*/g, "<em>$1</em>");

      // Handle code blocks
      const codeText = italicText.replace(
        /`(.*?)`/g,
        '<code class="bg-neutral-700 px-1 rounded">$1</code>'
      );

      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p
          key={index}
          className="mb-2 last:mb-0 text-neutral-200 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: codeText }}
        />
      );
    });
  };

  return (
    <div className="prose prose-invert max-w-none">
      {renderContent(content)}
    </div>
  );
}
