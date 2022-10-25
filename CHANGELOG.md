# Changelog

## Unreleased

- Dependency updates
- Add `dataRouterCompatible` option that defaults to `true` to be used with `react-router` 6.4 or later.
  - `importMode` option only works when `dataRouterCompatible` is `false`.
  - `is404Route` option only works when `dataRouterCompatible` is `false`.
- Custom `loader` property on routes with `importMode='async'` has been renamed to `importPromise` so it doesn't conflict with `react-router`'s new `loader` property.
  - `EagerLoader` has been updated to use `importPromise`.

## [0.2.0] - 2022-03-29

### Breaking

- `appDir` is now `appDirectory` to match remix's config
- `appDirectory` defaults to "app" instead of "src" to match remix

### Added

- Support remix's [`route`](https://remix.run/docs/en/v1/api/conventions#routes) and [`ignoredRouteFiles`](https://remix.run/docs/en/v1/api/conventions#ignoredroutefiles) configuration
- `build:watch` command for development

### Changed

- Tests now use vitest

## [0.1.3]

### Fixed

- Fix tests.

### Changed

- Use TypeScript for tests, scripts and examples.
- Update code block languages in README.md.

## [0.1.2]

### Changed

- Allow nested 404 routes.

## [0.1.1]

### Fixed

- Correctly stringify routes with `.` characters.

## [0.1.0]

- Initial version
