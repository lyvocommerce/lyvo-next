/** LyvoShop Architecture doc — Suomi. Lisää window.ARCH_I18N index.html:ään uusia kieliä lisättäessä. */
window.ARCH_I18N_FI = {
  meta: {
    title: "Järjestelmäarkkitehtuuri ja sovelluksen käynti",
    subtitle: "Korkean tason visuaalinen kuvaus LyvoShop Telegram Mini App -toiminnasta: kerrokset, datavirta, sivut ja vastuualueet.",
    badge: "LyvoShop — Arkkitehtuurikarta",
    langLabel: "Kieli",
    tocTitle: "Sisällysluettelo"
  },
  nav: {
    purpose: "Tarkoitus",
    layers: "Kerrokset",
    routes: "Sivut",
    catalogFlow: "Katalogi",
    telegramFlow: "Telegram-polku",
    merchantFlow: "Kauppiaat",
    glossary: "Sanasto",
    agents: "Agentit",
    databaseStores: "Tietokanta ja kaupat"
  },
  toc: {
    purpose: "Järjestelmän tarkoitus",
    layers: "Kerrostettu arkkitehtuuri",
    routes: "Sivut ja virrat",
    catalogFlow: "Katalogi ja datavirta",
    telegramFlow: "Telegram Mini App -polku",
    merchantFlow: "Kauppiaiden vastuut",
    glossary: "Sanasto",
    agents: "Agentit",
    databaseStores: "Tietokanta ja uusien kauppojen yhdistäminen"
  },
  sections: {
    purpose: {
      id: "purpose",
      title: "1. Järjestelmän tarkoitus",
      tagline: "LyvoShop on Telegram Mini App -myymälä, jota tukee monikauppiaan tuotekatalogi Postgresissa (Neon) tiukalla kerrosrakenteella.",
      paragraphs: [
        "Alusta kerää tuotteita useilta kauppiailta, tallentaa ne normalisoituun sisäiseen katalogiin ja tarjoaa ne Telegram Web App -käyttöliittymän ja sisäisten APIen kautta; avustaja toimii vain katalogidatalla."
      ],
      pills: ["Next.js 16 (App Router)", "Telegram Web App", "TypeScript", "Prisma + Neon Postgres", "Kerrostettu arkkitehtuuri"]
    },
    layers: {
      id: "layers",
      title: "2. Kerrostettu arkkitehtuuri (visuaalinen)",
      paragraphs: ["Järjestelmä noudattaa tiukkaa vastuunjakoa. Jokainen pyyntö kulkee neljän kerroksen läpi; kerrosten ohitus on kielletty."],
      diagramTitle: "Looginen pino",
      diagram: "UI (Next.js-sivut ja -komponentit)\n        │\n        ▼\nAPI-kerros (sisäiset reitit)\n        │\n        ▼\nDomain-logiikka (katalogi, haku, ingestion, avustaja)\n        │\n        ▼\nData-kerros (Neon Postgres Prisman kautta)",
      cards: [
        {
          title: "UI-kerros (Next.js / Telegram Web App)",
          description: "Renderöi sivut ja komponentit (app/page.tsx, app/category/[slug]/page.tsx, app/product/[id]/page.tsx, app/user/page.tsx, app/admin/page.tsx ja components/pages/*).",
          listItems: ["Näyttää katalogilistaukset ja tuotekortit.", "Tarjoaa Telegram Web App -kokemuksen.", "Kutsuu vain sisäisiä APIja."],
          warning: "UI:ssa ei saa olla liiketoimintalogiikkaa, ulkoisia kauppiaiden API-kutsuja eikä suoraa tietokantayhteyttä."
        },
        {
          title: "API-kerros",
          description: "Ohut rajapinta UI:n ja ydinpalveluiden välillä. Validoi syötteen, valvoo sopimuksia ja kutsuu domain-palveluja.",
          listItems: ["Esim. Telegram-auth-reitti: app/api/auth/telegram/route.ts.", "Kaikki UI:n datahaut käyvät sisäisten APIen kautta.", "Ei UI-renderöintiä eikä esityslogiikkaa."]
        },
        {
          title: "Domain-logiikkakerros",
          description: "Katalogitoiminnot, haku ja suodatus, ranking, ingestion ja normalisointi sekä avustajan päättely.",
          listItems: ["Muuntaa kauppiaiden raakadatan normalisoiduiksi entiteeteiksi.", "Toteuttaa haun ja ranking-säännöt.", "Avustaja käyttää vain tallennettua katalogidataa."]
        },
        {
          title: "Data-kerros (Neon Postgres)",
          description: "Tallentaa normalisoidut entiteetit ja tarjoaa ne Prisman kautta. Sisäinen katalogitietokanta on ainoa totuuden lähde.",
          listItems: ["Ydinentiteetit: Merchant, Product, Offer, Category, Attribute.", "Ei liiketoimintalogiikkaa eikä UI-riippuvuuksia.", "Tukee rakennettua ja semanttista hakua."]
        }
      ]
    },
    routes: {
      id: "routes",
      title: "3. Sovelluksen sivut ja virrat",
      paragraphs: ["Next.js App Router -rakenne määrittää pääkäyttäjäpolut Telegram Mini Appissa ja siihen liittyvät näkymät."],
      diagramTitle: "Reittikarta (korkea taso)",
      diagram: "Telegram Mini App (webview)\n└── \"/\"                → Etusivu / Landing (app/page.tsx → LandingPage)\n    ├── \"/category/[slug]\"  → Kategoriapuu\n    ├── \"/product/[id]\"     → Tuotekortti\n    ├── \"/user\"             → Käyttäjäprofiili\n    └── \"/admin\"            → Hallinta",
      cards: [
        {
          title: "Etusivu (\"/\")",
          description: "Telegram Web Appin sisäänkäynti. Koostuu app/page.tsx:stä ja LandingPage-komponentista (components/pages).",
          listItems: ["Ensimmäinen näkymä, kun Telegram avaa sovelluksen.", "Näyttää kategorioita ja/tai tuotteita.", "Navigointi katalogiin."]
        },
        {
          title: "Kategoriasivut (\"/category/[slug]\")",
          description: "Palvelinkomponentti app/category/[slug]/page.tsx käyttää lib/categories.ts kategorian ja alikategorioiden hakuun.",
          listItems: ["Kategorian nimi ja kuvaus.", "Alikategoriat Telegram-tyylisissä korteissa.", "Sisäisen taksonomian selaus."]
        },
        {
          title: "Tuotesivut (\"/product/[id]\")",
          description: "Reitti app/product/[id]/page.tsx renderöi ProductDetailPage -komponentin.",
          listItems: ["Tuotteen nimi, kuvaus, kuvat, hinta.", "Kauppiaan ja tarjouksen tiedot tarvittaessa.", "Siirtymä kauppiaan ulkoiselle sivustolle."]
        },
        {
          title: "Käyttäjä- ja hallintanäkymät (\"/user\", \"/admin\")",
          description: "Lisäsivut (UserPage ja AdminPage) käyttäjätiedolle ja sisäiselle hallinalle.",
          listItems: ["Käyttäjän sivu: tiedot, asetukset, historia.", "Hallinta: toiminnot, seuranta, työkalut."]
        }
      ]
    },
    catalogFlow: {
      id: "catalog-flow",
      title: "4. Katalogi ja datavirta",
      paragraphs: ["Kauppiaat omistavat ja hallitsevat tuotetietoja omissa järjestelmissään. LyvoShop imuroi, normalisoi ja tallentaa ne Neonin sisäiseen katalogiin ennen kuin mitään näytetään Mini Appissa."],
      diagramTitle: "Katalogiputki (päätepisteestä toiseen)",
      diagram: "Kauppiaiden järjestelmät\n    (Shopify, CMS, syötteet, tiedostot)\n        │  kauppiaan hallitsemat hinnat, nimet, kuvaukset\n        ▼\nIngestion\n    • Syötteiden haku tai vastaanotto\n    • Tiedostojen / APIen / webhookien jäsennys\n        ▼\nNormalisointi\n    • Kenttäkuvaus → Product / Offer / Category / Attribute\n    • Tekstin, valuutan ja attribuuttien siivous\n        ▼\nSisäinen katalogitietokanta (Neon Postgres)\n    • Ainoa totuuden lähde katalogille\n        ▼\nCatalog API ja haku / ranking\n    • Rakennetut kyselyt ja semanttinen haku\n        ▼\nAvustaja ja Telegram Mini App -UI\n    • Vain luku normalisoidusta katalogidatasta",
      muted: "Kauppiaiden raakadataa ei paljasteta suoraan UI:lle. Jokainen Mini Appissa näytettävä tuote on olemassa sisäisessä katalogissa vakaalla sisäisellä ID:llä."
    },
    telegramFlow: {
      id: "telegram-flow",
      title: "5. Telegram Mini App -polku",
      paragraphs: ["Käyttäjän näkökulmasta Mini App on ohjattu myymälä katalogin päällä Telegram-autentikoinnilla ja teemalla."],
      diagramTitle: "Käyttäjäpolku (yksinkertaistettu)",
      diagram: "Käyttäjä avaa botin Telegramissa\n        │\n        ▼\nBotti lähettää Web App -painikkeen\n        │\n        ▼\nTelegram avaa LyvoShop Mini Appin (webview)\n        │\n        ▼\nUI käynnistyy\n    • Lukee Telegram initData Web App SDK:lla\n    • Asettaa Telegram-teeman (värit, tumma/vaalea)\n    • Validoi initData sisäisen auth-APIreitin kautta\n        │\n        ▼\nEtusivu\n    • Sisäänkäynnit katalogiin\n        │\n        ▼\nSelaa kategorioita → tuotteet → tuotekortti\n        │\n        ▼\nKäyttäjä painaa \"Siirry kauppaan\" (ulos redirect)\n    • Redirect logataan\n    • Käyttäjä siirtyy kauppiaan sivustolle ostoksen viimeistelyyn",
      paragraphsAfter: ["Koko polun ajan asiakas ei keskustele suoraan kauppiaiden järjestelmien kanssa. Kaikki katalogikontaktit tulevat Neonin sisäisestä tietokannasta sisäisten APIen ja domain-logiikan kautta."]
    },
    merchantFlow: {
      id: "merchant-flow",
      title: "6. Kauppiaiden vastuut ja hallinta",
      paragraphs: ["Kauppiaat hallitsevat täysin tuotteidensa sisällön ja hinnat omissa järjestelmissään. LyvoShop hallitsee, miten data imuroidaan, normalisoidaan, haetaan ja esitetään Mini Appissa."],
      cards: [
        {
          title: "Mitä kauppiaalla on",
          listItems: ["Tuotteen nimet, kuvaukset, kuvat.", "Hinnat, valuutat, saatavuus.", "Kauppiaan kategoriat ja tagit.", "Päivitykset ja oikaisut katalogiin."],
          muted: "Kauppiaat tekevät muutokset omissa alustoissaan. LyvoShop hakee muutokset syötteiden tai integraatioiden kautta."
        },
        {
          title: "Mitä LyvoShopilla on",
          listItems: ["Sisäinen taksonomia ja attribuuttimalli.", "Normalisointi ja kuvaus kauppiaiden datasta.", "Haku, ranking ja avustajan käyttäytyminen.", "Telegram Mini App -UI ja käyttäjäpolut."]
        },
        {
          title: "Miten data liikkuu",
          listItems: ["Kauppiaat vievät tai tarjoavat kataloginsa (tiedostot, syötteet, API).", "LyvoShopin ingestion-tehtävät hakevat ja normalisoivat.", "Normalisoidut tuotteet ja tarjoukset tallennetaan Neoniin ja käytetään kaikissa käyttöliittymissä."]
        }
      ]
    },
    databaseStores: {
      id: "database-stores",
      title: "7. Tietokanta ja uusien kauppojen yhdistäminen",
      tagline: "Miten sisäinen katalogitietokanta (Neon Postgres) on rakennettu ja miten sitä käytetään uusien kauppiaiden yhdistämiseen ja heidän tuotteidensa näyttämiseen Mini Appissa.",
      paragraphs: [
        "Sisäinen katalogi on ainoa totuuden lähde. Kaikki Mini Appissa näytettävät tuotedatan tulee tästä tietokannasta ingestion- ja normalisointivaiheen jälkeen. Kauppiaat määritetään yhteystyyppinä ja tyyppikohtaisina parametreina (ei yksi URL-kenttä): dashboard tukee mitä tahansa yhteystyyppiä asetusten kautta; uuden tyypin lisääminen on yksi uusi vaihtoehto listassa ja yksi haara ingestionissa."
      ],
      diagramTitle: "Uuden kaupan yhdistäminen (tavoitevirta)",
      diagram: "Dashboard / Admin\n    • Luo tai muokkaa kauppiasta (id, name, logo_url, country, home_url, connection_type, connection_params)\n        │\n        ▼\nKauppiaan tietue tietokannassa (merchants)\n        │\n        ▼\nIngestion (domain)\n    • Lataa katalogi kauppiaalle → haaroittuu connection_typen mukaan\n    • url: fetch(connection_params.feedUrl) → jäsennä → normalisoi\n    • file / shopify: (tulossa) sama vaihe, eri haara\n        │\n        ▼\nKirjoita tietokantaan (products, categories)\n    • products.merchant_id → merchants.id\n        │\n        ▼\nCatalog API lukee tietokannasta → UI näyttää vain sisäisen katalogin datan",
      cards: [
        {
          title: "Taulut kauppoja ja katalogia varten",
          description: "Prisma-schema (prisma/schema.prisma) määrittelee datakerroksen.",
          listItems: [
            "merchants — yksi rivi per kauppa: id, name, logo_url, country, home_url, connection_type, connection_params (JSON). connection_type esim. \"url\", \"file\", \"shopify\"; params esim. { \"feedUrl\": \"...\" } url-tyypille.",
            "products — normalisoidut tuotteet: id, title, description, url, image_url, price_min, price_max, currency, merchant_id (FK → merchants), category, lang. Jokaisella tuotteella merchant_id.",
            "categories — sisäinen taksonomia (puu). Jaettuja; tuotteet voivat viitata kategoriaan. Täytetään seedillä tai ingestionilla."
          ],
          muted: "Tietokannan URL on DATABASE_URL (Neon). Schema: npx prisma db push tai migraatiot."
        },
        {
          title: "Yhteystyypit (dashboard ja ingestion)",
          description: "Yksi yhteinen vaihe: lataa katalogi kauppiaalle. Domain haaroittuu connection_typen mukaan.",
          listItems: [
            "url (linkillä) — toteutettu: hae syöte URL:sta, jäsennä (esim. FakeStore, DummyJSON), normalisoi, kirjoita tietokantaan.",
            "file — tulossa: lue tiedosto, jäsennä, normalisoi.",
            "shopify — pyynnöstä: kutsu Shopify API, map sisäiseen malliin."
          ],
          muted: "Uusi tyyppi = lisää vaihtoehto dashboard-tyyppilistalle + ingestion-haara + asetuslomake. Ei kauppakohtaista koodia."
        },
        {
          title: "Miten uusi kauppa yhdistetään",
          description: "Operatiivinen virta, jotta tietokanta voi palvella uuden kaupan tuotteita.",
          listItems: [
            "1. Rekisteröi kauppias dashboardissa: id, name, home_url, connection_type (esim. url), connection_params (esim. feedUrl).",
            "2. Aja ingestion: \"Lataa katalogi\" kyseiselle kauppiaalle; domain hakee/jäsentää tyypin mukaan ja kirjoittaa products-tauluun merchant_id:llä.",
            "3. Catalog API: sisäinen API lukee products- ja merchants-taulusta (sivutus/suodattimet). UI kutsuu vain tätä APIa; ei suoraa tietokantaa tai ulkoisia API-kutsuja asiakkaalta."
          ],
          warning: "UI ei saa koskaan kutsua ulkoisia kauppiaiden APIja tai tietokantaa suoraan. Kaikki kaupan data tulee sisäisen Catalog API:n kautta tästä tietokannasta."
        }
      ]
    },
    agents: {
      id: "agents",
      title: "9. AI-agentit tässä repositoriossa",
      tagline: "Miten Cursor- ja muut AI-agentit on konfiguroitu toimimaan LyvoShopissa ja mitä dokumentteja niiden on noudatettava.",
      paragraphs: [
        "Jokaisen tässä repositoriossa toimivan AI-agentin (esim. Cursor Composer/Agent) on noudatettava tiukkaa käynnistys- ja suoritusprotokollaa. Agentit saavat projektikontekstin juuren AGENTS.md:stä ja käyttäytymissäännöt /docs-dokumenteista. Rakenteellinen eheys ja vaatimustenmukaisuus ovat tärkeämpiä kuin nopeus tai ominaisuuden toimitus."
      ],
      cards: [
        {
          title: "Miten agentit toimivat",
          description: "Ennen analyysiä, koodia tai arkkitehtuurimuutosta agentin on suoritettava käynnistysprotokolla.",
          listItems: [
            "Pakollinen ennalta lukeminen: lue ARCHITECTURE.md, ARCHITECTURE_ENFORCEMENT.md, DATA_MODEL_RULES.md, CODING_RULES.md, TESTING_STRATEGY.md, DEFINITION_OF_DONE.md ja AGENTS.md kokonaisuudessaan.",
            "Kontekstin validointi: tunnista muutoksen kerros (UI / API / Domain / Data / Assistant), vahvista ettei kerros- tai datamallirikkomuksia ole ja vahvista testivaatimusten ymmärtäminen.",
            "Suunnitelma: tee minimaalinen toteutussuunnitelma, arvioi laajuus (pieni / keski / suuri) ja vahvista muutoksen minimaalisuus ja vaatimustenmukaisuus ennen toteutuksen aloittamista.",
            "Ennen valmista: lue DEFINITION_OF_DONE.md uudelleen ja tarkista arkkitehtuurin, testien ja sääntöjen noudattaminen."
          ],
          muted: "Jos jokin vaadituista dokumenteista puuttuu, agentin on pysähdyttävä ja raportoitava. Epävarmuuden sattuessa agentin on pysähdyttävä ja pyydettävä selvitystä."
        },
        {
          title: "Mitä agentit noudattavat",
          description: "Dokumentit, jotka määrittelevät agentin käyttäytymisen ja projektikontekstin. Nämä ohittavat ristiriitaiset ohjeet.",
          listItems: [
            "Juuren AGENTS.md — Cursor Cloud -ohjeet: tekninen pino, sovelluksen käynnistys (pnpm dev), tietokanta, skriptit, tunnetut ongelmat (esim. ESLint) ja tuotedatan lähde (FakeStore API).",
            "docs/AGENT_STARTUP_RULE.md — pakollinen käynnistysmenettely ja suoritusjärjestys; määrittelee kielletyt toiminnat (esim. laajat uudelleenkirjoitukset tai uudet riippuvuudet ilman hyväksyntää).",
            "docs/AGENTS.md — roolijako (Architect, Builder, Reviewer) ja sääntö, ettei koodia saa kirjoittaa ennen asiaan liittyvien /docs-dokumenttien lukemista, ARCHITECTURE.md:n mukaisuuden vahvistamista ja minimaalisen suunnitelman tekemistä.",
            "ARCHITECTURE.md, ARCHITECTURE_ENFORCEMENT.md, DATA_MODEL_RULES.md, CODING_RULES.md, TESTING_STRATEGY.md, DEFINITION_OF_DONE.md — kerrosrajat, datamalli, koodaus- ja testisäännöt sekä valmiusmääritelmä."
          ],
          warning: "Suoritusjärjestys: AGENT_STARTUP_RULE.md → ARCHITECTURE_ENFORCEMENT.md → DATA_MODEL_RULES.md → CODING_RULES.md → TESTING_STRATEGY.md → ARCHITECTURE.md. Oikeellisuus voittaa nopeuden."
        }
      ]
    },
    glossary: {
      id: "glossary",
      title: "8. Sanasto (keskeiset käsitteet)",
      tagline: "Yhteinen sanasto alustan ja arkkitehtuurin kuvaukseen.",
      items: [
        { term: "Merchant (kauppias)", definition: "ulkoinen kauppa tai brändi, joka omistaa tuotteet ja hinnat. Kauppias on oman katalogidatansa totuuden lähde." },
        { term: "Product (tuote)", definition: "kohteen vakaa identiteetti (esim. \"Sneaker Model X\"). Tuote-identiteetti ei muutu, kun tarjoukset tai hinnat muuttuvat." },
        { term: "Offer (tarjous)", definition: "dynaamiset tiedot: hinta, valuutta, saatavuus, toimitustiedot. Samalle tuotteelle voi olla useita tarjouksia." },
        { term: "Category (kategoria)", definition: "osa sisäisestä taksonomiasta, joka järjestää tuotteet selailua ja löytämistä varten Mini Appissa." },
        { term: "Attribute (attribuutti, fasetti)", definition: "normalisoidut, haettavat tai suodatettavat tuoteominaisuudet (koko, väri, materiaali jne.)." },
        { term: "Assistant (avustaja)", definition: "AI-avustaja katalogin käytössä. Toimii vain tallennetulla katalogidatalla ja viittaa todellisiin sisäisiin tuote-ID:eihin." },
        { term: "Neon Postgres", definition: "hallittu Postgres-instanssi, jossa sisäinen katalogi ja liittyvät entiteetit Prisman kautta." },
        { term: "Telegram Mini App", definition: "webview-käyttöliittymä, joka avataan Telegram-botista, toteutettu Next.jsillä ja Telegram Web App SDK:lla." }
      ]
    }
  }
};
