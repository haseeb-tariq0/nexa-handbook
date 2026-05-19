import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export function Markdown({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <div className={cn("markdown", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-[20px] font-semibold text-text-1 mt-7 mb-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-[16px] font-semibold text-text-1 mt-6 mb-2.5 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-[14px] font-semibold text-text-1 mt-5 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-[13px] text-text-2 leading-relaxed my-3">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 my-3 space-y-1.5 text-[13px] text-text-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 my-3 space-y-1.5 text-[13px] text-text-2">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-nexa-purple hover:underline"
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className="bg-panel-2 px-1 py-0.5 rounded text-[12px] font-mono">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-nexa-purple pl-4 my-4 text-text-2 italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-6 border-t border-border" />,
          strong: ({ children }) => (
            <strong className="font-semibold text-text-1">{children}</strong>
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
