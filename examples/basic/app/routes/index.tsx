import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div>
      /index.jsx
      <Link to="this/route/does/not/exist">
        go to /this/route/does/not/exist
      </Link>
      <Link to="demos/about">go to /demos/about</Link>
      <Link to="demos/params">go to /demos/params</Link>
    </div>
  );
}
