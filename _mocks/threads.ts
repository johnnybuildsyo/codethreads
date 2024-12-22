export const threadData = {
  id: 1,
  title: "🎨 Our new color system is a game-changer for accessibility",
  date: "2023-06-15",
  teaser: "Just pushed some major updates to our color system. You won't believe the impact on accessibility scores!",
  creator: {
    username: "sarahdev",
    name: "Sarah Developer",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  posts: [
    {
      id: 1,
      content:
        "Just pushed a major update to our color system, and I'm thrilled with the results! 🎉 Our accessibility scores have skyrocketed, and the components look better than ever. Here's a quick rundown of what changed:",
      timestamp: "2023-06-15T10:30:00Z",
      commit: {
        message: "Implement new color system for improved accessibility",
        diff: `diff --git a/src/styles/colors.ts b/src/styles/colors.ts
index 1234567..89abcdef 100644
--- a/src/styles/colors.ts
+++ b/src/styles/colors.ts
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
      content:
        "The key changes were in the contrast ratios. Our previous color scheme barely met WCAG AA standards, but now we're hitting AAA across the board! 💪 Here's how the Button component changed:",
      timestamp: "2023-06-15T11:45:00Z",
      commit: {
        message: "Update Button component with new color system",
        diff: `diff --git a/src/components/Button.tsx b/src/components/Button.tsx
index 2345678..9abcdef0 100644
--- a/src/components/Button.tsx
+++ b/src/components/Button.tsx
@@ -5,18 +5,23 @@ export const Button = styled.button\`
   padding: 10px 20px;
   border: none;
   border-radius: 4px;
-  background-color: var(--color-primary);
-  color: var(--color-background);
+  background-color: #0056b3;
+  color: white;
   cursor: pointer;
   
   &:hover {
-    background-color: var(--color-primary-dark);
+    background-color: #004494;
   }

   &:focus {
-    outline: 2px solid var(--color-secondary);
+    outline: 2px solid #28a745;
     outline-offset: 2px;
   }
 \`;`,
      },
    },
    {
      id: 3,
      content:
        "And there you have it! 🎨✨ Our components are now not only more accessible but also more visually appealing. Next up: extending this system to our form inputs. Stay tuned for more updates!",
      timestamp: "2023-06-15T14:20:00Z",
      commit: {
        message: "Add color system to form inputs",
        diff: `diff --git a/src/components/Input.tsx b/src/components/Input.tsx
index 3456789..0abcdef1 100644
--- a/src/components/Input.tsx
+++ b/src/components/Input.tsx
@@ -5,17 +5,17 @@ export const Input = styled.input\`
   padding: 8px 12px;
   border: 1px solid #ccc;
   border-radius: 4px;
-  background-color: var(--color-background);
-  color: var(--color-text);
+  background-color: #f8f9fa;
+  color: #212529;
   
   &:focus {
-    border-color: var(--color-primary);
-    outline: 2px solid var(--color-primary);
+    border-color: #0056b3;
+    outline: 2px solid #0056b3;
     outline-offset: 2px;
   }

   &::placeholder {
-    color: var(--color-text-muted);
+    color: rgba(33, 37, 41, 0.6);
   }
 \`;`,
      },
    },
  ],
} 