🍽️ Sistema di Gestione Sagra - Architettura Database

## 📋 Panoramica Generale

Il sistema è progettato per gestire completamente una sagra paesana, dal momento dell'ordine alla cassa fino al servizio al tavolo. L'architettura supporta due modalità operative principali: **ordini tradizionali con pinzatura** e **ordini diretti al tavolo** per servizi rapidi come caffè e amari.

## 🏗️ Architettura del Sistema

### **🎪 Gestione Eventi e Menu**

**Eventi**
- Ogni sagra è un `event` con date specifiche e organizzazione di riferimento
- Supporta eventi multipli per la stessa organizzazione (es: Sagra di Primavera, Sagra di Settembre)

**Menu Flessibili**
- Menu principali per evento con possibilità di menu speciali tematici
- Categorizzazione piatti per facilitare navigazione e ordinamento

**Tavoli Configurabili**
- Disposizione sala personalizzabile per evento
- Gestione capacità, zone (interno/esterno) e accessibilità
- Supporto per rotazione tavoli con multiple comande

### **🍕 Sistema Avanzato di Pricing**

**Prezzo Base Protetto**
```
Prezzo Finale = max(basePrice, basePrice + Σ(variazioni))
```

**Logica Antideficit**
- Ogni piatto ha un prezzo base **non riducibile**
- Le variazioni possono essere positive (aggiunte) o negative (rimozioni)
- Impossibile andare sotto il prezzo base anche rimuovendo tutti gli ingredienti

**Esempio Pratico: Grigliata Mista**
- Prezzo base: 6.00€
- Variazioni: +Salsiccia (+1.20€), -Pollo (-1.50€)
- Ordine personalizzato: 6.00€ - 1.50€ + 1.20€ = 5.70€ → **bloccato a 6.00€**

### **🧾 Workflow Operativo Duale**

#### **📱 Modalità Tradizionale (Pinzatura)**

1. **Cassa Centrale**
   - Cliente ordina → genera `order` con ID univoco
   - Scontrino fiscale stampato con QR code contenente l'ID ordine
   - Cliente va al tavolo con scontrino

2. **Pinzatura Intelligente**
   - Staff di sala raccoglie scontrini al tavolo
   - Scansiona QR codes per identificare ordini
   - Crea `pinnedOrder` unificata assegnando tavolo
   - Ordini marcati come `isPinned = true`

3. **Servizio Unificato**
   - Cucina/bar ricevono comanda unica per tavolo
   - Tracking stato: pending → preparing → ready → completed
   - Gestione note specifiche per allergie/preferenze

#### **☕ Modalità Diretta (Cassa Mobile)**

1. **Ordine al Tavolo**
   - Staff con cassa mobile prende ordine direttamente
   - `order` creato con `isPinned = true` e `tableId` preimpostato
   - Nessun coperto aggiuntivo per ordini successivi

2. **Stampa Diretta**
   - Comanda inviata direttamente a cucina/bar
   - Scontrino fiscale = ricevuta per cliente
   - Ideale per caffè, amari, dolci post-pasto

### **🔧 Gestione Ingredienti e Allergeni**

**Doppio Livello Informativo**
- `menuItemIngredient`: Composizione base piatti (senza prezzi)
- `variation`: Modifiche possibili con pricing

**Tracciabilità Allergeni**
- Classificazione ingredienti (vegetariano, vegano, gluten-free)
- Lista allergeni strutturata per ogni ingrediente
- Informazioni nutrizionali complete

### **📊 Storicizzazione e Audit**

**Prezzi Congelati**
- `orderItemVariation.appliedPrice` salva il prezzo al momento dell'ordine
- Modifiche future ai listini non influenzano ordini passati
- Tracciabilità completa per analisi e contabilità

**Timeline Completa**
- Timestamps su tutte le operazioni critiche
- Tracking modifiche con `updatedAt` automatico
- Audit trail per gestione fiscale e operativa

## 🎯 Vantaggi Architetturali

### **💪 Flessibilità Operativa**
- **Scalabilità**: Da piccole sagre a eventi complessi
- **Adattabilità**: Menu diversi per serate speciali
- **Efficienza**: Due modalità operative per diversi scenari

### **🛡️ Robustezza Economica**
- **Antideficit**: Impossibile perdite su personalizzazioni
- **Pricing Dinamico**: Supporto per modifiche stagionali
- **Controllo Costi**: Tracciabilità completa margini

### **👥 Esperienza Utente**
- **Clienti**: Personalizzazione piatti mantenendo trasparenza prezzi
- **Staff Sala**: Workflow semplificato con QR codes
- **Cucina**: Comande unificate e chiare
- **Management**: Visibilità completa su operazioni e performance

### **📈 Insights e Analytics**
- **Piatti Popolari**: Tracking ordini per ottimizzazione menu
- **Variazioni Frequenti**: Identificazione preferenze clienti
- **Performance Tavoli**: Rotazione e utilizzo ottimale spazi
- **Marginalità**: Analisi profittabilità per item e variazioni

## 🚀 Innovazioni Tecniche

**QR Code Intelligente**: ID ordine = QR code (nessuna duplicazione dati)

**Pinzatura Flessibile**: Stesso tavolo può ospitare multiple comande nel tempo

**Pricing Protetto**: Matematicamente impossibile andare in perdita

**Dual Mode**: Sistema tradizionale + cassa mobile in un'unica architettura

---

*Questo sistema rappresenta una soluzione completa per la digitalizzazione delle sagre, mantenendo la semplicità operativa tipica di questi eventi ma aggiungendo potenza gestionale e controllo economico.
