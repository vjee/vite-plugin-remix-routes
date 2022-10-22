import { ReactNode } from "react";
import { Link, Outlet, useRouteError } from "react-router-dom";

export default function Root() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="root">
      <header>
        <Link to="/">go home</Link>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function ErrorBoundary() {
  let error = useRouteError();
  console.log(error);

  return <Layout>Oops!</Layout>;
}
