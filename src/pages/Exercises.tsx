import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Star,
  Lightbulb,
  Eye,
  EyeOff,
  Code2,
  BarChart3,
  Trophy,
  Target,
  ArrowRight,
  Sparkles,
  Database,
  Zap,
  Shield,
  Settings,
  Layers,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Category = 'DAX' | 'Data Modeling' | 'Power Query / M' | 'Fabric' | 'Performance' | 'Administration'
type Difficulty = 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert'

interface RelatedLink {
  label: string
  to: string
}

interface Exercise {
  id: number
  title: string
  category: Category
  difficulty: Difficulty
  points: number
  shortDescription: string
  problemStatement: string
  hints: string[]
  solution: string
  explanation: string
  relatedLinks: RelatedLink[]
}

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const categoryConfig: Record<Category, { color: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  DAX: { color: '#f2c811', bg: 'rgba(242, 200, 17, 0.15)', icon: Code2 },
  'Data Modeling': { color: '#0078d4', bg: 'rgba(0, 120, 212, 0.15)', icon: Database },
  'Power Query / M': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', icon: Layers },
  Fabric: { color: '#0078d4', bg: 'rgba(0, 120, 212, 0.15)', icon: Sparkles },
  Performance: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: Zap },
  Administration: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', icon: Shield },
}

