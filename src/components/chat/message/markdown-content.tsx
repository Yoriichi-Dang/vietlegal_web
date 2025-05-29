"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface MarkdownContentProps {
  content: string;
}

export default function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => (
          <p className="mb-6 md:mb-8 last:mb-0 text-base md:text-lg leading-relaxed">
            {children}
          </p>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-neutral-600 pl-4 md:pl-6 my-4 md:my-6 text-neutral-300 italic bg-neutral-800/50 py-3 md:py-4 rounded-r-lg">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="bg-neutral-800 px-2 py-1 rounded text-sm text-blue-300">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-neutral-800 p-3 md:p-4 rounded-lg overflow-x-auto border border-neutral-700 text-sm">
            {children}
          </pre>
        ),
        img: ({ src, alt }) => (
          <div className="my-4 md:my-6">
            <Image
              src={(src as string) || "/placeholder.svg"}
              alt={alt || "Image"}
              width={500}
              height={300}
              className="rounded-lg max-w-full h-auto shadow-lg"
              unoptimized
            />
          </div>
        ),
        h1: ({ children }) => (
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl md:text-2xl font-semibold mb-3 text-white">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg md:text-xl font-medium mb-2 text-white">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside mb-4 space-y-1 text-neutral-200">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside mb-4 space-y-1 text-neutral-200">
            {children}
          </ol>
        ),
        li: ({ children }) => <li className="text-neutral-200">{children}</li>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full border border-neutral-700 rounded-lg">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-neutral-800">{children}</thead>
        ),
        tbody: ({ children }) => (
          <tbody className="bg-neutral-900">{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-neutral-700">{children}</tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left text-neutral-200 font-medium">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-neutral-300">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
