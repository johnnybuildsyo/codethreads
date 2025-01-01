import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BoltIcon } from "@heroicons/react/24/solid"
import { Code, Users } from "lucide-react"

const features = [
  {
    icon: <Code className="h-8 w-8 text-blue-500" />,
    title: "Live Coding Sessions",
    description: "Share your coding process step-by-step in real-time post sessions.",
  },
  {
    icon: <Users className="h-8 w-8 text-blue-500" />,
    title: "Community Feedback",
    description: "Get instant feedback and suggestions from fellow developers.",
  },
  {
    icon: <BoltIcon className="h-8 w-8 text-blue-500" />,
    title: "Learn by Doing",
    description: "Improve your skills by building projects and sharing your progress.",
  },
]

export default function Features() {
  return (
    <section id="features" className="pb-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2 text-blue-500">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
