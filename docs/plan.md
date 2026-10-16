# Plán: automatické testy webu menestarosti.cz (Playwright + GitHub Actions)

## Stav (2026-10-16)

- Tomáš plán přijal a přidal požadavek: statistiky návštěvnosti 2× týdně (viz níže). Pořadí změněno: nejdřív repo a README.
- **Hotovo:** `git init -b main` (lokálně, bez commitu), `README.md` (česky).
- **Hotovo 2026-10-16:** README schválen, 2 commity, veřejné repo https://github.com/tomaspolak82-commits/menestarosti-playwright-tests (push hotový). Další krok: fáze testovací plán.
- **Čeká na Tomáše:** připnout repo na profil (ručně), `testy.md` (zveřejnit v `docs/research/`, nebo nechat mimo repo), `CLAUDE.md` (zatím odloženo do založení projektu).
- **Struktura a pravidla projektu (2026-10-16):** Tomáš dodal pravidla (Playwright + TypeScript, DRY, `src/pages|helpers|utils|data|config`, `requirements/` s user stories). Upravená verze půjde do `CLAUDE.md` repa. Odchylky od šablony: tři workflow podle času místo `tests.yml` na push, k tomu `docs/`, `CLAUDE.md`, `.mcp.json`, šablona bug reportu.
- **Nález (neověřeno v prohlížeči):** úvodní stránka načítá Google tag `GT-KFT2ZZ39` (Site Kit) a v HTML není žádný cookie banner ani režim souhlasu. Ověřit v prohlížeči.

### Stav 2026-10-16, konec dne

- Commitnuto lokálně (Tomášovo OK „comitni aktuální stav“), **push zatím neproběhl, čeká na OK**.
- `.env` hotový a otestovaný Tomášem (BASE_URL + PAGESPEED_API_KEY). `private/nalezy.md` (gitignored): 7 nálezů na webu s návrhem priorit.
- TypeScript 7: typescript-eslint ho nepodporuje (ověřeno pokusem); oficiální obchvat přes npm aliasy funguje (ověřeno ve scratch). Doporučeno zůstat na 6.0.3 – čeká na Tomášovo rozhodnutí.
- Další krok: Tomáš odpoví na otevřené otázky v `requirements/US-001` až `US-003` (návrhy, nejsou schválené), rozhodne o veřejných issues z nálezů 2, 4–7, pak psaní prvních testů.
- `testy.md` stále mimo repo (nerozhodnuto).

### Stav 2026-10-16 večer (Tomáš mimo PC, vše necommitováno)

- Test plán schválen Tomášem (přečetl), doplněno: seznam chyb k opravě `docs/bugs.md` generovaný z issues; důkaz v bug reportu povinný jen u občasných/jednorázových chyb.
- Založen projekt lokálně: `package.json` (pevné verze: @playwright/test 1.64.1, typescript 6.0.3 – ne 7.0.2, typescript-eslint 8.71.2 podporuje jen TS < 6.1; eslint 10.13.0, @eslint/js 10.0.1, eslint-plugin-playwright 2.12.1, dotenv 18.0.8, @types/node 24.19.2), `playwright.config.ts` (5 projektů: Desktop Chrome/Firefox/Safari, Galaxy S24, iPhone 15; workers 2, retries 1 v CI), `src/config/settings.ts`, `BasePage.ts`, `fixtures.ts`, `tsconfig.json`, `eslint.config.mjs` (zákaz lokátorů v testech a helperech, waitForTimeout, force, only – ověřeno zkušebním souborem), `.gitignore`, `.gitattributes`, `.env.example`, `CLAUDE.md`. `npm run check` prochází, npm audit 0 zranitelností.
- Playwright MCP odloženo: `@playwright/mcp` je jen 0.0.x a závisí na alfa verzi Playwrightu (pravidlo: žádné alfa/beta bez souhlasu).
- README sladěn s test plánem (návrh, čeká na OK).
- Ověřeno na webu (Chromium, jen čtení): 404 stránka OK; cookies `_ga` se nastaví hned při načtení a na stránce není cookie lišta; při zvětšení základního písma (simulace přes písmo kořene stránky) zůstává text článků 21 px; bez vodorovného posouvání při 640 i 320 px.

### Stav 2026-10-16 odpoledne (Tomáš mimo PC)

