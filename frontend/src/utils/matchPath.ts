export function matchPath(pattern: string, pathname: string) {
  const regex = new RegExp(
    "^" + pattern.replace(/:\w+/g, "([^/]+)").replace(/\//g, "\\/") + "$"
  );
  return regex.test(pathname);
}
