# Immigratiepunt

Immigratiepunt is een Nederlandstalige website voor internationale nieuwkomers die
ondersteuning zoeken bij het opbouwen van hun leven in Nederland. De applicatie
combineert praktische informatie met een registratieformulier voor persoonlijke
begeleiding.

## Functionaliteiten

- Hero-sectie met duidelijke introductie en call-to-actions.
- Overzicht van ondersteuning bij bankzaken, huisvesting, werk en administratie.
- Uitleg van het drie-stappenproces: registreren, matchen en begeleiding ontvangen.
- Veelgestelde vragen over vestiging, taal, huisvesting en bankzaken.
- Getuigenissen van internationale nieuwkomers.
- Registratieformulier met validatie en feedback bij succes of fouten.
- Nederlandstalige en Engelstalige interface met een taalschakelaar.
- Responsive navigatie, footer en herbruikbare UI-componenten.
- API-endpoint voor beschikbare diensten en het verwerken van registraties.

## Tech stack

- React 18 en TypeScript
- Vite
- Express
- Wouter
- TanStack React Query
- React Hook Form en Zod
- Tailwind CSS
- Radix UI
- Drizzle ORM-configuratie

## Lokaal starten

### Vereisten

- Node.js 20 of nieuwer
- npm

### Installatie

```sh
npm install
```

### Ontwikkelserver

```sh
npm run dev
```

De ontwikkelserver is standaard bereikbaar op `http://localhost:5000`.

### Productiebuild

```sh
npm run build
npm start
```

## Scripts

| Commando | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Express- en Vite-ontwikkelserver. |
| `npm run build` | Bouwt de frontend en bundelt de server voor productie. |
| `npm start` | Start de productiebuild. |
| `npm run check` | Voert de TypeScript-controle uit. |
| `npm run db:push` | Synchroniseert het Drizzle-databaseschema. |

## Projectstructuur

```text
client/
  src/
    components/
      layout/       Header en footer
      sections/     Hero, diensten, FAQ, registratie en testimonials
      ui/           Herbruikbare interfacecomponenten
    hooks/          React hooks voor taal en UI-state
    lib/            Queryconfiguratie, vertalingen en hulpfuncties
    pages/          Pagina's van de applicatie
server/
  routes.ts         API-routes voor diensten en registraties
  storage.ts        Opslaglaag voor registratiegegevens
  index.ts          Server-entrypoint
shared/
  schema.ts         Gedeelde validatieschema's en types
```

Registratiegegevens worden in de huidige demo-opslaglaag tijdelijk in het geheugen
bewaard en gaan verloren wanneer de server opnieuw start.