- `docs/test-plan.md` dopsán (části 1–10), čeká na Tomášovo přečtení a schválení, pak commit „Add test plan“ + push.
- Návrhy k diskusi `requirements/US-001.md` (navigace), `US-002.md` (formulář), `US-003.md` (rychlost), necommitováno.
- Ověřeno: WCAG 1.4.4 (200 %, AA), 1.4.10 (320 px, AA), 2.5.8 (24 px, AA, výjimka pro odkazy ve větě), 2.5.5 (44 px, AAA), 1.4.3 (4,5 : 1, AA), 1.4.6 (7 : 1, AAA); `npx playwright test --list` existuje (Context7); Google: Core Web Vitals jsou signál pro řazení, relevance má přednost. Neověřeno: Playwright nemá přímé API na zoom prohlížeče (v dokumentaci jsem ho nenašel), blokování odeslání formuláře (`page.route`).
- Po schválení test plánu sladit README (odkaz na plán, bezpečnost, denní rychlost).

### Čitelnost pro seniory (nový požadavek 2026-10-16, schváleno)

- Oblast `tests/readability/` + 1–2 user stories. Plná kontrola: všechny stránky a články; denní test: úvodní stránka a menu při zvětšení 200 %. Počítač i mobil.
- Kontroly: zvětšení 200 % (obsah i ovládání dostupné), zvětšené písmo v nastavení, bez vodorovného posouvání, minimální písmo, velikost tlačítek a odkazů, kontrast.
- Hranice (Tomáš): základní písmo min. 18 px (současný stav); tlačítka a odkazy = současný stav (změřit, test hlídá zhoršení, prvky pod 44 × 44 px jen vypsat); kontrast 4,5 : 1 = chyba, 7 : 1 = upozornění.
- Ověřit: čísla bodů WCAG (1.4.4, 1.4.10, 2.5.8, 2.5.5, 1.4.6 jsou z paměti), jak Playwright simuluje zvětšení (asi zúžením okna).
- Podezření k ověření v prohlížeči: písmo má napevno horní hranici 21 px (`clamp(18px, …, 21px)`), zvětšení písma v nastavení prohlížeče možná nefunguje (Ctrl+plus ano).

### Statistiky návštěvnosti (nový požadavek 2026-10-16)

- 2× týdně (návrh: pondělí a čtvrtek ráno): návštěvnost, nejčtenější obsah, doba strávená u obsahu, zdroje návštěv, zařízení, hledané výrazy z Google.
- Zdroj: Google Analytics 4 přes Site Kit (tag ověřen), případně Search Console. Přístup přes API, podrobnosti ověřit v dokumentaci při implementaci.
- Výsledky nejsou veřejné: samostatné soukromé repo. Ve veřejném README jen zmínka.
- Zatím jen tabulky a grafy, bez slovního rozboru. Když Tomáš výstupu nebude rozumět, upraví se.

## Stav (2026-10-14, konec session)

- **Fáze:** plánování dokončeno, **plán NENÍ schválený**. Tomáš si ho chce nejdřív přečíst (2026-10-14). Na začátku příští session počkat na jeho připomínky nebo schválení, teprve pak fáze 2. Nic se neimplementovalo.
- **Hotovo:** tento plán, diagram `docs/plany/plan-menestarosti-tests.html`, šablona `docs/plany/sablona.html`.
- **Neexistuje zatím:** Git repo (žádný `git init`), `package.json`, testy, repo na GitHubu, poznámka ve znalostní databázi.
- **Tomášův soubor `testy.md`** (výzkum) leží v kořeni složky, nepřesouvat bez OK (plán: `docs/research/testy.md`).
- **Další krok po schválení:** fáze 2, testovací plán `docs/test-plan.md`. Pak fáze 3, náhled 2–3 test casů.
- **Na Tomášovi:** schválit plán, dohledat zdroj Skládačky, později dodat seznam pluginů a klíč k PageSpeed API.

### Jak navázat v nové session

1. Otevřít Claude Code v `C:\git\menestarosti-tests`, nebo v knowledge-base a přidat složku přes `/add-dir C:\git\menestarosti-tests`.
2. Napsat: „Přečti docs/plan.md a pokračujeme.“
3. Claude shrne stav a zeptá se na schválení plánu.

### Průběh dohody (jak se k rozhodnutím došlo)

- Dřívější podklady k testům se nenašly (Claude Desktop?), začalo se znovu.
- Tomáš původně navrhoval, aby testy spouštěl Claude. Dohodnuto: testy běží v GitHub Actions (zdarma, nezávisle na PC a předplatném, pro portfolio podstatné), Claude spustí plnou kontrolu na pokyn a vyhodnotí výsledky.
- Tomášův požadavek: po každém vydání článku plná kontrola, každý den rychlý test (stránky, formuláře, responzivita), týdně PageSpeed s doporučeními, hlídání pluginů, testy her.
- Lokátory: Tomáš chtěl testid. Web ho neumožňuje, proto role a popisky. Do dokumentace se zapíše: „Vzhledem k tomu, že není možnost primárně vyhledávat přes testid, a vzhledem k povaze webu a množství návštěvníků se prozatím vyhledávání prvků řeší přes role.“ Ve hrách testid.
- Bugy: kromě závažnosti i priorita. Test casy rozdělené podle oblastí.

