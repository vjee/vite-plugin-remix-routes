export interface Route {
  // custom properties
  id: string;
  file: string;

  // react-router route properties
  path: string;
  index: boolean;
  caseSensitive: boolean;
  children: Route[];
}
