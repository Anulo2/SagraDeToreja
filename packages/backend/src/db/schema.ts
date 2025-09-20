import { pgTable, serial, text, numeric, boolean, timestamp, integer } from "drizzle-orm/pg-core";
import { organization, user } from "./auth-schema";

// Evento della sagra (es: "Sagra di Settembre 2024")
// Rappresenta una specifica edizione della sagra con le sue date e organizzazione
export const event = pgTable("event", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  organizationId: text("organization_id").references(() => organization.id),
  authorId: text("author_id").references(() => user.id),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Menu della sagra con tutti i piatti disponibili
// Normalmente c'è un menu principale per evento, ma possono esserci menu speciali
// per serate a tema (es: "Serata Pesce", "Menu Degustazione")
export const menu = pgTable("menu", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  eventId: serial("event_id").references(() => event.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Piatti del menu con prezzo base fisso non riducibile
// Il prezzo finale sarà sempre: max(basePrice, basePrice + somma_variazioni)
// Questo garantisce che non si vada mai in perdita anche con molte rimozioni
export const menuItem = pgTable("menu_item", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  menuId: serial("menu_id").references(() => menu.id),
  image: text("image"), // use minio s3 storage to save images
  basePrice: numeric("base_price", { precision: 10, scale: 2 }).notNull(), // prezzo base fisso
  category: text("category"), // es: "primi", "secondi", "contorni", "dolci"
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Tavoli disponibili per un evento (configurazione della sala)
// Ogni evento può avere una disposizione diversa dei tavoli
// Più comande pinzate possono essere assegnate allo stesso tavolo in momenti diversi
export const table = pgTable("table", {
  id: serial("id").primaryKey(),
  tableNumber: text("table_number").notNull(), // numero/nome del tavolo (es: "1", "A3", "Terrazza-5")
  eventId: serial("event_id").references(() => event.id),
  capacity: serial("capacity").notNull(), // numero massimo di coperti per il tavolo
  location: text("location"), // zona del tavolo (es: "interno", "esterno")
  isActive: boolean("is_active").default(true).notNull(), // se il tavolo è utilizzabile
  notes: text("notes"), // note sul tavolo (es: "vicino cucina", "riservato gruppi", "accessibile disabili")
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Ingredienti base del sistema per composizione piatti e gestione allergeni
// Utilizzati sia per descrivere la composizione base dei piatti che per le variazioni
export const ingredient = pgTable("ingredient", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  allergens: text("allergens"), // lista di allergeni separati da virgola
  isVegetarian: boolean("is_vegetarian").default(false).notNull(),
  isVegan: boolean("is_vegan").default(false).notNull(),
  isGlutenFree: boolean("is_gluten_free").default(false).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Composizione standard di un piatto (es: "Grigliata Mista" = 1 pollo + 1 salsiccia + 2 costine + 2 polenta)
// Serve per mostrare ingredienti, allergeni e informazioni nutrizionali - NON ha prezzi
export const menuItemIngredient = pgTable("menu_item_ingredient", {
  id: serial("id").primaryKey(),
  menuItemId: serial("menu_item_id").references(() => menuItem.id),
  ingredientId: serial("ingredient_id").references(() => ingredient.id),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1").notNull(),
  unit: text("unit").default("pz").notNull(), // es: "pz", "gr", "ml"
});

// Variazioni disponibili per personalizzare i piatti con relativi prezzi
// AGGIUNTE: prezzo positivo (es: "+1 Salsiccia" = +1.20€)
// RIMOZIONI: prezzo negativo (es: "-Pollo" = -1.50€)
// Il prezzo finale non può mai scendere sotto il basePrice del piatto
export const variation = pgTable("variation", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(), // es: "+1 Salsiccia", "-Pollo", "+Fetta polenta"
  description: text("description"),
  menuItemId: serial("menu_item_id").references(() => menuItem.id),
  ingredientId: serial("ingredient_id").references(() => ingredient.id),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // può essere negativo per rimozioni
  quantity: numeric("quantity", { precision: 10, scale: 2 }).default("1").notNull(),
  unit: text("unit").default("pz").notNull(),
  variationType: text("variation_type").notNull(), // "add" o "remove"
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Comanda individuale del singolo cliente (quello che paga alla cassa)
// Ogni ordine ha un ID univoco che viene stampato come QR code sullo scontrino
// Può essere "pinzato" con altri ordini per creare una comanda unica per lo staff
export const order = pgTable("order", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(), // numero comanda leggibile (es: "001", "002",...,"060")
  menuId: serial("menu_id").references(() => menu.id),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  customerName: text("customer_name"), // nome del cliente (obbligatorio se userId è null)
  covers: serial("covers").default(1), // quante persone copre questo ordine, se è un ordine fatto successivamente non c'è bisogno di nuovo del coperto! Tipo il caffè o l'amaro
  isPinned: boolean("is_pinned").default(false).notNull(), // true quando è stato raggruppato in una pinnedOrder, può essere messo direttamebte a true quando è tipo per il caffè e non serve pinzare la comanda
  // in quanto ci sarà una persona in sala con una cassa "mobile" che raccoglierà ordini come caffè, amaro, dolce ecc e la comanda verrà stampata direttamente al bar, e quando verrà servita
  // verrà lasciato al cliente lo scontrino fiscale (che corrisponde anche alla comanda in questo caso)
  tableId: serial("table_id").references(() => table.id), // da usare solo in caso di cassa mobile per l'ordine al tavolo che non ha bisogno di essere pinzato
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Singoli piatti all'interno di una comanda individuale
// Ogni riga rappresenta "N quantità del piatto X con eventuali variazioni"
export const orderItem = pgTable("order_item", {
  id: serial("id").primaryKey(),
  orderId: serial("order_id").references(() => order.id),
  menuItemId: serial("menu_item_id").references(() => menuItem.id),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(), // prezzo calcolato per 1 unità = max(basePrice, basePrice + sum(variazioni))
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(), // prezzo totale = unitPrice * quantity
  notes: text("notes"), // note per la cucina su questo specifico piatto (es: "cottura al sangue")
});

// Variazioni specifiche applicate a un orderItem (es: "+1 Salsiccia", "-Pollo")
// Salva il prezzo applicato al momento dell'ordine per storicizzare i costi
export const orderItemVariation = pgTable("order_item_variation", {
  id: serial("id").primaryKey(),
  orderItemId: serial("order_item_id").references(() => orderItem.id),
  variationId: serial("variation_id").references(() => variation.id),
  quantity: numeric("quantity", { precision: 10, scale: 2 }).notNull(),
  appliedPrice: numeric("applied_price", { precision: 10, scale: 2 }).notNull(), // prezzo della variazione "congelato" al momento dell'ordine
});

// Comanda unificata per lo staff di cucina/sala (raggruppa 1 o più ordini individuali)
// Creata scannerizzando i QR code degli scontrini e assegnando un tavolo
// È quello che vedono cuochi e camerieri per preparare e servire
// Più comande pinzate possono essere sullo stesso tavolo (es: stesso tavolo, ordini in momenti diversi)
export const pinnedOrder = pgTable("pinned_order", {
  id: serial("id").primaryKey(),
  pinnedOrderNumber: text("pinned_order_number").notNull().unique(), // numero visibile allo staff (es: "T05-1", "T05-2" per multiple comande)
  tableId: serial("table_id").references(() => table.id), // riferimento al tavolo configurato
  customerName: text("customer_name").notNull(), // nome di riferimento (preso dal primo ordine della pinzatura)
  totalCovers: serial("total_covers").notNull(), // coperti totali = somma dei covers di tutti gli ordini pinzati
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(), // importo totale = somma di tutti gli ordini pinzati
  status: text("status").default("pending").notNull(), // stato cucina: "pending"→"preparing"→"ready"→"completed" (o "cancelled")
  notes: text("notes"), // note aggiuntive dello staff (es: "cliente allergico", "tavolo esterno")
  staffUserId: text("staff_user_id").references(() => user.id), // cameriere/responsabile che ha fatto la pinzatura
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date())
    .notNull(),
});

// Collegamento N:1 tra ordini individuali e comanda pinzata
// Permette di sapere quali ordini fanno parte di quale tavolo
export const pinnedOrderItem = pgTable("pinned_order_item", {
  id: serial("id").primaryKey(),
  pinnedOrderId: serial("pinned_order_id").references(() => pinnedOrder.id),
  orderId: serial("order_id").references(() => order.id),

  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});
