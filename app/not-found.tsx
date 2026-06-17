import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="max-w-md text-muted-foreground">
        We couldn&apos;t find the page you were looking for.
      </p>
      <Button asChild>
        <Link href="/">Go home</Link>
      </Button>
    </div>
  )
}
