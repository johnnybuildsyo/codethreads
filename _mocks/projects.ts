export const projectData = {
  id: 1,
  title: "React Component Library",
  description: "A collection of reusable React components with Storybook integration.",
  threadCount: 15,
  lastUpdated: "2023-06-15",
  createdAt: "2023-06-01",
  stats: {
    stars: 1247,
    forks: 123,
    watchers: 45,
    commits: 342,
  },
  creator: {
    username: "sarahdev",
    name: "Sarah Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  threads: [
    {
      id: 1,
      title: "Our new color system is a game-changer for accessibility",
      date: "2023-06-15",
      teaser: "Just pushed some major updates to our color system. You won't believe the impact on accessibility scores!",
      posts: [
        {
          id: 1,
          content: "Just pushed a major update to our color system, and I'm thrilled with the results! 🎉 Our accessibility scores have skyrocketed, and the components look better than ever. Here's a quick rundown of what changed:",
          timestamp: "2023-06-15T10:30:00Z",
          commit: {
            message: "Implement new color system for improved accessibility",
            diff: `diff --git a/src/styles/colors.ts b/src/styles/colors.ts
@@ -1,10 +1,10 @@
 export const colors = {
-  primary: '#3498db',
-  secondary: '#2ecc71',
-  text: '#333333',
-  background: '#ffffff',
+  primary: '#0056b3',
+  secondary: '#28a745',
+  text: '#212529',
+  background: '#f8f9fa',
 };`,
          },
        },
        {
          id: 2,
          content: "Next up, I've updated all our button variants to use the new color system. The contrast is much better now, especially for our secondary and outline variants.",
          timestamp: "2023-06-15T11:15:00Z",
          commit: {
            message: "Update button variants with new color system",
            diff: `diff --git a/src/components/Button/variants.ts b/src/components/Button/variants.ts
@@ -1,8 +1,8 @@
 export const buttonVariants = {
   primary: {
-    bg: '#3498db',
-    hover: '#2980b9',
+    bg: '#0056b3',
+    hover: '#004494',
   },
   secondary: {
-    bg: '#2ecc71',
-    hover: '#27ae60',
+    bg: '#28a745',
+    hover: '#218838',
   },
 };`,
          },
        },
        {
          id: 3,
          content: "Finally, I've added a new dark mode palette that maintains our AAA accessibility ratings. Check out these contrast scores! 🎯",
          timestamp: "2023-06-15T14:20:00Z",
          commit: {
            message: "Add dark mode color palette",
            diff: `diff --git a/src/styles/colors.ts b/src/styles/colors.ts
@@ -11,4 +11,12 @@ export const colors = {
+  dark: {
+    primary: '#66b3ff',
+    secondary: '#4ade80',
+    text: '#f8f9fa',
+    background: '#1a1a1a',
+    muted: '#666666',
+  },
 };`,
          },
        },
      ],
    },
    {
      id: 2,
      title: "Storybook integration complete - here's what I learned",
      date: "2023-06-10",
      teaser: "Finally got Storybook up and running smoothly. Here's a quick rundown of the challenges and wins.",
      posts: [
        {
          id: 2,
          content: "After a week of wrestling with configurations and custom webpack setups, I finally got our Storybook integration working smoothly! 📚✨ The components are now properly documented and we have a living style guide.",
          timestamp: "2023-06-10T15:20:00Z",
          commit: {
            message: "Add Storybook configuration and initial stories",
            diff: `diff --git a/.storybook/main.js b/.storybook/main.js
+module.exports = {
+  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
+  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
+  framework: '@storybook/react',
+  core: { builder: '@storybook/builder-webpack5' },
+};`,
          },
        },
      ],
    },
    {
      id: 3,
      title: "New Button component: From basic to baller in 24 hours",
      date: "2023-06-05",
      teaser: "Started with a simple button, ended up with a flexible, accessible component. Here's how it evolved.",
      posts: [
        {
          id: 3,
          content: "Today I tackled our Button component. What started as a simple wrapper turned into a fully-featured, accessible component with variants, sizes, and proper keyboard navigation support.",
          timestamp: "2023-06-05T09:15:00Z",
          commit: {
            message: "Add Button component with variants and accessibility features",
            diff: `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
+import { cva } from 'class-variance-authority'
+
+const buttonVariants = cva(
+  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none',
+  {
+    variants: {
+      variant: {
+        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
+        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
+        outline: 'border border-input bg-background hover:bg-accent',
+      },
+      size: {
+        default: 'h-10 px-4 py-2',
+        sm: 'h-9 rounded-md px-3',
+        lg: 'h-11 rounded-md px-8',
+      },
+    },
+    defaultVariants: {
+      variant: 'default',
+      size: 'default',
+    },
+  }
+)`,
          },
        },
      ],
    },
    {
      id: 4,
      title: "Project kickoff: Setting up our React component library",
      date: "2023-06-01",
      teaser: "Day 1 of our new project! Here's how I set up the foundation for our React component library.",
      posts: [
        {
          id: 4,
          content: "Excited to start this new project! Today I set up the development environment with TypeScript, ESLint, Prettier, and Jest. Also added CI/CD pipelines for automated testing and deployments.",
          timestamp: "2023-06-01T11:00:00Z",
          commit: {
            message: "Initial project setup with TypeScript and testing configuration",
            diff: `diff --git a/package.json b/package.json
+{
+  "name": "react-component-library",
+  "version": "0.1.0",
+  "scripts": {
+    "dev": "vite",
+    "build": "tsc && vite build",
+    "test": "jest",
+    "lint": "eslint src --ext ts,tsx"
+  },
+  "dependencies": {
+    "react": "^18.2.0",
+    "react-dom": "^18.2.0"
+  }
+}`,
          },
        },
      ],
    },
  ],
} 