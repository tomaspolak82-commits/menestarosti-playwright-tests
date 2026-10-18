# CLAUDE.md – menestarosti-playwright-tests

Automated Playwright + TypeScript tests of the live site https://menestarosti.cz (non-profit site for seniors).
Communication with Tomáš in Czech; code, file names, commit messages and code comments in English.

## Sources of truth

- What and how we test: `docs/test-plan.md`. Project state and decisions: `docs/plan.md`.
- What the site must do: user stories in `requirements/US-xxx.md` with acceptance criteria (AK).
- Every piece of information exists exactly once (DRY). Other places only reference it.

## Structure

```
.github/workflows/   smoke.yml, full.yml, weekly.yml (schedule, not push) – not created yet
requirements/        US-xxx.md – the only source of requirements
docs/                plan, test plan, diagrams
src/pages/           Page Objects: locators + actions of one page; components/ for shared parts (menu, footer)
src/helpers/         steps across several pages, built on Page Objects
src/utils/           plain functions without Playwright (sitemap parsing, data generation)
src/config/data/     static test data and expected texts (JSON, or TS where it references pages.ts)
src/config/data/pages.ts  relative paths of site pages
src/config/settings.ts  environment (BASE_URL, keys) from src/config/.env / CI variables
src/config/.env.example  list of variables without values
src/fixtures.ts      fixtures that create Page Objects
src/tests/<area>/    *.spec.ts per area: navigation, pages, articles, contact-form, games,
                     accessibility, readability, seo, links, downloads, performance
```

- This structure is fixed. Do not create new folders without Tomáš's consent.
- If a new file fits nowhere in this list, ask before creating it.

Security checks and visitor statistics are NOT in this public repo (private repo). Never add security findings, plugin vulnerability details or analytics data here.

## Requirements and tests

- Tests reference requirements by ID only, never copy AK text:
  `test.describe('US-002: Contact form', …)`, `test('AK3: invalid e-mail …', …)`.
- Suites are tags, not folders: `@smoke` (daily), `@full` (Tue/Fri, after new article). A test can have both.
- Unclear or contradictory requirement: do not invent behaviour. Mark `test.fixme()` with the AK reference and list the question in the summary.
- Known site bug: GitHub issue + `test.fail()` with the issue link. `fixme` = unclear requirement, `fail` = known bug.
- AK values (limits, expected texts, addresses) are intentionally in both the requirement and `src/config/data/`: the requirement for people, the data for tests. When one changes, update both in the same commit.

## Locators and Page Objects

- Locators exist only in `src/pages/`. Tests and helpers never call `page.locator()` or `getBy*()` (ESLint enforces this).
- Preference: `getByTestId` → `getByRole` → `getByLabel` → `getByText`. The WordPress site has no test ids, so the site uses roles; games use `data-testid`. CSS/XPath only when nothing else works, with a comment why.
- A Page Object holds actions of one page, no assertions. Every Page Object extends `BasePage`.
- Names used to find elements (button text, accessible names) stay in the Page Object, not in tests or helpers.
  Exception: a text that a requirement also states (e.g. a link or button text in an AK) lives in `src/config/data/` and the Page Object reads it from there.

## Tests

- Tests contain scenario steps and `expect` assertions only.
- Page Objects come from `src/fixtures.ts`, never `new SomePage(page)` in a test.
- Each test is independent of order and of other tests.
- Forbidden: `waitForTimeout`, `.only`, `force: true`, `nth()`/`first()` as a substitute for a unique locator. Waiting is done by web-first assertions.
- No hardcoded URLs: `baseURL` comes from settings, tests use relative paths.
- Page paths exist only in `src/config/data/pages.ts`. Tests, helpers, Page Objects and data reference them (`contentPage.open(pages.contact)`). Addresses that are not pages stay as text in `site.ts` (old redirect source, deliberately non-existent address, sitemap file).
- Data and expected messages in `src/config/data/`; generated data from `src/utils/`.

## Browser vs. request checks

- Checks that need no browser (sitemap URLs, redirects with `maxRedirects: 0`, PageSpeed API, file sizes) use the `request` fixture and run once per run in a separate project, not in all five browser projects.
- PageSpeed errors are environment failures, never "site is slow". A missing variable fails fast with a clear message (`src/config/settings.ts`).

## Live site rules

- Tests only read the site: never submit the contact form, never log in, never change anything.
- Contact form tests always leave at least one field invalid AND block every outgoing form request (two independent safeguards).
- Keep the load low: tests are deliberately slowed down (1 worker, pauses from `src/config/data/site.ts` throttle) because the site stopped responding under full speed. Every request to the site goes through `src/helpers/polite-request.ts`; browser tests pause in the `page` fixture. `pause()` is only for pacing, never for synchronisation. No load or penetration testing.
- Do not depend on article texts; the list of pages comes from the sitemap.

## Secrets

- `src/config/.env` (gitignored) locally, GitHub Secrets / variables in CI. Every new variable goes to `src/config/.env.example` without a value.
- Never print secrets in output, logs or reports.

## Before writing or changing tests

1. List what already exists in `src/pages/`, `src/helpers/`, `src/config/data/` and what you will reuse.
2. List what is missing and where you will create it.
3. Reuse existing locators, helpers and data; create new ones only where missing, in the right place.
4. Run affected tests (`npx playwright test <path>`) and `npm run check`; report exact results.

## Definition of done (test)

- References US and AK; passes in all five projects; proven to fail against an intentional fault (show it);
  follows the rules above; `npm run check` passes; Tomáš approved the expected result.

## DRY check after every change

If one locator or one message changed on the site, would more than one file need a fix? If yes, remove the duplication.

## Hard limits

- Never weaken or delete an assertion or change an expected result without Tomáš's approval.
- Commit, push, creating issues or anything public only after Tomáš's OK.
- Pinned dependency versions; upgrades only proposed, never done without approval.
