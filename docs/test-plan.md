# Testovací plán – menestarosti.cz

| | |
|---|---|
| Autor | Tomáš Polák |
| Stav | návrh ke schválení |
| Poslední změna | 2026-10-16 |

Tento dokument je zdrojem pravdy pro to, co, kdy a jak se testuje. README ho jen shrnuje.

## 1. Účel a kontext

[menestarosti.cz](https://menestarosti.cz) je neziskový web pro seniory a jejich blízké. Přináší články o bezpečnosti, úřadech a technologiích, materiály ke stažení a jednoduché hry.

Návštěvníci jsou většinou starší lidé, kteří často používají mobil, mají horší zrak a méně jistou ruku a technické potíže snadno vyhodnotí jako „web nefunguje“. Testy proto kromě běžné funkčnosti hlídají i rychlost, čitelnost a ovladatelnost.

Cílem testování je:

- zjistit chybu dřív, než ji uvidí návštěvník,
- udržet web rychlý a bezpečný, aby ho Google dál nabízel ve vyhledávání,
- ukázat postup QA testera od požadavků přes automatické testy po bug reporty.

## 2. Rozsah

### Co testujeme

| oblast | co patří dovnitř |
|---|---|
| Dostupnost a navigace | všechny stránky a články ze sitemapy se načtou, hlavní menu a patička vedou na správná místa, přesměrování starých adres |
| Rychlost | PageSpeed na mobilu a počítači, vývoj v čase |
| Bezpečnost | pasivní kontrola: jen čtení toho, co web veřejně ukazuje, a verze pluginů (viz níže) |
| Čitelnost pro seniory | zvětšení stránky na 200 %, zvětšené písmo, minimální velikost písma, velikost tlačítek a odkazů, kontrast |
| Přístupnost | automatická kontrola přístupnosti (axe) |
| Kontakty | kontaktní formulář: pole, popisky, chybová hlášení (bez odeslání) |
| Články a materiály | obsah článku se zobrazí, odkazy v článcích fungují, PDF ke stažení jdou stáhnout |
| SEO | titulek, popis, nadpisy, sitemapa, kanonické adresy |
| Hry | načtení, spuštění a jedno celé kolo (Poznej podvod, Skládačka) |

Seznam stránek a článků se do testů nepíše ručně. Testy ho při každém běhu načtou ze sitemapy webu, takže nový článek se otestuje automaticky.

### Co netestujeme

- **Administraci WordPressu.** Testy se nepřihlašují a nic na webu nemění.
- **Skutečné odeslání formuláře.** Odeslání by posílalo e-maily a zakládalo zprávy.
- **Věcnou správnost článků.** To je redakční práce, ne testování.
- **Služby třetích stran samotné** (Google Analytics, vložená videa a podobně). Ověřujeme jen, že kvůli nim web nepřestane fungovat.
- **Zátěžové a penetrační testy.** Na ostrém webu by mohly způsobit výpadek nebo by je hosting vyhodnotil jako útok.

### Bezpečnostní kontroly

Součástí testování jsou i pasivní bezpečnostní kontroly. Pouze čtou informace, které web veřejně ukazuje komukoli, a nikdy se nepokoušejí do webu proniknout. Jejich přesný obsah, nastavení i výsledky jsou záměrně mimo tento veřejný repozitář: popis toho, co se kontroluje a co bylo nalezeno, by mohl posloužit jako návod k útoku. Kontroly proto běží v samostatném soukromém repozitáři a nalezené problémy se řeší neveřejně.

## 3. Rizika a priority

Pořadí určuje, co se testuje nejdřív a nejdůkladněji. Při nedostatku času nebo při více chybách najednou se řeší vyšší priorita.

| # | riziko | dopad | jak ho testy pokrývají |
|---|---|---|---|
| 1 | Web nejde otevřít nebo se rozpadne vzhled | nikdo se nedostane k obsahu; při delším výpadku hrozí ztráta pozic ve vyhledávání | denní test hlavních stránek na všech zařízeních |
| 2 | Pomalý web | lidé nechtějí čekat a pomalý web považují za nefunkční; rychlost je i jeden ze signálů pro pořadí ve vyhledávání Google | denní měření úvodní stránky na mobilu, týdenní podrobné měření s trendem |
| 3 | Bezpečnostní slabina (zastaralý plugin, zbytečně prozrazené informace) | napadený web může škodit návštěvníkům a Google i prohlížeče před ním mohou návštěvníky varovat, což je odradí | týdenní pasivní kontrola v soukromém repozitáři |
| 4 | Špatná čitelnost a ovladatelnost pro seniory | senior text nepřečte, netrefí tlačítko nebo se ztratí a odejde | čitelnost a přístupnost v plné kontrole, zvětšení úvodní stránky v denním testu |
| 5 | Nejde najít kontakt nebo vyplnit formulář | senior se nedozví potřebnou pomoc ani se nemůže zeptat | denní test formuláře bez odeslání |
| 6 | Rozbitý odkaz, článek nebo materiál ke stažení | návštěvník nedostane informaci, kvůli které přišel | plná kontrola všech článků, odkazů a PDF |
| 7 | Hra nejde spustit nebo dohrát | nepříjemné, ale nikoho neohrozí | spuštění v denním testu, celé kolo v plné kontrole |

## 4. Přístup

### Sady testů

| sada | kdy | obsah |
|---|---|---|
| Denní (`@smoke`) | každé ráno | hlavní stránky se načtou, menu a patička vedou správně, formulář: pole, popisky a chybová hlášení bez odeslání, hry se načtou a spustí, úvodní stránka při zvětšení na 200 %, rychlost úvodní stránky na mobilu (prostřední hodnota ze tří měření) |
| Plná (`@full`) | úterý a pátek ráno, po vydání článku, ručně | vše z denní sady a navíc všechny stránky a články ze sitemapy, odkazy, PDF ke stažení, přístupnost (axe), čitelnost na všech stránkách, SEO, jedno celé kolo her |
| Týdenní | pátek ráno | rychlost: tři měření (výsledkem je prostřední hodnota), mobil i počítač, úvodní stránka, jeden článek a stránka s hrami, porovnání s minulým týdnem |
| Bezpečnost | jednou týdně | pasivní kontroly v soukromém repozitáři (viz část 2) |

- Sady se rozlišují značkou u testu, ne složkou. Jeden test tak může patřit do denní i plné sady.
- Kontroly, které nepotřebují prohlížeč (adresy ze sitemapy, přesměrování, rychlost přes PageSpeed, velikost souborů), běží jako přímé dotazy na server jen jednou za běh, ne v každém z pěti prohlížečů. Šetří to čas i ostrý web.
- Nový článek se pozná ráno podle seznamu změněných článků, který web zveřejňuje přes své rozhraní (REST API).
- Externí odkazy (na jiné weby) se kontrolují jen na „stránka neexistuje“ (chyby 404 a 410) a s jedním opakováním. Cizí web může být chvíli nedostupný a to není chyba našeho webu.

### Od požadavku k testu

1. Co má web umět, popisují user stories v `requirements/`. Každá má akceptační kritéria (AK), včetně chybových a hraničních situací. Hranice (například minimální velikost písma) jsou uvedené v AK, ne v tomto plánu.
2. Návrh AK vychází z běžných technik testovacího návrhu: ekvivalenční třídy (například platný a neplatný e-mail) a hraniční hodnoty (například nejmenší povolená velikost tlačítka).
3. Každý automatický test se odkazuje na user story a AK, které ověřuje. Přehled pokrytí se vytváří z kódu testů automaticky.

### Automatické a ruční testování

- Automatické testy hlídají, že se nic nezhoršilo (regrese).
- Ruční průzkumné testování (volné procházení webu s cílem najít problém) dělám před větší změnou webu (nová šablona, nová hra, větší úprava menu) a na skutečném telefonu, protože napodobený telefon nezachytí všechno. Nálezy zapisuji jako issues stejně jako u automatických testů.

### Známé chyby a nestabilní testy

- Známá a ještě neopravená chyba má issue a test je označený jako očekávané selhání. Až se chyba opraví, test na to upozorní a označení se odstraní.
- Test, který jednou projde a jednou ne bez změny webu, je chyba testu, ne webu. V automatickém běhu se neúspěšný test jednou zopakuje a uloží se podrobný záznam (trace) pro rozbor. Opakované selhání se neschovává, ale opravuje.

## 5. Prostředí

### Testuje se jen ostrý web

Web nemá testovací kopii, testy proto běží proti skutečnému webu `https://menestarosti.cz`. Z toho plyne:

- testy web jen čtou, nic neodesílají a nikam se nepřihlašují,
- testy nesmí web zahltit: jsou záměrně zpomalené. Běží vždy jen jeden test najednou, mezi dotazy na server a mezi testy v prohlížeči jsou pauzy (nastavení v `src/data/site.json`). Důvod: při plné rychlosti web během běhu na chvíli přestal odpovídat. Na rychlosti běhu nezáleží,
- obsah se může měnit (nový článek, upravený text), proto testy nesmí záviset na konkrétních textech článků; seznam článků berou ze sitemapy.

### Prohlížeče a zařízení

Každý test běží v pěti kombinacích:

| kombinace | jádro prohlížeče | co zastupuje |
|---|---|---|
| Chrome na počítači | Chromium | Chrome, Edge |
| Firefox na počítači | Firefox | Firefox |
| Safari na počítači | WebKit | Safari na Macu |
| Android | Chromium, mobilní zobrazení | Chrome na telefonu s Androidem |
| iPhone | WebKit, mobilní zobrazení | Safari na iPhonu |

- Telefony nejsou skutečné, Playwright napodobí jejich velikost obrazovky, dotykové ovládání a chování prohlížeče. Konkrétní modely se vyberou z přednastavených zařízení Playwrightu při založení projektu.
- Firefox na mobilu Playwright napodobit neumí.
- Údaje o tom, jaká zařízení návštěvníci skutečně používají, zatím nejsou k dispozici. Výběr se upraví podle statistik návštěvnosti.

### Kde testy běží

- Automaticky v GitHub Actions na serveru s Linuxem, podle rozpisu v části 4.
- Ručně na počítači s Windows při psaní a ladění testů.
- Časy spouštění v GitHub Actions se zadávají v čase UTC a běh se může o několik minut zpozdit.

### Přístupové údaje

Klíč k PageSpeed API a další přístupové údaje jsou uložené jen v nastavení repozitáře (GitHub Secrets) a v místním souboru `.env`, nikdy v kódu ani ve výstupech testů.

## 6. Kritéria

### Kdy je běh v pořádku

- Všechny testy prošly, nebo selhaly jen testy označené jako očekávané selhání (známé chyby).
- Kontroly kódu (typová kontrola a ESLint) prošly.

Známé chyby nejsou v pořádku jen proto, že běh prošel. Přehledně je ukazuje seznam chyb k opravě (část 8).

### Co se stane, když test selže

Každé selhání se zařadí do jedné ze tří skupin:

| příčina | příklad | co dál |
|---|---|---|
| chyba webu | rozbitý odkaz, chybějící PDF | issue se závažností a prioritou, test zůstává beze změny |
| chyba testu | změnil se text tlačítka, test hledá starý | oprava testu; pokud se tím mění očekávaný výsledek, schvaluji ji já |
| chyba prostředí | výpadek GitHubu, PageSpeed neodpověděl | opakování běhu, bez issue; při opakování se zapíše do části 10 |

### Kdy je test hotový

- Odkazuje se na user story a AK, které ověřuje.
- Projde ve všech pěti kombinacích prohlížečů a zařízení.
- Doloženě selže proti úmyslné chybě (například změněný očekávaný text). Test, který nikdy nemůže selhat, nic nehlídá.
- Dodržuje pravidla projektu (lokátory jen v Page Objectech, žádné pevné čekání, žádné natvrdo zapsané adresy).
- Typová kontrola a ESLint prošly.
- Schválil jsem očekávaný výsledek.

### Chyby testovací infrastruktury

- Když PageSpeed neodpoví nebo vrátí chybu, výsledek se nevyhodnotí jako „web je pomalý“, ale jako chyba prostředí.
- Když chybí potřebný klíč nebo proměnná prostředí, test hned selže se srozumitelnou hláškou, co chybí.

### Hranice pro rychlost

Doplníme po prvních měřeních s klíčem k PageSpeed. Návrh pravidla:

- **Denní měření:** test selže, když skóre úvodní stránky na mobilu klesne pod pevnou spodní hranici, nebo výrazně pod průměr posledních dní.
- **Týdenní měření:** jen upozornění a trend, test neselhává. Jedno měření rychlosti hodně kolísá a falešné poplachy by kontrolu znehodnotily.

## 7. Chyby: závažnost a priorita

Každá nalezená chyba se zapíše jako issue v tomto repozitáři a dostane dva štítky: závažnost a prioritu. Výjimkou jsou bezpečnostní nálezy, ty se řeší v soukromém repozitáři (viz část 2).

- **Závažnost** (`severity:`) říká, jak moc chyba návštěvníkovi vadí. Určuje ji tester podle dopadu.
- **Priorita** (`priority:`) říká, jak rychle se má chyba opravit. Určuje ji vlastník webu podle závažnosti, počtu zasažených návštěvníků a pořadí rizik v části 3.

Obvykle jdou spolu, ale ne vždy. Překlep v názvu webu na úvodní stránce má nízkou závažnost (nic nepřestane fungovat), ale vysokou prioritu (vidí ho každý návštěvník). Rozbitá stránka viditelná jen ve Firefoxu, který návštěvníci téměř nepoužívají, může mít vysokou závažnost a nižší prioritu.

### Závažnost

| štítek | význam | příklad na tomto webu |
|---|---|---|
| `severity:critical` | web nebo jeho hlavní část nejde použít, nebo hrozí škoda návštěvníkům | web se nenačte, úvodní stránka je prázdná, web je napadený |
| `severity:high` | důležitá funkce nefunguje a nejde ji obejít | nejde vyplnit kontaktní formulář, menu na mobilu nejde otevřít, PDF ke stažení chybí |
| `severity:medium` | funkce nefunguje správně, ale dá se obejít, nebo výrazně zhoršuje použití | nefunkční odkaz v článku, text se při zvětšení na 200 % překrývá, rychlost výrazně klesla |
| `severity:low` | kosmetická chyba, která použití neomezuje | překlep, posunutý obrázek, chybějící popis stránky pro vyhledávače |

### Priorita

| štítek | význam |
|---|---|
| `priority:p1` | opravit hned, ještě týž den |
| `priority:p2` | opravit do týdne |
| `priority:p3` | opravit do 14 dnů |
| `priority:p4` | zapsáno, oprava není plánovaná; vrátím se k ní, pokud se situace změní |

### Náročnost a kdo opravuje

Dva pomocné štítky, které neovlivňují prioritu, ale pomáhají naplánovat pořadí oprav se stejnou prioritou. Rychlé opravy jdou první.

| štítek | význam |
|---|---|
| `effort:s` | malá oprava, do 30 minut (text, odkaz, nastavení) |
| `effort:m` | střední oprava, do pár hodin |
| `effort:l` | velká oprava, více dní nebo s nejistým výsledkem |
| `fixer:claude` | opravu připraví Claude a já ji zkontroluji a schválím: změnu v kódu (testy, hry) provede přímo, u obsahu ve WordPressu (například článek) připraví upravenou verzi bloků stránky, kterou do WordPressu vložím já |
| `fixer:me` | opravu provedu sám (například nastavení WordPressu, aktualizace pluginu); Claude může připravit postup |

Kdo a jak chybu opraví, se dohodne u každé chyby zvlášť podle toho, o jaký problém jde. Trvalý přístup do administrace WordPressu Claude nemá. Pokud je to potřeba, dostane podklady (například jak je stránka složená z bloků), nebo přístup na konkrétní úkol.

### Co obsahuje bug report

Šablona issue v `.github/ISSUE_TEMPLATE/bug_report.yml` vyžaduje:

1. **Název:** co nefunguje a kde, jednou větou („Kontakty: formulář nepřijme e-mail s tečkou před zavináčem“).
2. **Prostředí:** prohlížeč a zařízení (jedna z pěti kombinací v části 5), případně skutečné zařízení.
3. **Kroky k zopakování:** očíslované, od otevření stránky.
4. **Očekávaný výsledek:** odkaz na user story a AK, pokud existují.
5. **Skutečný výsledek:** co se stalo místo toho.
6. **Četnost:** vždy, občas, jednou.
7. **Důkaz:** snímek obrazovky, záznam z testu (trace) nebo odkaz na běh v GitHub Actions. Povinný jen u chyb, které se projeví občas nebo jednou. Chybu, která se projeví vždy, zopakují kroky kdykoli, důkaz je tam nepovinný. U chyby z automatického testu se vždy přidá odkaz na běh, protože snímek a záznam v něm vzniknou samy.
8. **Závažnost, priorita, náročnost a kdo opravuje:** štítky podle tabulek výše.

### Životní cyklus chyby

1. **Nalezení:** chybu najde automatický test nebo ruční průzkum.
2. **Návrh:** Claude sepíše návrh bug reportu včetně štítků a způsobu opravy.
3. **Kontrola:** chybu sám zopakuji podle kroků v návrhu, text zkontroluji a případně ho s Claudem doladíme. Issue je veřejné, proto se bez mého OK nezakládá.
4. **Zápis:** po mém OK založí Claude issue se schváleným textem a štítky (příkazem `gh issue create`). Pokud chybu našel automatický test, označí se jako očekávané selhání s odkazem na issue (část 4).
5. **Oprava** podle štítku `fixer:`.
6. **Ověření:** test, který chybu našel, znovu projde a označení očekávaného selhání se odstraní. Chyba nalezená ručně dostane nový automatický test, pokud to jde, aby se nevrátila.
7. **Uzavření issue** s odkazem na běh, ve kterém test prošel.

## 8. Výstupy

| výstup | kde | pro koho |
|---|---|---|
| Výsledek každého běhu | záložka Actions v repozitáři | přehled, co kdy běželo a jak dopadlo |
| E-mail při selhání | e-mail od GitHubu | upozornění, že je potřeba se podívat |
| Report posledního běhu | GitHub Pages (odkaz v README) | podrobnosti k testům, snímky obrazovky a záznamy (trace) u selhání |
| Odznak stavu | README | na první pohled, jestli testy procházejí |
| Nalezené chyby | issues v repozitáři | každá chyba zvlášť se štítky podle části 7 |
| Seznam chyb k opravě | soubor `docs/bugs.md` (odkaz v README) | otevřené chyby seřazené podle priority, závažnosti a náročnosti; slouží jako seznam úkolů k opravě |
| Přehled pokrytí | generuje se z kódu testů | které user stories a AK jsou pokryté testy |
| Vývoj rychlosti | výsledky měření uložené v repozitáři | trend rychlosti po dnech a týdnech |
| Bezpečnost a statistiky | soukromý repozitář | jen pro mě, viz část 2 |

Seznam chyb k opravě se nepíše ručně. Automatika ho vytváří z otevřených issues, takže je vždy aktuální a neliší se od nich: chyba se zapisuje jen jednou, do issue.

Rady ke zlepšení rychlosti nepíše automatika. Na požádání je z uložených výsledků česky sepíše Claude.

## 9. Role

| kdo | co dělá |
|---|---|
| Já (Tomáš) | vlastník webu: schvaluji user stories a očekávané výsledky, určuji prioritu chyb, zopakuji a schválím každý bug report, opravuji web, dělám ruční průzkumné testy, dávám souhlas ke commitu a ke všemu veřejnému |
| Claude | navrhuje user stories; po společném probrání oblasti (co v ní kontrolujeme a proč) napíše testy, které já schválím; rozebírá selhání, připravuje návrhy bug reportů a oprav, zakládá schválená issues, na požádání vyhodnocuje rychlost |
| Automatika (GitHub Actions) | spouští testy podle rozpisu v části 4, bez umělé inteligence; posílá e-mail při selhání a zveřejňuje report |

Claude nesmí bez mého souhlasu oslabit ani smazat žádnou kontrolu a nesmí měnit očekávaný výsledek testu.

## 10. Omezení a předpoklady

### Omezení

- **Chybí testovací kopie webu.** Testuje se jen ostrý web, proto testy nic neodesílají a nesmí web zahltit (část 5).
- **Napodobená zařízení nejsou skutečná.** Některé chyby se projeví jen na skutečném telefonu, proto se doplňují ručním průzkumem (část 4).
- **Časy automatických běhů nejsou přesné.** GitHub běhy spouští podle času UTC a může je zpozdit.
- **GitHub vypíná naplánované běhy po 60 dnech bez aktivity v repozitáři.** Ochrana proti tomu se řeší při nastavení automatického spouštění.
- **Měření rychlosti kolísá.** Proto se používá prostřední hodnota ze tří měření a denní měření selže jen při výrazném propadu (část 6).
- **Pravděpodobně chybí data o rychlosti od skutečných návštěvníků.** Google je sbírá jen u webů s dostatečnou návštěvností, k dispozici je tak hlavně laboratorní měření. Ověří se po prvním měření.
- **Obsah webu se mění.** Testy proto nespoléhají na texty článků a seznam stránek berou ze sitemapy.
- **Cizí weby mohou být dočasně nedostupné.** Externí odkazy se proto kontrolují mírněji (část 4).

### Předpoklady

- Sitemapa a seznam změněných článků (REST API) zůstanou veřejně dostupné.
- Před větší změnou webu (nová šablona, změna menu, nová hra) o ní vím a testy podle ní upravíme.
- Projekt dělám ve volném čase. Lhůty v části 7 jsou nastavené tak, abych je zvládl dodržet.
