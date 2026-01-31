import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-8xl font-bold font-display">404</p>
      <h2 className="mt-4 text-xl font-semibold">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Button variant="outline" className="mt-8" asChild>
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
}
