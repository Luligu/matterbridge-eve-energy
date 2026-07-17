<!-- eslint-disable markdown/no-missing-label-refs -->

# <img src="https://matterbridge.io/assets/matterbridge.svg" alt="Matterbridge Logo" width="64px" height="64px">&nbsp;&nbsp;&nbsp;Matterbridge eve energy with history Changelog

[![npm version](https://img.shields.io/npm/v/matterbridge-eve-energy.svg)](https://www.npmjs.com/package/matterbridge-eve-energy)
[![npm downloads](https://img.shields.io/npm/dt/matterbridge-eve-energy.svg)](https://www.npmjs.com/package/matterbridge-eve-energy)
[![Docker Version](https://img.shields.io/docker/v/luligu/matterbridge/latest?label=docker%20version)](https://hub.docker.com/r/luligu/matterbridge)
[![Docker Pulls](https://img.shields.io/docker/pulls/luligu/matterbridge?label=docker%20pulls)](https://hub.docker.com/r/luligu/matterbridge)
![Node.js CI](https://github.com/Luligu/matterbridge-eve-energy/actions/workflows/build.yml/badge.svg)
![CodeQL](https://github.com/Luligu/matterbridge-eve-energy/actions/workflows/codeql.yml/badge.svg)
[![codecov](https://codecov.io/gh/Luligu/matterbridge-eve-energy/branch/main/graph/badge.svg)](https://codecov.io/gh/Luligu/matterbridge-eve-energy)
[![tested with Vitest](https://img.shields.io/badge/tested_with-Vitest-6E9F18.svg?logo=vitest&logoColor=white)](https://vitest.dev)
[![styled with Oxc](https://img.shields.io/badge/styled_with-Oxc-9BE4E0.svg?logo=oxc&logoColor=white)](https://oxc.rs/docs/guide/usage/formatter.html)
[![linted with Oxc](https://img.shields.io/badge/linted_with-Oxc-9BE4E0.svg?logo=oxc&logoColor=white)](https://oxc.rs/docs/guide/usage/linter.html)
[![TypeScript Native](https://img.shields.io/badge/TypeScript_Native-3178C6?logo=typescript&logoColor=white)](https://github.com/microsoft/typescript-go)
[![ESM](https://img.shields.io/badge/ESM-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![matterbridge.io](https://img.shields.io/badge/matterbridge.io-online-brightgreen)](https://matterbridge.io)

[![powered by](https://img.shields.io/badge/powered%20by-matterbridge-blue)](https://www.npmjs.com/package/matterbridge)
[![powered by](https://img.shields.io/badge/powered%20by-matter--history-blue)](https://www.npmjs.com/package/matter-history)
[![powered by](https://img.shields.io/badge/powered%20by-node--ansi--logger-blue)](https://www.npmjs.com/package/node-ansi-logger)
[![powered by](https://img.shields.io/badge/powered%20by-node--persist--manager-blue)](https://www.npmjs.com/package/node-persist-manager)

---

All notable changes to this project will be documented in this file.

If you like this project and find it useful, please consider giving it a star on [GitHub](https://github.com/Luligu/matterbridge-eve-energy) and sponsoring it.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="120"></a>

## [3.0.2] - Dev branch

### Breaking changes

- [matterbridge]: Require matterbridge v.3.10.0 with matter v.1.6.0 and matter.js v.0.17.5.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [3.0.1] - 2026-07-17

### Changed

- [package]: Apply uniform style.
- [package]: Upgrade package.
- [package]: Update dependencies.
- [package]: Bump `@types/node` to v.26.1.0.
- [package]: Bump `@typescript/native-preview` to v.7.0.0-dev.20260707.2.
- [package]: Bump `@vitest/coverage-v8` to v.4.1.10.
- [package]: Bump `matter-history` to v.1.2.2.
- [package]: Bump `node-ansi-logger` to v.3.3.0.
- [package]: Bump `node-persist-manager` to v.2.1.0.
- [package]: Bump `oxfmt` to v.0.58.0.
- [package]: Bump `oxlint` to v.1.73.0.
- [package]: Bump `oxlint-tsgolint` to v.0.24.0.
- [package]: Bump `vitest` to v.4.1.10.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [3.0.0] - 2026-06-19

### Breaking changes

- [matterbridge]: Require matterbridge v.3.9.0 with matter v.1.5.1 and matter.js v.0.17.1.

### Changed

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.12.
- [workflow]: Bump `.github\workflows\build.yml` config to v.2.0.4.
- [workflow]: Bump `.github\workflows\codecov.yml` config to v.2.0.5.
- [workflow]: Bump `.github\workflows\publish.yml` config to v.2.0.4.
- [oxlint]: Bump `oxlint` config to v.1.0.13.
- [oxfmt]: Bump `oxfmt` config to v.1.0.3.
- [devcontainer]: Bump `.devcontainer/devcontainer.json` config to v.1.0.4.
- [package]: Bump `.vscode/extensions.json` config to v.1.0.4.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.11] - 2026-06-05

### Breaking changes

- [matterbridge]: Require matterbridge v.3.8.0 with matter v.1.5.1 and matter.js v.0.17.1.

### Added

- [codecov]: Add merge of Jest and Vitest coverage reports. This allows to run both Jest and Vitest tests in the same package and have a unified coverage report in Codecov.

### Changed

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.11.

- [package]: Bump `matter-history` to v.1.2.2.
- [package]: Bump `@eslint/json` to v.2.0.0.
- [package]: Bump `@eslint/markdown` to v.8.0.2.
- [package]: Bump `@types/node` to v.25.9.1.
- [package]: Bump `@vitest/coverage-istanbul` to v.4.1.8.
- [package]: Bump `@vitest/eslint-plugin` to v.1.6.19.
- [package]: Bump `eslint` to v.10.4.1.
- [package]: Bump `eslint-plugin-jsdoc` to v.63.0.1.
- [package]: Bump `eslint-plugin-prettier` to v.5.5.6.
- [package]: Bump `npm-check-updates` to v.22.2.2.
- [package]: Bump `ts-jest` to v.29.4.11.
- [package]: Bump `typescript-eslint` to v.8.60.1.
- [package]: Bump `vitest` to v.4.1.8.

- [oxlint]: Bump `oxlint` config to v.1.0.2.
- [oxfmt]: Bump `oxfmt` config to v.1.0.2.
- [jest]: Bump `jest` config to v.2.0.2.
- [vitest]: Bump `vitest` config to v.2.0.5.
- [eslint]: Bump `eslint` config to v.2.0.5.
- [prettier]: Bump `.prettierignore` config to v.1.0.1.
- [package]: Bump `.devcontainer/devcontainer.json` config to v.1.0.1.
- [package]: Bump `.vscode/settings.json` config to v.1.0.1.
- [package]: Bump `.vscode/extensions.json` config to v.1.0.1.
- [workflow]: Bump `.github\workflows\build.yml` config to v.2.0.4.
- [workflow]: Bump `.github\workflows\codecov.yml` config to v.2.0.4.
- [workflow]: Bump `.github\workflows\publish.yml` config to v.2.0.4.

- [claude]: Move CLAUDE.md in the repo root.
- [claude]: Add .claude/settings.json with permissions configuration.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.10] - 2025-05-11

### Changed

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.8.
- [package]: Add package script `typecheck`.
- [package]: Add Node.js 26 to package `engines` field.
- [workflows]: Add Node.js 26 to `build.yml` Node matrix and remove Node.js 20.
- [agent]: Update `agent instructions`.
- [package]: Bump `jest` to v.30.4.2.
- [package]: Bump `eslint` to v.10.3.0.
- [package]: Bump `typescript-eslint` to v.8.59.2.
- [eslint]: Add `eslint` v.2.0.2 config.
- [jest]: Add `jest` v.2.0.1 config.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.9] - 2025-05-01

### Changed

- [package]: Preliminary compatibility update to `matterbridge 3.8.0`, matter 1.5.1 and matter.js 0.17.0.
- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.6.
- [package]: Bump `typescript` to v.6.0.3.
- [package]: Bump `eslint` to v.10.2.1.
- [package]: Bump `typescript-eslint` to v.8.59.1.
- [package]: Bump `prettier` to v.3.8.3.
- [package]: Bump `node-ansi-logger` to v.3.2.1.
- [package]: Bump `node-persist-manager` to v.2.0.2.
- [package]: Add `.vscode\tasks.json`.
- [package]: Add `.vscode\settings.json`.
- [devcontainer]: Add `Claude Code for VS Code extension` to Dev Container.
- [agent]: Add `.github\copilot-instructions.md` for copilot.
- [agent]: Add `.claude\CLAUDE.md` for claude.
- [agent]: Add agent custom instructions (`testing`) for copilot and claude.
- [agent]: Add agent custom instructions (`matterbridge`) for copilot and claude.
- [devcontainer]: Fix pull of new image.
- [devcontainer]: Update VS Code settings.
- [devcontainer]: Leave matterbridge scripts in the cloned repo.
- [scripts]: Update mb-run script.
- [scripts]: Update package watch script.
- [scripts]: Add prune-releases script.
- [eslint]: Remove `eslint-plugin-promise` (not actively maintained) and add optional @typescript-eslint promise rules.
- [package]: Remove `overrides` that was necessary for eslint-plugin-promise.
- [eslint]: Add `eslint` v.2.0.0 config.
- [prettier]: Add `prettier` v.2.0.0 config.
- [jest]: Add `jest` v.2.0.0 config.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.8] - 2026-03-20

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.3.
- [devcontainer]: Update `Dev Container` configuration.
- [devcontainer]: Add postStartCommand to the `Dev Container` configuration.
- [package]: Refactor `build.yml` to use matterbridge dev branch for push and main for pull requests.
- [package]: Add `type checking` script for Jest tests.
- [package]: Update actions versions in workflows.
- [package]: Bump `eslint` to v.10.1.0.
- [package]: Bump `typescript-eslint` to v.8.57.1.
- [package]: Add `@eslint/json`.
- [package]: Add `@eslint/markdown`.
- [package]: Add `CONTRIBUTING.md`.
- [package]: Add `STYLEGUIDE.md`.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.7] - 2026-02-27

### Added

- [devContainer]: Add the new [dev container setup](https://matterbridge.io/reflector/MatterbridgeDevContainer.html).
- [devContainer]: Add the new [reflector dev container setup](https://matterbridge.io/reflector/Reflector.html).
- [styleguide]: Add [STYLEGUIDE.md](STYLEGUIDE.md).
- [contributing]: Add [CONTRIBUTING.md](CONTRIBUTING.md).

### Changed

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.1.0.
- [package]: Bump `eslint` to v.10.0.2.
- [package]: Bump `typescript-eslint` to v.8.56.1.
- [package]: Replace `eslint-plugin-import` with `eslint-plugin-simple-import-sort`.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.6] - 2026-02-18

### Changed

- [package]: Update dependencies.
- [package]: Bump package to `automator` v.3.0.8.
- [package]: Bump `node-persist-manager` to v.2.0.1.
- [package]: Bump `eslint` to v.10.0.0.
- [package]: Bump `typescript-eslint` to v.8.56.0.
- [eslint]: Use minimatch in ignores.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.5] - 2026-02-07

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.3.0.6.
- [package]: Bumped node-ansi-logger to v.3.2.0.
- [vite]: Added cache under .cache/vite.
- [workflow]: Migrated to trusted publishing / OIDC. Since you can authorize only one workflow with OIDC, publish.yml now does both the publishing with tag latest (on release) and with tag dev (on schedule or manual trigger).

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.4] - 2026-02-01

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.3.0.3.
- [package]: Required Matterbridge v.3.5.0.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.3] - 2026-01-20

### Added

- [matter]: Conformance to Matter 1.4.2 and matterbridge 3.5.x.

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.3.0.0.
- [package]: Refactored Dev Container to use Matterbridge mDNS reflector.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.2] - 2025-12-08

### Changed

- [package]: Updated dependencies.
- [package]: Updated to the current Matterbridge signatures.
- [package]: Requires Matterbridge v.3.4.0.
- [package]: Updated tests to use the Matterbridge Jest module.
- [package]: Bumped package to automator v.2.1.0.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.1] - 2025-11-13

### Changed

- [package]: Updated dependencies.
- [package]: Bumped package to automator v.2.0.12.
- [jest]: Updated jestHelpers to v.1.0.12.
- [workflows]: Use shallow clones and --no-fund --no-audit for faster builds.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [2.0.0] - 2025-10-24

### Changed

- [package]: Bumped platform to v. 2.0.0.
- [package]: Updated dependencies.
- [package]: Bumped package to automator v. 2.0.9
- [jest]: Updated jestHelpers to v. 1.0.9.
- [package]: Require matterbridge 3.3.0.
- [index]: Updated to new signature PlatformMatterbridge.
- [platform]: Updated to new signature PlatformMatterbridge.
- [workflows]: Ignore any .md in build.yaml.
- [workflows]: Ignore any .md in codeql.yaml.
- [workflows]: Ignore any .md in codecov.yaml.
- [workflows]: Improved speed on Node CI.
- [devcontainer]: Added the plugin name to the container.
- [devcontainer]: Improved performance of first build with shallow clone.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.3.1] - 2025-07-29

### Added

- [server]: Added 'server' mode when running in 'bridge' mode.

### Changed

- [package]: Updated package to Automator v. 2.0.3.
- [package]: Updated dependencies.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.3.0] - 2025-06-26

### Added

- [DevContainer]: Added support for the **Matterbridge Dev Container** with an optimized named volume for `node_modules`.
- [GitHub]: Added GitHub issue templates for bug reports and feature requests.
- [ESLint]: Refactored the flat config.
- [ESLint]: Added the plugins `eslint-plugin-promise`, `eslint-plugin-jsdoc`, and `@vitest/eslint-plugin`.
- [Jest]: Refactored the flat config.
- [Vitest]: Added Vitest for TypeScript project testing. It will replace Jest, which does not work correctly with ESM module mocks.
- [JSDoc]: Added missing JSDoc comments, including `@param` and `@returns` tags.
- [CodeQL]: Added CodeQL badge in the readme.
- [Codecov]: Added Codecov badge in the readme.

### Changed

- [package]: Updated package to Automator v. 2.0.1.
- [package]: Updated dependencies.
- [storage]: Bumped `node-storage-manager` to 2.0.0.
- [logger]: Bumped `node-ansi-logger` to 3.1.1.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.2.3] - 2025-04-30

### Changed

- [package]: Require Matterbridge 3.0.0.
- [package]: Update package.
- [package]: Update dependencies.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.2.2] - 2025-04-03

### Changed

- [package]: Require Matterbridge 2.2.6.
- [package]: Update package.
- [package]: Update dependencies.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.2.1] - 2025-02-01

### Changed

- [package]: Require Matterbridge 2.1.0.
- [package]: Update package.
- [package]: Update dependencies.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

## [1.1.0] - 2024-12-14

### Added

- [package]: Verified to work with Matterbridge edge.
- [package]: Require Matterbridge 1.6.6.
- [package]: Matter 1.3 compliant.
- [package]: Update dependencies.

<a href="https://www.buymeacoffee.com/luligugithub"><img src="https://matterbridge.io/assets/bmc-button.svg" alt="Buy me a coffee" width="80"></a>

<!-- Commented out section
## [1.1.2] - 2024-03-08

### Added

- [Feature 1]: Description of the feature.
- [Feature 2]: Description of the feature.

### Changed

- [Feature 3]: Description of the change.
- [Feature 4]: Description of the change.

### Deprecated

- [Feature 5]: Description of the deprecation.

### Removed

- [Feature 6]: Description of the removal.

### Fixed

- [Bug 1]: Description of the bug fix.
- [Bug 2]: Description of the bug fix.

### Security

- [Security 1]: Description of the security improvement.
-->
