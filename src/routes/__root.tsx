import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { SiteProvider } from "@/components/site/overlays";
import { SmoothScroll } from "@/components/site/smooth";
import { FilmChrome } from "@/components/site/chrome";
import { Cursor } from "@/components/site/fx";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      { title: "Anmol Srivastava — AI Creative Automation Specialist" },
      { name: "description", content: "AI artist and creative automation specialist." },
      { name: "author", content: "Anmol Srivastava" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#090909" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&family=Caveat+Brush&family=Bebas+Neue&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: CinematicNotFound,
  errorComponent: ErrorComponent,
});

function CinematicNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="timecode">SCENE 404 — MISSING REEL</span>
      <h1 className="font-display mt-6 text-[30vw] text-gold-grad md:text-[14rem]">404</h1>
      <p className="max-w-md text-muted-foreground">This scene was cut in the edit. Let's get you back to the reel.</p>
      <Link to="/" className="mt-8 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground">Back to the reel</Link>
    </div>
  );
}
void NotFoundComponent;

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: `try{var q=new URLSearchParams(location.search).get('agents'),p=localStorage.getItem('portfolio-agents');if(location.pathname==='/'&&(q==='on'||q!=='off'&&(p==='on'||p!=='off'&&!matchMedia('(prefers-reduced-motion: reduce)').matches)))document.documentElement.classList.add('build-mode')}catch(e){}` }} />
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <QueryClientProvider client={queryClient}>
      <SiteProvider>
        {pathname !== "/" && <><SmoothScroll /><FilmChrome /><Cursor /></>}
        <AnimatePresence mode="wait">
          <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <Toaster theme="dark" position="bottom-center" />
      </SiteProvider>
    </QueryClientProvider>
  );
}
