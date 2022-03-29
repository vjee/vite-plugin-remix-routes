# Changelog

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
