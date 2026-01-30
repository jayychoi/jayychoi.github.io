export default function MarkdownContent({
  html,
  className,
}: { html: string; className?: string }) {
  return (
    <div
      className={`prose prose-neutral dark:prose-invert max-w-none ${className ?? ""}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <static site>
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
