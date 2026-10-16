# Automatické testy webu Méně starostí

Automatická kontrola webu [menestarosti.cz](https://menestarosti.cz), neziskového webu pro seniory. Testy hlídají, že web funguje tak, jak má: stránky se načítají, menu a odkazy vedou tam, kam mají, formulář jde vyplnit, web se dá používat na mobilu a hry jdou spustit.

Projekt zároveň slouží jako ukázka mé práce QA testera: požadavky v podobě user stories, testovací plán, automatické testy, bug reporty a průběžné výsledky.

> **Stav:** projekt je v přípravě. Plán je hotový, testy se teprve píšou. Podrobný plán je v [docs/plan.md](docs/plan.md).

## Co automatizace dělá

| běh | kdy | co kontroluje |
|---|---|---|
| Denní rychlý test | každé ráno | hlavní stránky a menu, kontaktní formulář (vyplnění bez odeslání), načtení a spuštění her, úvodní stránka při zvětšení na 200 % |
| Plná kontrola | úterý a pátek ráno a navíc po vydání nového článku, případně ručně | vše z denního testu, k tomu všechny články, funkčnost odkazů, přístupnost pro lidi se zdravotním omezením, čitelnost pro seniory (zvětšení stránky, velké písmo, velikost tlačítek, kontrast), základní SEO, stažení PDF souborů a jedno celé kolo her |
| Týdenní kontrola | v pátek ráno | rychlost webu (PageSpeed) a porovnání s minulým týdnem, verze pluginů WordPressu a jejich známé bezpečnostní chyby |
| Statistiky návštěvnosti | dvakrát týdně | návštěvnost, nejčtenější obsah a doba strávená u obsahu, odkud návštěvníci přicházejí. Běží v samostatném soukromém repozitáři, výsledky nejsou veřejné. |

Plná kontrola v pátek ráno je záměrná: o víkendu chodí na web nejvíc lidí, takže případná chyba se najde dřív, než ji uvidí.

Všechny testy běží na počítači i na mobilu. Web jen čtou: nic na něm nemění, neodesílají formuláře a nepřihlašují se do administrace.

## Jak to funguje

1. Testy jsou napsané v nástroji [Playwright](https://playwright.dev) v jazyce TypeScript. Playwright otevře web ve skutečném prohlížeči a prochází ho jako návštěvník.
2. Testy spouští [GitHub Actions](https://docs.github.com/actions) v pevně daných dnech nebo ručně. Nezávisí na mém počítači.
3. Nový článek se pozná ráno podle seznamu změněných článků, který web zveřejňuje. Když přibyl, spustí se plná kontrola.
4. Když test selže, přijde e-mail od GitHubu. Výsledky každého běhu jsou v záložce Actions a v přehledném reportu.
5. Nalezené chyby zapisuji jako [issues](../../issues) se závažností (`severity:`) a prioritou (`priority:`). Známá chyba, která ještě není opravená, má test označený jako očekávané selhání, aby nehlásil stále totéž.

### Od požadavku k testu

Co má web umět, popisují user stories ve složce `requirements/`. Každá má očekávané chování rozepsané do akceptačních kritérií (AK), včetně chybových a hraničních situací. Testy se na ně odkazují označením, například `US-003` a `AK2`, takže u každého testu je jasné, který požadavek ověřuje. Přehled, které testy pokrývají kterou user story, se vytváří automaticky z kódu testů, aby se nikdy nerozešel se skutečností.

### Role umělé inteligence

Při psaní testů pomáhá [Claude Code](https://claude.com/claude-code): navrhuje user stories a testy, píše kód a vyhodnocuje výsledky. O tom, co je správný výsledek, rozhoduji sám. Samotné automatické běhy probíhají bez AI, takže výsledek testu je pokaždé stejný a dá se zopakovat. Claude nesmí bez mého souhlasu oslabit nebo smazat žádnou kontrolu.

### Jak testy hledají prvky na stránce

Pořadí: atribut `data-testid` → role (tlačítko, odkaz, nadpis) → popisek pole → viditelný text. Jiné způsoby jen výjimečně a se zdůvodněním.

Vzhledem k tomu, že není možnost primárně vyhledávat přes testid je vyhledávání prvků řešeno přes role. Stránky jsou postaveny Wordpress šabloně Kadence - ruční dopsání by dle mého v tomto projektu nepřineslo zásadní výhody. V případě většího projektu by bylo vhodnější použít testid.

Atribut `data-testid` mají hry, které upravuji sám. Na webu ho WordPress neumožňuje, proto testy hledají prvky podle toho, jak je vidí a čtou návštěvník i čtečka obrazovky (například „tlačítko Odeslat“, „pole E-mail“). Takový test zároveň prověří, že web je srozumitelný i pro lidi, kteří ho používají se čtečkou.

## Struktura projektu

```
requirements/        co má web umět: user stories s akceptačními kritérii
docs/                plán projektu, testovací plán, diagramy
src/pages/           jak se web ovládá: stránky a jejich prvky (Page Objecty)
src/helpers/         společné kroky přes více stránek
src/utils/           pomocné funkce bez prohlížeče
src/data/            očekávané texty a testovací data
src/config/          nastavení prostředí
tests/               co se testuje, rozdělené podle oblastí webu
.github/workflows/   kdy se testy spouštějí
```

Každá informace je v projektu jen jednou. Když se na webu změní třeba text tlačítka, opravuje se na jediném místě.

## Podklady

| dokument | obsah |
|---|---|
| [docs/plan.md](docs/plan.md) | plán projektu a schválená rozhodnutí |
| [docs/plany/plan-menestarosti-tests.html](docs/plany/plan-menestarosti-tests.html) | diagram plánu, otevře se v prohlížeči |
| `docs/test-plan.md` | testovací plán (připravuje se) |
| `requirements/` | user stories (připravují se) |

## Spuštění na vlastním počítači

Doplním, až bude projekt založený.
