export const usersData = {
  sarahdev: {
    username: "sarahdev",
    name: "Sarah Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Full-stack developer passionate about React and Node.js. Building in public and sharing my journey on CodeThreads.",
    github: "sarahdev",
    twitter: "sarahdev",
    projects: [
      {
        id: 1,
        title: "React Component Library",
        description: "A collection of reusable React components with Storybook integration.",
        threadCount: 15,
        lastUpdated: "2023-06-15",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
      },
      {
        id: 2,
        title: "Node.js API Boilerplate",
        description: "A starter template for building scalable Node.js APIs with Express and MongoDB.",
        threadCount: 8,
        lastUpdated: "2023-05-22",
      },
      {
        id: 3,
        title: "Vue.js Todo App",
        description: "A simple but feature-rich todo application built with Vue.js and Vuex.",
        threadCount: 5,
        lastUpdated: "2023-04-10",
      },
    ],
  },
  johndev: {
    username: "johndev",
    name: "John Developer",
    avatar: "/placeholder.svg?height=100&width=100",
    bio: "Building cool stuff with TypeScript and Next.js. Learning in public.",
    github: "johndev",
    twitter: "johndev",
    projects: [], // New user with no projects
  },
} 