## Kontext

Tomáš chce automatickou kontrolu webu menestarosti.cz, která poběží sama v pravidelném intervalu. Zároveň má sloužit jako ukázka do portfolia QA testera. Dřívější podklady se nenašly, začínáme od nuly. Podkladem je Tomášův výzkum `C:\git\menestarosti-tests\testy.md` (agentická automatizace testování).

Co jsem ověřil (2026-10-14):
- Web: WordPress 7.1.3, šablona Kadence 1.5.2, Kadence Blocks 3.8.0, Site Kit 1.189.0. Soubory `readme.txt` pluginů vracejí 403 (verified).
- Sitemapy: post, page, category. Stránka `/ochrana-osobnich-udaju/` v sitemapě chybí, i když je v patičce (verified). Oprava 2026-10-16: `/clanky/` v sitemapě je (v post-sitemap), původní zápis, že chybí, neplatí.
- Na `/kontakty/` je formulář Kadence (`kb-form`). Adresa `/kontakt/` se přesměruje na `/kontakty/` (verified).
- Hry: Skládačka je iframe `wp-content/uploads/2026/09/skladacka.html`, míchá dílky náhodně, obtížnost 3–6 a kategorie. Poznej podvod je na subdoméně, repo `poznej-podvod` (verified). Zdroj Skládačky není znám.
- `data-testid` web nepoužívá. Kadence Blocks má zdarma jen CSS třídu a HTML kotvu (estimate).
- Playwright: test id je „the most resilient“, ale „not user facing“. Pro to, co vidí uživatel, doporučuje role a text (verified, playwright.dev/docs/locators).
- GitHub Actions je u veřejného repa zdarma. Naplánované běhy se vypnou po 60 dnech bez aktivity a můžou se zpozdit (verified).
- PageSpeed API: klíč je volitelný, ale doporučený pro automatické dotazy (verified).

## Rozhodnutí (schválil Tomáš)

| oblast | rozhodnutí |
|---|---|
| Denní běh (smoke) | každé ráno: stránky a menu, formulář bez odeslání, hry: načtení a start; vše na počítači i mobilu |
| Plná kontrola | pevně úterý a pátek ráno (o víkendu nejvíc návštěv) + po vydání článku (ranní kontrola změn přes REST API) nebo ručně (tlačítko / Claude přes `gh workflow run`): vše z denního + všechny články, odkazy, přístupnost (axe), SEO, stažení PDF, hry: jedno celé kolo |
| Týdenní běh | pátek ráno: PageSpeed (3 měření, medián, mobil i počítač, úvodní stránka + článek + Hry, trend proti minulému týdnu, jen upozornění) a kontrola verzí pluginů a zranitelností |
| Rady k PageSpeed | česky píše Claude na pokyn „PageSpeed“ z výsledků v repu, CI zůstává bez AI |
| Pluginy | seznam pluginů dodá Tomáš (v repu), veřejně viditelné verze proti wordpress.org, zranitelnosti, bez hesla administrátora, Tomáš zapne automatické aktualizace |
| Lokátory | jen v `src/pages/`; pořadí `getByTestId` → `getByRole` → `getByLabel` → `getByText`, CSS jen s komentářem. Web testid nemá (WordPress), proto role; hry: `data-testid` (úprava her po Tomášově OK) |
| Zařízení | počítač + mobil |
| Upozornění | e-mail od GitHubu |
| Repo | veřejné `tomaspolak82-commits/menestarosti-playwright-tests` (vytvořeno 2026-10-16, popis + štítky), místní složka zůstává `C:\git\menestarosti-tests`, TypeScript |
| Formulář | jen bez odeslání |
| Známé chyby | issue + test jako očekávané selhání |
| Výsledky | odznak v README + report na GitHub Pages |
| Podklady | testovací plán, user stories s AK v `requirements/US-xxx.md` (místo ručních test casů, DRY), testy odkazují na US/AK, přehled pokrytí generovaný z `npx playwright test --list` (ověřit), bug reporty jako issues se `severity:` a `priority:` |
| Znalostní databáze | `10-projects/menestarosti/docs/automated-tests.md` (co, kdy, kde výsledky, odkaz na repo) + řádek v README a CLAUDE.md projektu (ukázat před úpravou); výsledky jen v repu |
| Playwright MCP | jen v `.mcp.json` repa testů, pevná verze, ne v CI |
| Způsob práce | (změna 2026-10-16) nejdřív společně probereme oblast: co kontrolujeme a proč; pak Claude napíše testy, Tomáš je schválí |

## Převzato z výzkumu `testy.md`