const difficultyConfig: Record<Difficulty, { color: string; bg: string }> = {
  'Débutant': { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  'Intermédiaire': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  'Avancé': { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
  'Expert': { color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)' },
}

const difficultyStars: Record<Difficulty, number> = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 4,
  'Expert': 5,
}

const ALL_CATEGORIES: Category[] = ['DAX', 'Data Modeling', 'Power Query / M', 'Fabric', 'Performance', 'Administration']
const ALL_DIFFICULTIES: Difficulty[] = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert']

/* ------------------------------------------------------------------ */
/*  Exercise Data                                                      */
/* ------------------------------------------------------------------ */

const exercises: Exercise[] = [
  {
    id: 1,
    title: 'Calcul de ventes YTD',
    category: 'DAX',
    difficulty: 'Débutant',
    points: 1,
    shortDescription: 'Créez une mesure qui calcule le total des ventes depuis le début de l\'année.',
    problemStatement: `Vous disposez d'un modèle avec une table Sales contenant une colonne Amount et une table Date avec une colonne Date.

Créez une mesure DAX qui calcule le total cumulé des ventes depuis le début de l'année en cours (Year-To-Date).`,
    hints: [
      'Pensez aux fonctions de Time Intelligence de DAX.',
      'TOTALYTD est une fonction qui simplifie ce calcul.',
    ],
    solution: `Sales YTD = TOTALYTD(SUM(Sales[Amount]), 'Date'[Date])`,
    explanation: `TOTALYTD est une fonction de raccourci qui encapsule votre expression dans un filtre DATESYTD. Elle calcule automatiquement le cumul depuis le 1er janvier de l'année courante jusqu'à la dernière date dans le contexte de filtre.

Équivalent long :
CALCULATE(SUM(Sales[Amount]), DATESYTD('Date'[Date]))`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 2,
    title: 'Variation vs année précédente',
    category: 'DAX',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Calculez le % de variation des ventes par rapport à l\'année précédente.',
    problemStatement: `Vous avez une mesure [Total Sales] existante et une table Date standard.

Créez une mesure DAX qui calcule le pourcentage de variation des ventes par rapport à la même période de l'année précédente. La mesure doit retourner BLANK() si les ventes de l'année précédente sont nulles.`,
    hints: [
      'SAMEPERIODLASTYEAR permet de décaler le contexte d\'un an.',
      'Utilisez DIVIDE pour gérer la division par zéro proprement.',
      'Stockez les résultats intermédiaires dans des variables (VAR/RETURN).',
    ],
    solution: `Sales YoY % =
VAR CurrentSales = [Total Sales]
VAR PreviousYearSales =
    CALCULATE(
        [Total Sales],
        SAMEPERIODLASTYEAR('Date'[Date])
    )
RETURN
IF(
    PreviousYearSales <> 0,
    DIVIDE(
        CurrentSales - PreviousYearSales,
        PreviousYearSales
    ),
    BLANK()
)`,
    explanation: `Cette mesure utilise le pattern VAR/RETURN pour la lisibilité. SAMEPERIODLASTYEAR décale toutes les dates du contexte actuel d'exactement un an en arrière. DIVIDE gère nativement la division par zéro (retourne BLANK() ou une valeur alternative).`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 3,
    title: 'Top 5 produits par catégorie',
    category: 'DAX',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Affichez les 5 meilleurs produits par montant de ventes dans chaque catégorie.',
    problemStatement: `Vous avez les tables suivantes :
- Products[ProductName], Products[Category]
- Sales[Amount], Sales[ProductKey]

Créez une mesure qui, dans un visuel matriciel, ne montre que les 5 produits avec le plus de ventes pour chaque catégorie.

Indice : vous devrez probablement créer un calcul de rang ou utiliser TOPN.`,
    hints: [
      'TOPN retourne une table des N lignes avec la valeur la plus élevée.',
      'Combinez CALCULATE avec KEEPFILTERS pour garder le contexte.',
      'RANKX peut aussi être utilisé pour attribuer un rang à chaque produit.',
    ],
    solution: `IsTop5 =
VAR CurrentProduct = SELECTEDVALUE(Products[ProductName])
VAR CurrentCategory = SELECTEDVALUE(Products[Category])
VAR Top5Products =
    TOPN(
        5,
        CALCULATETABLE(
            VALUES(Products[ProductName]),
            ALLEXCEPT(Products, Products[Category])
        ),
        CALCULATE([Total Sales]),
        DESC
    )
RETURN
IF(
    CurrentProduct IN Top5Products,
    [Total Sales],
    BLANK()
)`,
    explanation: `La mesure vérifie si le produit courant fait partie du Top 5 de sa catégorie. TOPN retourne les 5 produits avec les ventes les plus élevées, et ALLEXCEPT préserve le filtre sur la catégorie tout en supprimant le filtre sur le produit. Le pattern IN vérifie l'appartenance à cette table.`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 4,
    title: 'Running Total (Cumul glissant)',
    category: 'DAX',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Créez un cumul glissant des ventes par date.',
    problemStatement: `Créez une mesure DAX qui calcule le cumul des ventes depuis la première date de vente jusqu'à la date courante dans le contexte de filtre.

Le résultat doit être croissant sur un graphique en courbe par date.`,
    hints: [
      'Vous devez modifier le contexte de filtre sur les dates.',
      'CALCULATE + FILTER sur la table Date est un pattern classique.',
      'DATESBETWEEN ou FILTER + ALL peut fonctionner.',
    ],
    solution: `Running Total =
CALCULATE(
    [Total Sales],
    FILTER(
        ALL('Date'[Date]),
        'Date'[Date] <= MAX('Date'[Date])
    )
)`,
    explanation: `Cette mesure supprime le filtre existant sur les dates avec ALL, puis applique un nouveau filtre : toutes les dates inférieures ou égales à la date maximale du contexte actuel. Cela crée un cumul qui augmente avec le temps.`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 5,
    title: 'Mesure dynamique avec SWITCH',
    category: 'DAX',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Créez une mesure qui change selon une sélection utilisateur.',
    problemStatement: `Vous souhaitez qu'un seul visuel puisse afficher différentes métriques (Ventes, Quantité, Marge) selon la sélection de l'utilisateur dans un slicer.

Créez :
1. Une table déconnectée avec les options
2. Une mesure dynamique qui s'adapte à la sélection`,
    hints: [
      'Créez une table calculée avec DATATABLE ou saisissez-la manuellement.',
      'SELECTEDVALUE retourne la valeur sélectionnée dans un slicer.',
      'SWITCH est plus lisible que des IF imbriqués.',
    ],
    solution: `// Table déconnectée (Enter Data ou DATATABLE)
MetricSelector = DATATABLE(
    "MetricName", STRING,
    {
        {"Ventes"},
        {"Quantité"},
        {"Marge"}
    }
)

// Mesure dynamique
Selected Metric =
SWITCH(
    SELECTEDVALUE(MetricSelector[MetricName]),
    "Ventes", [Total Sales],
    "Quantité", SUM(Sales[Quantity]),
    "Marge", [Total Sales] - [Total Cost],
    [Total Sales]  // valeur par défaut
)`,
    explanation: `Le pattern "Disconnected Table" est très puissant dans Power BI. La table MetricSelector n'a aucune relation avec le modèle, mais elle alimente un slicer. SELECTEDVALUE capture le choix de l'utilisateur, et SWITCH route vers la bonne mesure. La dernière valeur est le défaut si rien n'est sélectionné.`,
    relatedLinks: [
      { label: 'Référence DAX', to: '/dax' },
      { label: 'Fiches Techniques', to: '/fiches' },
    ],
  },
  {
    id: 6,
    title: 'Ratio parent-enfant',
    category: 'DAX',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Calculez le % de contribution de chaque sous-catégorie par rapport à sa catégorie parente.',
    problemStatement: `Dans un rapport, vous affichez les ventes par Catégorie et Sous-catégorie dans une matrice.

Créez une mesure qui calcule le pourcentage de contribution de chaque sous-catégorie par rapport au total de sa catégorie parente.

Exemple : si la catégorie "Électronique" fait 100k€ et la sous-catégorie "Téléphones" fait 40k€, le résultat doit être 40%.`,
    hints: [
      'ALLEXCEPT supprime tous les filtres sauf ceux spécifiés.',
      'Le dénominateur doit être le total de la catégorie parente.',
      'DIVIDE gère proprement les divisions par zéro.',
    ],
    solution: `% of Parent Category =
DIVIDE(
    [Total Sales],
    CALCULATE(
        [Total Sales],
        ALLEXCEPT(Products, Products[Category])
    )
)`,
    explanation: `ALLEXCEPT(Products, Products[Category]) supprime tous les filtres sur la table Products SAUF le filtre sur Category. Cela signifie que le CALCULATE évalue le total des ventes pour toute la catégorie, ce qui sert de dénominateur pour le pourcentage. Format en % dans le visuel.`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 7,
    title: 'Dernière date de vente par client',
    category: 'DAX',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Trouvez la dernière date d\'achat pour chaque client.',
    problemStatement: `Créez une mesure qui retourne la date du dernier achat pour chaque client dans le contexte de filtre actuel.

Cette mesure sera utilisée dans un tableau qui liste les clients avec leur dernière activité.`,
    hints: [
      'MAXX itère sur une table et retourne la valeur maximale.',
      'LASTDATE retourne la dernière date dans le contexte.',
      'CALCULATE peut modifier le contexte pour évaluer par client.',
    ],
    solution: `Last Purchase Date =
MAXX(
    RELATEDTABLE(Sales),
    Sales[OrderDate]
)

// Alternative avec CALCULATE :
Last Purchase Date v2 =
CALCULATE(
    MAX(Sales[OrderDate])
)`,
    explanation: `MAXX itère sur chaque ligne de la table Sales liée au client courant (via RELATEDTABLE) et retourne la date maximale. L'alternative avec CALCULATE + MAX est plus simple car MAX retourne directement la valeur maximale de la colonne dans le contexte de filtre.`,
    relatedLinks: [{ label: 'Référence DAX', to: '/dax' }],
  },
  {
    id: 8,
    title: 'Concevoir un Star Schema',
    category: 'Data Modeling',
    difficulty: 'Débutant',
    points: 1,
    shortDescription: 'Transformez une table plate en un star schema propre.',
    problemStatement: `Vous recevez une table plate FlatSales avec les colonnes suivantes :
OrderID, Date, CustomerName, CustomerCity, ProductName, ProductCategory, Amount, Quantity

Concevez un star schema en identifiant :
1. La table de faits et ses colonnes
2. Les tables de dimensions et leurs colonnes
3. Les relations entre les tables`,
    hints: [
      'Regroupez les colonnes par thème : dates, clients, produits.',
      'La table de faits ne doit contenir que des clés et des mesures.',
      'Chaque dimension doit avoir une clé primaire (surrogate key).',
    ],
    solution: `FactSales :
  - OrderID (PK)
  - DateKey (FK → DimDate)
  - CustomerKey (FK → DimCustomer)
  - ProductKey (FK → DimProduct)
  - Amount
  - Quantity

DimDate :
  - DateKey (PK)
  - Date
  - Year, Month, Quarter, DayOfWeek

DimCustomer :
  - CustomerKey (PK)
  - CustomerName
  - CustomerCity

DimProduct :
  - ProductKey (PK)
  - ProductName
  - ProductCategory

Relations :
  FactSales[DateKey] → DimDate[DateKey] (Many-to-One)
  FactSales[CustomerKey] → DimCustomer[CustomerKey] (Many-to-One)
  FactSales[ProductKey] → DimProduct[ProductKey] (Many-to-One)`,
    explanation: `Le Star Schema est le modèle recommandé pour Power BI. La table de faits (FactSales) contient les mesures numériques et les clés étrangères. Les dimensions contiennent les attributs descriptifs. Ce design optimise les performances et simplifie les formules DAX grâce à la propagation automatique des filtres.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 9,
    title: 'Gérer les Many-to-Many',
    category: 'Data Modeling',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Modélisez une relation Many-to-Many avec une table pont.',
    problemStatement: `Un système universitaire a les entités suivantes :
- Un étudiant peut suivre plusieurs cours
- Un cours peut avoir plusieurs étudiants

Vous avez :
- Students[StudentID, Name, Email]
- Courses[CourseID, CourseName, Credits]

Modélisez cette relation dans Power BI avec une table pont, et expliquez comment écrire une mesure qui compte le nombre d'étudiants par cours.`,
    hints: [
      'Créez une table pont (bridge table) avec les deux clés.',
      'La table pont a des relations Many-to-One vers chaque dimension.',
      'Les filtres se propagent à travers la table pont.',
    ],
    solution: `Table pont :
Enrollment (Bridge Table) :
  - EnrollmentID (PK)
  - StudentID (FK → Students)
  - CourseID (FK → Courses)
  - EnrollmentDate
  - Grade

Relations :
  Enrollment[StudentID] → Students[StudentID] (Many-to-One)
  Enrollment[CourseID] → Courses[CourseID] (Many-to-One)

Mesure :
Students Count = DISTINCTCOUNT(Enrollment[StudentID])`,
    explanation: `Le pattern Bridge Table résout les relations Many-to-Many. La table pont contient une ligne par combinaison étudiant-cours. Les deux relations sont Many-to-One (du pont vers les dimensions), ce qui permet une propagation naturelle des filtres dans les deux sens. DISTINCTCOUNT est essentiel pour ne pas compter un étudiant plusieurs fois.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 10,
    title: 'Role-Playing Dimensions',
    category: 'Data Modeling',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Gérez plusieurs colonnes de date avec une seule table Date.',
    problemStatement: `Votre table Orders contient trois colonnes de date :
- OrderDate
- ShipDate
- DeliveryDate

Vous avez une seule table Date dans votre modèle. Comment configurer les relations pour pouvoir filtrer par chacune de ces dates ?

Créez une mesure qui calcule le délai moyen de livraison.`,
    hints: [
      'Power BI ne permet qu\'une seule relation active entre deux tables.',
      'Les relations inactives s\'activent avec USERELATIONSHIP.',
      'DATEDIFF calcule la différence entre deux dates.',
    ],
    solution: `Relations :
  Orders[OrderDate] → Date[Date] (Active, Many-to-One)
  Orders[ShipDate] → Date[Date] (Inactive, Many-to-One)
  Orders[DeliveryDate] → Date[Date] (Inactive, Many-to-One)

// Ventes par date de livraison
Sales by Delivery =
CALCULATE(
    [Total Sales],
    USERELATIONSHIP(Orders[DeliveryDate], 'Date'[Date])
)

// Délai moyen de livraison
Avg Delivery Days =
AVERAGEX(
    Orders,
    DATEDIFF(Orders[OrderDate], Orders[DeliveryDate], DAY)
)`,
    explanation: `Power BI n'autorise qu'une relation active entre deux tables. Les "role-playing dimensions" utilisent des relations inactives que l'on active ponctuellement avec USERELATIONSHIP dans CALCULATE. C'est un pattern courant pour les tables Date utilisées dans plusieurs contextes.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 11,
    title: 'Unpivot de colonnes',
    category: 'Power Query / M',
    difficulty: 'Débutant',
    points: 1,
    shortDescription: 'Transformez des colonnes de mois en lignes.',
    problemStatement: `Vous recevez un fichier Excel avec cette structure :
| Product | Jan | Feb | Mar | Apr |
|---------|-----|-----|-----|-----|
| Widget  | 100 | 150 | 200 | 180 |
| Gadget  | 80  | 120 | 90  | 110 |

Transformez-le en format tabulaire :
| Product | Month | Value |
|---------|-------|-------|
| Widget  | Jan   | 100   |
| Widget  | Feb   | 150   |
| ...     | ...   | ...   |`,
    hints: [
      'Sélectionnez d\'abord la colonne Product.',
      'Utilisez "Unpivot Other Columns" pour transformer le reste.',
      'Renommez les colonnes Attribute → Month et Value.',
    ],
    solution: `let
    Source = Excel.Workbook(File.Contents("..."), null, true),
    Sheet = Source{[Name="Sheet1"]}[Data],
    Promoted = Table.PromoteHeaders(Sheet),
    Unpivoted = Table.UnpivotOtherColumns(
        Promoted,
        {"Product"},
        "Month",
        "Value"
    ),
    TypeChanged = Table.TransformColumnTypes(
        Unpivoted,
        {{"Value", type number}}
    )
in
    TypeChanged`,
    explanation: `Table.UnpivotOtherColumns est la fonction clé. Elle prend toutes les colonnes SAUF celles spécifiées et les "dépivote" en paires attribut-valeur. C'est l'inverse d'un pivot. Ce pattern est essentiel quand les données sources sont en format "crosstab" (courant dans Excel).`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 12,
    title: 'Appel API REST paginée',
    category: 'Power Query / M',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Écrivez une requête M qui appelle une API REST paginée.',
    problemStatement: `Une API REST retourne des données paginées avec la structure :
{
  "data": [...],
  "nextPage": "https://api.example.com/data?page=2"
}

Le champ "nextPage" est null quand il n'y a plus de pages.

Écrivez une requête Power Query / M qui récupère automatiquement toutes les pages et combine les résultats.`,
    hints: [
      'List.Generate crée une liste en itérant jusqu\'à une condition d\'arrêt.',
      'Web.Contents effectue les appels HTTP.',
      'Json.Document parse la réponse JSON.',
    ],
    solution: `let
    GetPage = (url as text) =>
        let
            response = Web.Contents(url),
            json = Json.Document(response)
        in
            json,

    AllPages = List.Generate(
        () => GetPage("https://api.example.com/data"),
        each [nextPage] <> null,
        each GetPage([nextPage]),
        each [data]
    ),

    Combined = List.Combine(AllPages),
    AsTable = Table.FromList(
        Combined,
        Splitter.SplitByNothing(),
        null, null,
        ExtraValues.Error
    ),
    Expanded = Table.ExpandRecordColumn(
        AsTable, "Column1",
        Record.FieldNames(AsTable{0}[Column1])
    )
in
    Expanded`,
    explanation: `List.Generate est la clé pour la pagination. Il prend 4 arguments : valeur initiale, condition de continuation, fonction de passage à l'étape suivante, et transformation du résultat. On itère tant que nextPage n'est pas null, et on extrait le champ data de chaque page. List.Combine fusionne toutes les listes en une seule.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 13,
    title: 'Table de dates personnalisée en M',
    category: 'Power Query / M',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Créez une table de dates complète en Power Query.',
    problemStatement: `Créez une table de dates du 01/01/2020 au 31/12/2030 avec les colonnes suivantes :
- Date
- Year, Month, MonthName, Quarter, DayOfWeek, DayName
- IsWeekend (true/false)
- FiscalYear (début en juillet)`,
    hints: [
      'List.Dates génère une liste de dates.',
      '#date crée une date littérale en M.',
      'Date.Year, Date.Month, etc. extraient les composants.',
    ],
    solution: `let
    StartDate = #date(2020, 1, 1),
    EndDate = #date(2030, 12, 31),
    Duration = Duration.Days(EndDate - StartDate) + 1,
    DateList = List.Dates(StartDate, Duration, #duration(1,0,0,0)),
    AsTable = Table.FromList(
        DateList, Splitter.SplitByNothing(), {"Date"},
        null, ExtraValues.Error
    ),
    Typed = Table.TransformColumnTypes(AsTable, {{"Date", type date}}),
    AddYear = Table.AddColumn(Typed, "Year", each Date.Year([Date]), Int64.Type),
    AddMonth = Table.AddColumn(AddYear, "Month", each Date.Month([Date]), Int64.Type),
    AddMonthName = Table.AddColumn(AddMonth, "MonthName",
        each Date.ToText([Date], "MMMM", "fr-FR"), type text),
    AddQuarter = Table.AddColumn(AddMonthName, "Quarter",
        each "Q" & Text.From(Date.QuarterOfYear([Date])), type text),
    AddDayOfWeek = Table.AddColumn(AddQuarter, "DayOfWeek",
        each Date.DayOfWeek([Date], Day.Monday) + 1, Int64.Type),
    AddDayName = Table.AddColumn(AddDayOfWeek, "DayName",
        each Date.ToText([Date], "dddd", "fr-FR"), type text),
    AddIsWeekend = Table.AddColumn(AddDayName, "IsWeekend",
        each Date.DayOfWeek([Date], Day.Monday) >= 5, type logical),
    AddFiscalYear = Table.AddColumn(AddIsWeekend, "FiscalYear",
        each if Date.Month([Date]) >= 7
             then Date.Year([Date]) + 1
             else Date.Year([Date]), Int64.Type)
in
    AddFiscalYear`,
    explanation: `List.Dates génère la séquence de dates, puis on enrichit la table colonne par colonne. Le FiscalYear commence en juillet : si le mois >= 7, on ajoute 1 à l'année. Cette approche en M est préférée à une table DAX calculée car elle est évaluée une seule fois au refresh et ne consomme pas de mémoire moteur.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 14,
    title: 'Créer un Lakehouse et charger des données',
    category: 'Fabric',
    difficulty: 'Débutant',
    points: 1,
    shortDescription: 'Décrivez les étapes pour créer un Lakehouse dans Fabric.',
    problemStatement: `Vous débutez avec Microsoft Fabric. Décrivez les étapes complètes pour :
1. Créer un Lakehouse dans un workspace Fabric
2. Charger un fichier CSV dans le Lakehouse
3. Créer une table Delta à partir de ce fichier
4. Interroger les données avec SQL`,
    hints: [
      'Le Lakehouse est disponible dans l\'expérience Data Engineering.',
      'Vous pouvez charger des fichiers via l\'interface ou un notebook.',
      'Les fichiers dans /Files ne sont pas des tables tant qu\'ils ne sont pas convertis.',
    ],
    solution: `Étapes :

1. Créer le Lakehouse :
   - Ouvrir le workspace Fabric
   - Cliquer sur "+ New" → "Lakehouse"
   - Nommer le Lakehouse (ex: "SalesLakehouse")

2. Charger le fichier CSV :
   - Dans le Lakehouse, cliquer sur "Upload" → "Upload files"
   - Sélectionner le fichier CSV → il arrive dans /Files

3. Créer une table Delta :
   - Clic droit sur le fichier → "Load to Tables"
   - Ou via notebook PySpark :
     df = spark.read.csv("Files/sales.csv", header=True, inferSchema=True)
     df.write.format("delta").saveAsTable("sales")

4. Interroger avec SQL :
   - Basculer vers "SQL analytics endpoint"
   - SELECT * FROM sales WHERE Amount > 1000
   - Ou utiliser un notebook avec spark.sql()`,
    explanation: `Le Lakehouse de Fabric combine la flexibilité d'un Data Lake (stockage de fichiers) avec la structure d'un Data Warehouse (tables Delta). Le format Delta Lake ajoute les transactions ACID et le versioning. Le SQL endpoint permet d'interroger les tables sans Spark.`,
    relatedLinks: [
      { label: 'Notebooks Fabric', to: '/notebooks' },
      { label: 'Architecture', to: '/architecture' },
    ],
  },
  {
    id: 15,
    title: 'Pipeline Medallion (Bronze/Silver/Gold)',
    category: 'Fabric',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Concevez un pipeline Bronze → Silver → Gold pour des données IoT.',
    problemStatement: `Vous recevez des données de capteurs IoT (température, humidité, pression) toutes les 5 secondes.

Concevez un pipeline Medallion complet dans Fabric :
1. Bronze : ingestion brute
2. Silver : nettoyage et validation
3. Gold : agrégations pour le reporting

Décrivez l'architecture et donnez un exemple de code PySpark pour chaque couche.`,
    hints: [
      'Bronze = données brutes, exactement comme reçues.',
      'Silver = dédupliquées, typées, avec validation des valeurs.',
      'Gold = agrégations métier (moyennes horaires, alertes, etc.).',
    ],
    solution: `# Architecture Medallion

## Bronze (Raw)
df_bronze = (spark.readStream
    .format("kafka")
    .option("subscribe", "iot-sensors")
    .load())

df_bronze.writeStream \\
    .format("delta") \\
    .outputMode("append") \\
    .option("checkpointLocation", "Files/checkpoints/bronze") \\
    .toTable("bronze_sensors")

## Silver (Cleansed)
df_silver = spark.sql("""
    SELECT DISTINCT
        sensor_id,
        CAST(temperature AS DOUBLE) as temperature,
        CAST(humidity AS DOUBLE) as humidity,
        CAST(pressure AS DOUBLE) as pressure,
        CAST(timestamp AS TIMESTAMP) as event_time,
        current_timestamp() as processed_at
    FROM bronze_sensors
    WHERE temperature BETWEEN -50 AND 60
      AND humidity BETWEEN 0 AND 100
""")
df_silver.write.format("delta").mode("overwrite").saveAsTable("silver_sensors")

## Gold (Business)
df_gold = spark.sql("""
    SELECT
        sensor_id,
        date_trunc('hour', event_time) as hour,
        AVG(temperature) as avg_temp,
        MIN(temperature) as min_temp,
        MAX(temperature) as max_temp,
        AVG(humidity) as avg_humidity,
        COUNT(*) as reading_count
    FROM silver_sensors
    GROUP BY sensor_id, date_trunc('hour', event_time)
""")
df_gold.write.format("delta").mode("overwrite").saveAsTable("gold_sensor_hourly")`,
    explanation: `L'architecture Medallion (ou Multi-Hop) est le standard dans Fabric/Databricks. Bronze stocke les données brutes pour la traçabilité. Silver nettoie (déduplication, typage, filtrage des anomalies). Gold prépare les données métier optimisées pour le reporting Power BI avec Direct Lake.`,
    relatedLinks: [
      { label: 'Notebooks Fabric', to: '/notebooks' },
      { label: 'Architecture', to: '/architecture' },
    ],
  },
  {
    id: 16,
    title: 'Direct Lake vs Import',
    category: 'Fabric',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Comparez Direct Lake et Import mode avec des scénarios concrets.',
    problemStatement: `Votre entreprise migre vers Fabric. Le CTO vous demande : "Quand utiliser Direct Lake vs Import mode ?"

Listez 3 scénarios où Direct Lake est préférable et 3 scénarios où Import reste meilleur. Justifiez chaque choix.`,
    hints: [
      'Direct Lake lit directement les fichiers Delta/Parquet.',
      'Import copie les données dans le moteur VertiPaq.',
      'Pensez aux volumes de données, à la fraîcheur, et aux calculs complexes.',
    ],
    solution: `## Direct Lake est meilleur quand :

1. **Gros volumes (> 10 GB)** : Direct Lake évite de charger
   toutes les données en mémoire. Le framing ne charge que
   les colonnes nécessaires.

2. **Fraîcheur temps réel** : Les données sont lues directement
   depuis le Lakehouse/Warehouse. Pas besoin de refresh —
   les données sont à jour dès qu'elles sont écrites.

3. **Nombreux modèles sur les mêmes données** : Plusieurs
   semantic models peuvent pointer vers le même Lakehouse
   sans dupliquer les données en mémoire.

## Import est meilleur quand :

1. **Calculs DAX très complexes** : VertiPaq est optimisé pour
   les scans et agrégations. Direct Lake peut "fallback"
   en DirectQuery si les données ne tiennent pas en mémoire.

2. **Sources hors Fabric** : Direct Lake ne fonctionne qu'avec
   des données dans un Lakehouse ou Warehouse Fabric.
   Pour SQL Server on-prem ou APIs, Import reste nécessaire.

3. **Modèle < 1 GB avec transformations lourdes** : Si le
   volume est faible et que Power Query fait des transformations
   complexes (merge, unpivot), Import est plus simple et
   performant.`,
    explanation: `Direct Lake est le mode natif de Fabric, combinant la performance d'Import (moteur VertiPaq) avec la fraîcheur de DirectQuery. Le "framing" charge les métadonnées des fichiers Parquet et les colonnes à la demande. En cas de dépassement de la capacité mémoire, il bascule en DirectQuery (fallback).`,
    relatedLinks: [
      { label: 'Architecture', to: '/architecture' },
      { label: 'Fiches Techniques', to: '/fiches' },
    ],
  },
  {
    id: 17,
    title: 'Optimiser une mesure lente',
    category: 'Performance',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Réécrivez une mesure DAX lente pour la rendre performante.',
    problemStatement: `La mesure suivante est très lente sur un modèle de 5 millions de lignes :

\`\`\`
Slow Measure =
SUMX(
    ALL(Sales),
    IF(
        Sales[Date] <= MAX('Date'[Date]),
        Sales[Amount],
        0
    )
)
\`\`\`

Analysez pourquoi elle est lente et proposez une version optimisée.`,
    hints: [
      'SUMX itère sur CHAQUE ligne — c\'est le problème principal.',
      'IF row-by-row empêche la vectorisation du moteur.',
      'Remplacez l\'itération par une manipulation de contexte de filtre.',
    ],
    solution: `// Version optimisée
Optimized Measure =
CALCULATE(
    SUM(Sales[Amount]),
    FILTER(
        ALL('Date'[Date]),
        'Date'[Date] <= MAX('Date'[Date])
    )
)

// Ou encore mieux avec DATESINPERIOD :
Optimized v2 =
CALCULATE(
    SUM(Sales[Amount]),
    DATESBETWEEN(
        'Date'[Date],
        BLANK(),
        MAX('Date'[Date])
    )
)`,
    explanation: `La version lente itère sur CHAQUE ligne de Sales (5M lignes) avec SUMX et évalue un IF pour chacune. C'est O(n) par cellule du rapport.

La version optimisée utilise CALCULATE pour modifier le contexte de filtre sur la table Date (beaucoup plus petite), puis SUM agrège en une seule opération vectorisée. Le moteur VertiPaq est optimisé pour les filtres, pas pour les itérations row-by-row.`,
    relatedLinks: [
      { label: 'Performance', to: '/performance' },
      { label: 'Référence DAX', to: '/dax' },
    ],
  },
  {
    id: 18,
    title: 'Réduire la taille du modèle',
    category: 'Performance',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Listez les techniques pour réduire un modèle de 2 GB.',
    problemStatement: `Votre modèle Power BI fait 2 GB et approche la limite de votre capacité. Les utilisateurs se plaignent de la lenteur des refreshes.

Listez au moins 5 techniques concrètes pour réduire la taille du modèle, classées par impact potentiel (du plus au moins impactant).`,
    hints: [
      'Les colonnes texte à haute cardinalité sont les plus volumineuses.',
      'VertiPaq compresse par colonne — moins de valeurs uniques = meilleure compression.',
      'Vérifiez si toutes les colonnes sont réellement utilisées.',
    ],
    solution: `1. **Supprimer les colonnes inutilisées** (impact : très élevé)
   - Colonnes importées mais jamais utilisées dans les visuels/mesures
   - Outil : VertiPaq Analyzer, DAX Studio → "View Metrics"

2. **Réduire la cardinalité des colonnes** (impact : élevé)
   - Arrondir les décimaux (ex: 2 au lieu de 8)
   - Regrouper les valeurs rares (ex: villes < 10 ventes → "Autres")
   - Découper les DateTime en Date + Heure séparés

3. **Utiliser des clés entières (surrogate keys)** (impact : élevé)
   - Remplacer les clés texte par des INT dans les relations
   - Les entiers se compressent beaucoup mieux que le texte

4. **Désactiver l'auto date/time** (impact : moyen)
   - Fichier → Options → Données → décocher "Auto date/time"
   - Économise une table cachée par colonne Date

5. **Optimiser les types de données** (impact : moyen)
   - INT au lieu de DECIMAL quand possible
   - Colonnes booléennes au lieu de texte "Oui"/"Non"

6. **Filtrer les données historiques** (impact : variable)
   - N'importer que les 3-5 dernières années si possible
   - Utiliser le refresh incrémental pour archiver`,
    explanation: `VertiPaq (le moteur de stockage) compresse par colonne en utilisant un dictionnaire. La cardinalité (nombre de valeurs uniques) est le facteur #1 de la taille. Utilisez DAX Studio → View Metrics pour identifier les colonnes les plus volumineuses et prioriser vos optimisations.`,
    relatedLinks: [
      { label: 'Performance', to: '/performance' },
      { label: 'Fiches Techniques', to: '/fiches' },
    ],
  },
  {
    id: 19,
    title: 'Configurer le RLS dynamique',
    category: 'Administration',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Configurez un Row-Level Security dynamique par commercial.',
    problemStatement: `Votre entreprise a 50 commerciaux. Chaque commercial ne doit voir que ses propres données de ventes.

Configurez un RLS dynamique qui :
1. Identifie automatiquement l'utilisateur connecté
2. Filtre les données en conséquence
3. Fonctionne sans créer 50 rôles différents`,
    hints: [
      'USERPRINCIPALNAME() retourne l\'email de l\'utilisateur connecté.',
      'Vous n\'avez besoin que d\'un seul rôle RLS.',
      'La table Employees doit contenir les emails des commerciaux.',
    ],
    solution: `Configuration :

1. Table Employees avec colonne Email (= UPN Azure AD)

2. Relation : Sales[EmployeeID] → Employees[EmployeeID]

3. Créer un rôle RLS "SalesRep" :
   - Table : Employees
   - Filtre DAX :
     [Email] = USERPRINCIPALNAME()

4. Test dans Power BI Desktop :
   - Onglet Modeling → "View as" → sélectionner le rôle
   - Saisir un email de test

5. Publication :
   - Publier le rapport sur le Service
   - Workspace → Dataset → Security
   - Ajouter les commerciaux au rôle "SalesRep"

Note : les admins du workspace voient toujours
toutes les données (bypass automatique).`,
    explanation: `Le RLS dynamique est beaucoup plus maintenable que des rôles statiques. USERPRINCIPALNAME() retourne l'UPN (User Principal Name) de l'utilisateur connecté au service Power BI, qui correspond à son email Azure AD. Le filtre se propage automatiquement via les relations du modèle — un filtre sur Employees filtre aussi Sales.`,
    relatedLinks: [{ label: 'Fiches Techniques', to: '/fiches' }],
  },
  {
    id: 20,
    title: 'Automatiser un refresh via API',
    category: 'Administration',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Écrivez un script Python qui déclenche et surveille un refresh.',
    problemStatement: `Vous devez automatiser le rafraîchissement d'un dataset Power BI via l'API REST.

Écrivez un script Python qui :
1. S'authentifie via un Service Principal
2. Déclenche un refresh du dataset
3. Attend la fin du refresh (polling)
4. Retourne le statut final (succès/échec)`,
    hints: [
      'L\'API Power BI utilise OAuth2 avec Azure AD.',
      'L\'endpoint de refresh est POST /datasets/{id}/refreshes.',
      'Le statut se vérifie avec GET /datasets/{id}/refreshes.',
    ],
    solution: `import requests
import time

# Configuration
TENANT_ID = "your-tenant-id"
CLIENT_ID = "your-client-id"
CLIENT_SECRET = "your-client-secret"
DATASET_ID = "your-dataset-id"
GROUP_ID = "your-workspace-id"

# 1. Authentification
def get_token():
    url = f"https://login.microsoftonline.com/{TENANT_ID}/oauth2/v2.0/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "https://analysis.windows.net/powerbi/api/.default"
    }
    response = requests.post(url, data=data)
    return response.json()["access_token"]

# 2. Déclencher le refresh
def trigger_refresh(token):
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{GROUP_ID}/datasets/{DATASET_ID}/refreshes"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.post(url, headers=headers, json={"notifyOption": "NoNotification"})
    if response.status_code == 202:
        print("Refresh déclenché avec succès")
        return True
    else:
        print(f"Erreur: {response.status_code} - {response.text}")
        return False

# 3. Polling du statut
def wait_for_refresh(token, timeout=3600, interval=30):
    url = f"https://api.powerbi.com/v1.0/myorg/groups/{GROUP_ID}/datasets/{DATASET_ID}/refreshes?$top=1"
    headers = {"Authorization": f"Bearer {token}"}
    elapsed = 0

    while elapsed < timeout:
        response = requests.get(url, headers=headers)
        refresh = response.json()["value"][0]
        status = refresh["status"]

        if status == "Completed":
            print(f"Refresh terminé avec succès en {elapsed}s")
            return True
        elif status == "Failed":
            print(f"Refresh échoué: {refresh.get('serviceExceptionJson', 'Unknown error')}")
            return False

        print(f"En cours... ({elapsed}s)")
        time.sleep(interval)
        elapsed += interval

    print("Timeout atteint")
    return False

# Exécution
token = get_token()
if trigger_refresh(token):
    success = wait_for_refresh(token)`,
    explanation: `Ce script utilise le flux OAuth2 "client_credentials" avec un Service Principal (App Registration Azure AD). Le refresh est asynchrone — l'API retourne 202 immédiatement. Le polling vérifie le statut périodiquement. En production, ajoutez la gestion d'erreurs, les retries, et les logs structurés. Pensez aussi à Azure Functions ou Logic Apps pour l'orchestration.`,
    relatedLinks: [{ label: 'API Reference', to: '/api' }],
  },
  {
    id: 21,
    title: 'Moyenne mobile 3 mois',
    category: 'DAX',
    difficulty: 'Avancé',
    points: 4,
    shortDescription: 'Calculez une moyenne mobile sur 3 mois pour lisser les tendances.',
    problemStatement: `Créez une mesure DAX qui calcule la moyenne mobile des ventes sur les 3 derniers mois. Cette mesure sera utilisée dans un graphique en courbe pour visualiser les tendances lissées.

La mesure doit fonctionner même si certains mois n'ont pas de données.`,
    hints: [
      'DATESINPERIOD peut sélectionner une fenêtre de dates.',
      'AVERAGEX peut itérer sur les mois de la fenêtre.',
      'Pensez à utiliser CALCULATE pour modifier le contexte.',
    ],
    solution: `Moving Avg 3M =
AVERAGEX(
    DATESINPERIOD(
        'Date'[Date],
        MAX('Date'[Date]),
        -3,
        MONTH
    ),
    CALCULATE([Total Sales])
)

// Alternative plus précise (moyenne par mois) :
Moving Avg 3M v2 =
VAR Last3Months =
    DATESINPERIOD('Date'[Date], MAX('Date'[Date]), -3, MONTH)
VAR MonthsWithData =
    CALCULATETABLE(
        DISTINCT('Date'[YearMonth]),
        Last3Months,
        NOT ISBLANK([Total Sales])
    )
RETURN
DIVIDE(
    CALCULATE([Total Sales], Last3Months),
    COUNTROWS(MonthsWithData)
)`,
    explanation: `DATESINPERIOD crée une fenêtre glissante de 3 mois en arrière depuis la date max du contexte. AVERAGEX itère sur chaque date de cette fenêtre. La v2 est plus robuste : elle ne divise que par le nombre de mois ayant réellement des données, évitant de diluer la moyenne avec des mois vides.`,
    relatedLinks: [
      { label: 'Référence DAX', to: '/dax' },
      { label: 'Performance', to: '/performance' },
    ],
  },
  {
    id: 22,
    title: 'Notebook Spark pour data profiling',
    category: 'Fabric',
    difficulty: 'Intermédiaire',
    points: 2,
    shortDescription: 'Écrivez un notebook de profiling automatique de données.',
    problemStatement: `Vous venez de charger un nouveau dataset dans votre Lakehouse Fabric. Avant de construire le modèle, vous devez profiler les données.

Écrivez un notebook PySpark qui analyse automatiquement une table et produit :
1. Le nombre de lignes et colonnes
2. Les types de données
3. Le % de valeurs nulles par colonne
4. La cardinalité de chaque colonne
5. Des statistiques descriptives pour les colonnes numériques`,
    hints: [
      'df.describe() donne les statistiques de base.',
      'Itérez sur df.columns pour l\'analyse par colonne.',
      'df.select(countDistinct(col)) donne la cardinalité.',
    ],
    solution: `from pyspark.sql import functions as F

# Charger la table
df = spark.table("lakehouse.sales")

# 1. Shape
print(f"Lignes: {df.count()}, Colonnes: {len(df.columns)}")

# 2. Types
df.printSchema()

# 3. Nulls + Cardinalité
profiling = []
for col_name in df.columns:
    col_stats = df.agg(
        F.count(F.col(col_name)).alias("non_null"),
        F.sum(F.when(F.col(col_name).isNull(), 1).otherwise(0)).alias("nulls"),
        F.countDistinct(F.col(col_name)).alias("distinct")
    ).collect()[0]

    total = df.count()
    profiling.append({
        "column": col_name,
        "type": str(df.schema[col_name].dataType),
        "null_pct": round(col_stats["nulls"] / total * 100, 1),
        "cardinality": col_stats["distinct"],
        "uniqueness": round(col_stats["distinct"] / total * 100, 1)
    })

profile_df = spark.createDataFrame(profiling)
display(profile_df)

# 4. Statistiques numériques
numeric_cols = [f.name for f in df.schema.fields
                if str(f.dataType) in ("IntegerType()", "DoubleType()", "LongType()")]
if numeric_cols:
    display(df.select(numeric_cols).describe())`,
    explanation: `Le data profiling est une étape cruciale avant la modélisation. Ce notebook automatise l'analyse en itérant sur chaque colonne. La cardinalité aide à identifier les clés candidates et les colonnes à haute cardinalité (problématiques pour VertiPaq). Le % de nulls révèle les problèmes de qualité des données.`,
    relatedLinks: [
      { label: 'Notebooks Fabric', to: '/notebooks' },
      { label: 'Architecture', to: '/architecture' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  LocalStorage helpers                                               */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = 'pbi-exercises-completed'

function getCompletedIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCompletedIds(ids: number[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
}

/* ------------------------------------------------------------------ */
/*  Components                                                         */
/* ------------------------------------------------------------------ */

function StarsDisplay({ count, max = 5 }: { count: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? 'text-primary fill-primary' : 'text-pbi-muted/30'}
        />
      ))}
    </div>
  )
}

function CategoryBadge({ category }: { category: Category }) {
  const config = categoryConfig[category]
  const Icon = config.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: config.color, background: config.bg }}
    >
      <Icon size={12} />
      {category}
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = difficultyConfig[difficulty]
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold"
      style={{ color: config.color, background: config.bg }}
    >
      {difficulty}
    </span>
  )
}

