import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AuthProvider } from "@/contexts/AuthContext";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-[var(--color-text-primary)]">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-[var(--color-text-primary)]">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          The page you're looking for doesn't exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "#6366F1" }}
        >
          Go home
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Try refreshing, or head back home.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white"
            style={{ backgroundColor: "#6366F1" }}
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded-lg border border-[#1E1E2E] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)]"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nrolled — Leave Management" },
      { name: "description", content: "Premium leave management for modern teams." },
      { property: "og:title", content: "Nrolled — Leave Management" },
      { name: "twitter:title", content: "Nrolled — Leave Management" },
      { property: "og:description", content: "Premium leave management for modern teams." },
      { name: "twitter:description", content: "Premium leave management for modern teams." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f0f9847c-f1e8-4686-97aa-488a85ca1446/id-preview-2f1a5c5f--73a2f647-2e9c-4637-ba12-9419fc9f4edf.lovable.app-1782302337523.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f0f9847c-f1e8-4686-97aa-488a85ca1446/id-preview-2f1a5c5f--73a2f647-2e9c-4637-ba12-9419fc9f4edf.lovable.app-1782302337523.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#111118",
              border: "1px solid #1E1E2E",
              color: "#F1F5F9",
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}