- Člověk schvaluje očekávaný výsledek, CI běží bez AI, Claude nesmí bez souhlasu oslabit nebo smazat kontrolu.
- Každý nový test dokáže selhat proti úmyslné chybě (zápis v PR / test case).
- `CLAUDE.md` v repu (do 200 řádků): definice „hotovo“, zákaz `waitForTimeout`, `.only`, `force`, `nth()` bez důvodu, testy jen čtou ostrý web.
- CI: typecheck + ESLint + testy, trace při prvním opakování.
- Jeden řízený postup, žádný roj agentů. Skilly případně později v `knowledge-base/skills/` (pravidlo databáze), ne v `.claude/skills` repa.
- Nepřebíráme: evaly, healer, mutační testy, multiagentní role. Jsou pro aplikaci s vývojovým týmem, ne pro malý ostrý web.

## Struktura repa (schváleno 2026-10-16)

```
menestarosti-tests/
├── .github/
│   ├── workflows/  smoke.yml  full.yml  weekly.yml
│   └── ISSUE_TEMPLATE/bug_report.yml
├── requirements/                US-001.md … (AK vč. negativních a hraničních)
├── docs/  plan.md  test-plan.md  plany/  research/testy.md
├── src/
│   ├── pages/  BasePage.ts  HomePage.ts  ArticlePage.ts  ContactPage.ts  GamesPage.ts
│   │   └── components/          MainMenu.ts, Footer.ts
│   └── helpers/  utils/  data/  config/settings.ts  fixtures.ts
├── tests/
│   ├── navigation/  pages/  articles/  contact-form/  games/
│   └── accessibility/  readability/  seo/  links/  downloads/  performance/
│       (wordpress-plugins přesunuto do soukromého repa s bezpečnostními kontrolami)
├── playwright.config.ts  .env.example  .gitignore  package.json  tsconfig.json
└── CLAUDE.md  README.md  .mcp.json
```

- Sady se rozlišují značkami `@smoke` / `@full`, ne složkami.
- Mobil = druhé zařízení v `playwright.config.ts`, ne složka; zvlášť jen věci, které jsou jen na mobilu.
- PageSpeed a pluginy jako Playwright testy (API), ne `scripts/` (porovnání s minulým týdnem ověřit ve fázi 8).

## Fáze (každá končí ukázkou)

Změna 2026-10-16: fáze 3 jsou user stories místo test casů. Na začátek přibylo „Repo a README“ a zveřejnění na GitHubu (dřív fáze 11), před GitHub Actions přibyla fáze „Statistiky návštěvnosti“. Aktuální pořadí je v diagramu.

1. Diagram plánu v `docs/plany/` (hotovo spolu s tímto plánem).
2. Testovací plán `docs/test-plan.md`, včetně zdůvodnění lokátorů. → čeká na tebe
3. User stories v `requirements/`: náhled 2–3 kusů, po schválení zbytek, AK i pro negativní a hraniční případy. → čeká na tebe
4. Založení projektu: `git init`, ověření verzí (`npm view`), Context7, Playwright + TypeScript + ESLint, Playwright MCP, `CLAUDE.md`. → OK na commit
5. Denní sada společně (Page Objecty, role, formulář, mobil, hry: start).
6. Hry: `data-testid` a testovací režim pro Poznej podvod (jeho repo) a Skládačku (najít zdroj, jinak vzít soubor z webu a založit pro něj repo). Úpravy ostrých her. → čeká na tebe
7. Plná sada: články ze sitemapy, odkazy (externí jen 404/410 s opakováním), axe, SEO, PDF, celé kolo her.
8. Týdenní běh: PageSpeed (klíč založí Tomáš jako GitHub Secret), verze pluginů a zdroj zranitelností (ověřit, co jde bez placení). → čeká na tebe (klíč, seznam pluginů)
9. Známé chyby jako issues + očekávaná selhání. → čeká na tebe (veřejné)
10. GitHub Actions: smoke, full (kontrola změněných článků), weekly, Pages, odznak, ošetření 60 dnů.
11. Vytvoření veřejného repa a push. → čeká na tebe
12. Záznam do znalostní databáze. → čeká na tebe

## Otevřené body

- Zdroj Skládačky (Tomáš hledá, náhradní řešení ve fázi 6).
- Zdroj zranitelností pluginů bez placení (ověřit ve fázi 8).
- Úplný seznam pluginů (dodá Tomáš).
- Ochrana proti vypnutí po 60 dnech (ověřit, jestli GitHub předem upozorní).

## Ověření

- Lokálně `npx playwright test --grep @smoke` / `@full` na obou zařízeních, výsledek ukážu.
- Každý test doloženě selže proti úmyslné chybě.
- CI: ruční spuštění všech tří workflow, zelený běh, report na Pages, odznak.
- Simulace změněného článku spustí plnou sadu.
- Po prvním ranním a prvním týdenním naplánovaném běhu ověřit, že proběhly samy.
