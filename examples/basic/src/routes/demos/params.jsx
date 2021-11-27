import { Link, Outlet } from "react-router-dom";

export default function DemosParams() {
  return (
    <div>
      /demos/params.jsx
      <Outlet />
      <Link to="">go to /</Link>
      <Link to="one">go to /one</Link>
      <Link to="two">go to /two</Link>
    </div>
  );
}
