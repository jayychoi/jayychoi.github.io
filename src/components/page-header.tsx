export default function PageHeader({
  title,
  className,
}: { title: string; className?: string }) {
  return (
    <h1 className={`mb-4 text-3xl font-bold ${className ?? ""}`}>{title}</h1>
  );
}
