# Frontend Progress Log – SagraTorreglia

## Stato attuale (23 settembre 2025)

- Bootstrap applicativo completato con TanStack Router, layout condiviso e integrazione Better Auth UI per login/registrazione/account/organizzazioni.
- Header aggiornato con pulsante utente e selettore di parrocchia (organization switcher) in linea con i componenti Better Auth UI.
- Routing dinamico configurato per tutte le view di autenticazione, account e organizzazione, con normalizzazione automatica delle URL.

## Requisiti di interfaccia (derivati da "Enrico.md" e "README.md")

### 1. Amministrazione eventi e listini

- Creazione e gestione evento (più eventi contemporanei, anche prenotazioni future).
- Menu per evento con struttura gerarchica: sezioni (primi, secondi, panini, bevande, dolci, ecc.).
- Schede piatto comprendono: ingredienti collegati a magazzino/quantità, flag allergeni, tipologia, vegetariano, prezzo base, disponibilità e stock residuo.
- Gestione variazioni globali con costo/influenza prezzo (±) e possibilità di abilitarle per singolo piatto.
- Gestione alternative obbligatorie/facoltative (es. scelta seconda portata o formaggio) con eventuale sovrapprezzo.
- Supporto mezze porzioni/bis per primi e gestione quantità multiple dello stesso ingrediente.

### 2. Flusso cassa (postazione cassiere)

- Selezione evento attivo per cui emettere comanda (anche per serate future).
- Distinzione immediata tra asporto e servizio al tavolo con raccolta nominativo, numero coperti, eventuale tavolo.
- Inserimento rapido piatti via shortcut tastiera e mouse (incremento/decremento), ricerca intelligente e gestione variazioni/alternative.
- Gestione ordine di servizio (turni: bevande, primi, secondi, dolci) con possibilità di override manuale.
- Riepilogo laterale sempre visibile con conto, quantità per tipologia e segnalazioni (discrepanza coperti/portate).
- Scelta metodo di pagamento (contanti, POS, conto terzi/comune) e possibilità di escludere o rimandare scontrino fiscale.
- Ristampa comanda, annullamento o modifica di comande esistenti, ricerca ordini con filtri.
- Associazione comande multiple per tavolo (“pinzatura”): scannerizzare più QR e generare stampa unificata per servizio.

### 3. Gestione comande sul campo

- Generazione comanda con numero progressivo e copia cliente (QR o codice a barre) da conservare.
- Flusso per assegnare numero tavolo: talloncino, associazione tramite operatore sala o da dispositivo mobile.
- Tracciamento stato comanda: aperta, turni in preparazione, serviti, chiusa. Possibilità di aggiungere ordini successivi sullo stesso tavolo.
- Supporto per grandi tavolate con gestione turni in sequenza e sospensione selettiva di piatti.

### 4. Dashboard operative

- **Sala:** lista comande pinzate con stato, numero coperti, filtri (aperte/chiuse), tempo trascorso, statistiche su servizio.
- **Bar:** stampa immediata bevande al momento della pinzatura (dedicata a operatori bar), evidenziazione ordini completati.
- **Cucina:** monitor con dettaglio piatti/ingredienti richiesti, possibilità di segnalare disponibilità ingredienti e priorità; gestione workflow impiattamento.
- **Cassa vagante:** interfaccia snella per ordini rapidi (dolci/caffè/patatine/amari) senza scontrino, pagamento mobile.

### 5. Chiusura e riconciliazione casse

- Apertura/chiusura cassa con conteggio tagli (es. 10×50€, 20×20€, ...).
- Report totali per cassa, metodo di pagamento, giorno ed evento.
- Profilo cassiere con anagrafica base; log operazioni per audit.

### 6. Infrastruttura e hardware (per coordinamento UI)

- Integrazione con terminali fiscali via API, tre unità dedicate.
- Utilizzo di access point dedicati e rete isolata in location evento.
- Impiego stampanti termiche per comande e scontrini.
- Compatibilità con PC esistenti (applicativo web), valutazione nuova periferica mouse se necessario.

## Prossimi passi frontend

1. **Design system operativo**: definire palette, componenti UI riutilizzabili (griglie menu, card ingredienti, tab stato comande, modali variazioni).
2. **Prototipo flusso cassa**:
   - Wireframe/lo-fi screens per inserimento ordine, riepilogo/turni, pagamento, gestione pinzature.
   - Componente di ricerca/shortcut e modale variazioni.
3. **Backoffice eventi & menu**:
   - Layout CRUD evento/menù con gestione gerarchica sezioni/piatti/ingredienti.
   - Tabelle interattive per variazioni globali e allergeni.
4. **Dashboard operative**:
   - Mock sala/bar/cucina/cassa vagante con mappe stato comande e azioni principali.
   - Definizione segnali tempo reale (badge, countdown, indicatori disponibilità ingredienti).
5. **Esperienza mobile/terminali**:
   - Identificare viste essenziali per dispositivi sala/bar (workflow scanning QR, conferma servizio, aggiornamento disponibilità ingredienti).
6. **Ricerca e gestione ordini storici**:
   - Schema interfaccia filtro/ricerca, timeline comande, funzionalità ristampa.

## Note & questioni aperte

- Confermare flussi hardware (scanner QR, stampanti dedicate) per disegnare componenti di stampa e scanning coerenti.
- Decidere livello di dettaglio necessario per gestione ingredienti (dedicato a magazzino o a sola disponibilità piatto).
- Stabilire priorità tra moduli (probabile focus iniziale su cassa + sala) per sprint di sviluppo.
- Coordinare con team backend per API menù, gestione inventario, comande e reportistica prima di implementare chiamate reali.
