import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const showcases = [
  {
    title: "Building a React Component Library",
    author: "Sarah Dev",
    image: "/placeholder.svg?height=100&width=100"
  },
  {
    title: "Creating a Node.js API from Scratch",
    author: "Mike Coder",
    image: "/placeholder.svg?height=100&width=100"
  },
  {
    title: "Implementing Machine Learning in Python",
    author: "Emma AI",
    image: "/placeholder.svg?height=100&width=100"
  }
]

export default function CommunityShowcase() {
  return (
    <section id="community" className="py-20 px-6 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Community Showcase</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {showcases.map((showcase, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{showcase.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Image
                  src={showcase.image}
                  alt={`Avatar of ${showcase.author}`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <span className="text-muted-foreground">{showcase.author}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