/* ── Stats Bar ── */
function StatsBar({ completedIds }: { completedIds: number[] }) {
  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const ex of exercises) {
      counts[ex.category] = (counts[ex.category] || 0) + 1
    }
    return counts
  }, [])

  const difficultyStats = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const ex of exercises) {
      counts[ex.difficulty] = (counts[ex.difficulty] || 0) + 1
    }
    return counts
  }, [])

  const totalPoints = exercises.reduce((s, e) => s + e.points, 0)
  const earnedPoints = exercises
    .filter((e) => completedIds.includes(e.id))
    .reduce((s, e) => s + e.points, 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-5 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold text-pbi-text">Statistiques</span>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-pbi-muted">Progression</span>
          <span className="text-sm font-bold text-primary">
            {completedIds.length}/{exercises.length} exercices
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #f2c811, #f59e0b)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(completedIds.length / exercises.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gray-100">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          <span className="text-sm text-pbi-muted">Score</span>
        </div>
        <span className="text-lg font-bold text-primary">
          {earnedPoints} / {totalPoints} pts
        </span>
      </div>

      {/* Category / Difficulty breakdown */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-pbi-muted mb-2 uppercase tracking-wide">Par catégorie</p>
          <div className="space-y-1.5">
            {Object.entries(categoryStats).map(([cat, count]) => (
              <div key={cat} className="flex items-center justify-between text-xs">
                <span style={{ color: categoryConfig[cat as Category]?.color }}>{cat}</span>
                <span className="text-pbi-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-pbi-muted mb-2 uppercase tracking-wide">Par difficulté</p>
          <div className="space-y-1.5">
            {Object.entries(difficultyStats).map(([diff, count]) => (
              <div key={diff} className="flex items-center justify-between text-xs">
                <span style={{ color: difficultyConfig[diff as Difficulty]?.color }}>{diff}</span>
                <span className="text-pbi-muted">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Exercise Card ── */
function ExerciseCard({
  exercise,
  isCompleted,
  onToggleComplete,
}: {
  exercise: Exercise
  isCompleted: boolean
  onToggleComplete: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`glass-card overflow-hidden transition-all duration-300 ${
        isCompleted ? 'ring-1 ring-emerald-500/30' : ''
      }`}
    >
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span
              className="flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold shrink-0"
              style={{
                background: difficultyConfig[exercise.difficulty].bg,
                color: difficultyConfig[exercise.difficulty].color,
              }}
            >
              #{exercise.id}
            </span>
            <div>
              <h3 className="text-pbi-text font-semibold text-base leading-tight">
                {exercise.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5">
                <CategoryBadge category={exercise.category} />
                <DifficultyBadge difficulty={exercise.difficulty} />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StarsDisplay count={difficultyStars[exercise.difficulty]} />
            <button
              onClick={onToggleComplete}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                  : 'bg-gray-100 text-pbi-muted hover:bg-pbi-border hover:text-pbi-text'
              }`}
            >
              <CheckCircle2 size={14} />
              {isCompleted ? 'Fait' : 'Marquer'}
            </button>
          </div>
        </div>

        <p className="text-sm text-pbi-muted leading-relaxed mb-3">
          {exercise.shortDescription}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              Masquer l'exercice
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              Voir l'exercice
            </>
          )}
        </button>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-pbi-border pt-4">
              {/* Problem statement */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-pbi-text mb-2 flex items-center gap-2">
                  <Target size={16} className="text-info" />
                  Énoncé
                </h4>
                <div className="bg-gray-100 rounded-lg p-4 text-sm text-pbi-text/90 whitespace-pre-line leading-relaxed">
                  {exercise.problemStatement}
                </div>
              </div>

              {/* Hints */}
              {exercise.hints.length > 0 && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-sm font-medium text-warning hover:text-warning/80 transition-colors mb-2"
                  >
                    <Lightbulb size={16} />
                    {showHints ? 'Masquer les indices' : `Voir les indices (${exercise.hints.length})`}
                    {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                  <AnimatePresence>
                    {showHints && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-warning/5 border border-warning/20 rounded-lg p-3 space-y-2">
                          {exercise.hints.map((hint, i) => (
                            <p key={i} className="text-sm text-pbi-text/80 flex gap-2">
                              <span className="text-warning shrink-0">💡</span>
                              {hint}
                            </p>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Solution toggle */}
              <div className="mb-4">
                <button
                  onClick={() => setShowSolution(!showSolution)}
                  className="flex items-center gap-2 text-sm font-medium text-success hover:text-success/80 transition-colors mb-2"
                >
                  {showSolution ? <EyeOff size={16} /> : <Eye size={16} />}
                  {showSolution ? 'Masquer la correction' : 'Voir la correction'}
                  {showSolution ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                <AnimatePresence>
                  {showSolution && (
                    <motion.div
                      initial={{ opacity: 0, filter: 'blur(10px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(10px)' }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="bg-gray-100 rounded-lg p-4 mb-3 border border-success/20">
                        <h5 className="text-xs uppercase tracking-wide text-success mb-2 font-semibold">
                          Solution
                        </h5>
                        <pre className="text-sm text-pbi-text/90 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">
                          {exercise.solution}
                        </pre>
                      </div>
                      <div className="bg-info/5 border border-info/20 rounded-lg p-4">
                        <h5 className="text-xs uppercase tracking-wide text-info mb-2 font-semibold">
                          Explication
                        </h5>
                        <p className="text-sm text-pbi-text/80 whitespace-pre-line leading-relaxed">
                          {exercise.explanation}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Related links */}
              {exercise.relatedLinks.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-pbi-border/30">
                  <span className="text-xs text-pbi-muted">Pages liées :</span>
                  {exercise.relatedLinks.map((link, i) => (
                    <Link
                      key={i}
                      to={link.to}
                      className="inline-flex items-center gap-1 text-xs text-fabric hover:text-fabric/80 bg-fabric/10 px-2 py-1 rounded-md transition-colors"
                    >
                      {link.label}
                      <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                          */
/* ------------------------------------------------------------------ */

export default function Exercises() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all')
  const [completedIds, setCompletedIds] = useState<number[]>(getCompletedIds)

  const toggleComplete = useCallback((id: number) => {
    setCompletedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      saveCompletedIds(next)
      return next
    })
  }, [])

  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false
      return true
    })
  }, [selectedCategory, selectedDifficulty])

  return (
    <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h1
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent"
            style={{
              backgroundImage: 'linear-gradient(135deg, #f2c811, #0078d4)',
            }}
          >
            Exercices Pratiques
          </h1>
        </div>
        <p className="text-pbi-muted text-lg">
          Testez vos connaissances avec des exercices corrigés
        </p>
      </motion.div>

      {/* Stats bar */}
      <StatsBar completedIds={completedIds} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5 mb-6 space-y-4"
      >
        {/* Category filter */}
        <div>
          <label className="text-xs text-pbi-muted uppercase tracking-wide font-semibold mb-2 block">
            Catégorie
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary text-pbi-dark'
                  : 'bg-gray-100 text-pbi-muted hover:bg-pbi-border hover:text-pbi-text'
              }`}
            >
              Tous
            </button>
            {ALL_CATEGORIES.map((cat) => {
              const config = categoryConfig[cat]
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: isActive ? config.color : config.bg,
                    color: isActive ? '#f5f5f5' : config.color,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Difficulty filter */}
        <div>
          <label className="text-xs text-pbi-muted uppercase tracking-wide font-semibold mb-2 block">
            Difficulté
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedDifficulty === 'all'
                  ? 'bg-primary text-pbi-dark'
                  : 'bg-gray-100 text-pbi-muted hover:bg-pbi-border hover:text-pbi-text'
              }`}
            >
              Tous
            </button>
            {ALL_DIFFICULTIES.map((diff) => {
              const config = difficultyConfig[diff]
              const isActive = selectedDifficulty === diff
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: isActive ? config.color : config.bg,
                    color: isActive ? '#f5f5f5' : config.color,
                  }}
                >
                  {diff}
                </button>
              )
            })}
          </div>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4 px-1">
        <p className="text-sm text-pbi-muted">
          {filtered.length} exercice{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
        </p>
        {completedIds.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Réinitialiser votre progression ?')) {
                setCompletedIds([])
                saveCompletedIds([])
              }
            }}
            className="text-xs text-danger/70 hover:text-danger transition-colors"
          >
            Réinitialiser
          </button>
        )}
      </div>

      {/* Exercise cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ex) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              isCompleted={completedIds.includes(ex.id)}
              onToggleComplete={() => toggleComplete(ex.id)}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Settings className="w-12 h-12 text-pbi-muted/30 mx-auto mb-4" />
            <p className="text-pbi-muted">Aucun exercice ne correspond aux filtres sélectionnés.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
