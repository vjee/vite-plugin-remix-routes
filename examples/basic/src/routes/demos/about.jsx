import { Link, Outlet } from "react-router-dom";

export default function About() {
  return (
    <div>
      /demos/about.jsx
      <Outlet />
      <Link to="">go to /</Link>
      <Link to="whoa">go to /whoa</Link>
    </div>
  );
}
