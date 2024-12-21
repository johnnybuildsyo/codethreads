import Link from "next/link"

export default function Footer() {
  return (
    <footer className="py-6 px-6 bg-muted">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-muted-foreground">© 2025 Code Threads. All rights reserved.</p>
        </div>
        <nav className="flex space-x-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Terms
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Privacy
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
