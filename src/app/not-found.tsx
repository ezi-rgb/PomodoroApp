import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <div className="flex flex-col items-center gap-1 text-center">
        <h2 className="text-xl font-semibold">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <Link href="/">
        <Button variant="accent">Go home</Button>
      </Link>
    </div>
  );
}
