import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";

import styles from "~/styles/main.css";
import MainNavigation from "~/components/mainNavigation";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="error">
        <h1>Error occurred</h1>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error?.data}</p>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <div className="error">
        <h1>App error</h1>
        <p>{error.message}</p>
        <p>
          Back to <Link to="/"> safety</Link>!
        </p>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}
