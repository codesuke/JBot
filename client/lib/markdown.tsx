import React from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Custom renderers for markdown components to match our design system
 */
const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold mt-4 mb-2 text-foreground">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold mt-3 mb-2 text-foreground">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold mt-2 mb-1 text-foreground">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mb-2 text-sm leading-relaxed text-foreground">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-2 ml-2 space-y-1 text-sm">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-2 ml-2 space-y-1 text-sm">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="ml-2 text-sm">{children}</li>
  ),
  code: ({ children, ...props }) => {
    const inline = !('className' in props) || !String(props.className).includes('language-');
    if (inline) {
      return (
        <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-foreground">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-muted p-3 rounded-md text-xs font-mono text-foreground overflow-x-auto mb-2">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-muted p-3 rounded-md overflow-x-auto mb-2 border border-border">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary pl-4 mb-2 italic text-muted-foreground bg-muted/50 py-2 px-3 rounded">
      {children}
    </blockquote>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-2">
      <table className="w-full border-collapse border border-border text-sm">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-border bg-muted px-3 py-2 text-left font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-border px-3 py-2">{children}</td>
  ),
};

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer Component
 * Renders markdown content with custom styling
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

/**
 * Utility function to check if content contains markdown
 */
export function isMarkdownContent(content: string): boolean {
  const markdownPatterns = [
    /^#{1,6}\s/m, // headings
    /\*\*.*?\*\*/, // bold
    /\*.*?\*/, // italic
    /\[.*?\]\(.*?\)/, // links
    /```/, // code blocks
    /^[-*+]\s/m, // lists
    /^\d+\.\s/m, // ordered lists
    /^>/, // blockquotes
    /\|.*?\|/, // tables
  ];

  return markdownPatterns.some((pattern) => pattern.test(content));
}

/**
 * Format response from API into markdown-friendly format
 */
export function formatResponseAsMarkdown(response: string): string {
  // Handle common API response formats
  const formatted = response
    .replace(/\n\n+/g, '\n\n') // Normalize spacing
    .replace(/^(?!#{1,6}\s)^(?!\*|-|>|\d+\.)/gm, ''); // Clean up accidental formatting

  return formatted;
}

