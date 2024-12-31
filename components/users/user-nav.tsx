import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Overview", href: "" },
  { name: "Projects", href: "#projects" },
  { name: "Sessions", href: "#sessions" },
]

export function UserNav() {
  const pathname = usePathname()
  const username = pathname.split("/")[1]

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <ul className="flex space-x-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Button variant="ghost" asChild>
                <Link href={`/${username}${item.href}`}>{item.name}</Link>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
