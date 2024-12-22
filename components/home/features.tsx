import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Code, Users, Zap } from 'lucide-react'

const features = [
  {
    icon: <Code className="h-8 w-8 text-primary" />,
    title: "Live Coding Threads",
    description: "Share your coding process step-by-step in real-time threads."
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Community Feedback",
    description: "Get instant feedback and suggestions from fellow developers."
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Learn by Doing",
    description: "Improve your skills by building projects and sharing your progress."
  }
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-muted/50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Why Code Threads?</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="mb-2">{feature.icon}</div>
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

