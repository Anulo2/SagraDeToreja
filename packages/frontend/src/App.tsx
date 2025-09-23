import { RouterProvider } from "@tanstack/react-router";
import { AuthProvider } from "@/providers/AuthProvider";
import { router } from "@/router";

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
