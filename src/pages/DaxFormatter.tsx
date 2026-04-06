import React, { useState, useCallback, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  Settings2,
  Code2,
  Play,
  RotateCcw,
  ChevronDown,
  Zap,
  FileCode,
  Hash,
  Type,
  ArrowRightLeft,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Language = 'dax' | 'm'
type IndentStyle = '2' | '4' | 'tab'

interface FormatterOptions {
  indentStyle: IndentStyle
  uppercaseKeywords: boolean
  maxLineLength: 80 | 120 | 0
  compact: boolean
}

interface FormatStats {
  linesBefore: number
  linesAfter: number
  charsBefore: number
  charsAfter: number
  timeMs: number
}

// ---------------------------------------------------------------------------
// DAX keywords (exhaustive-enough set)
// ---------------------------------------------------------------------------

const DAX_KEYWORDS = [
  'EVALUATE', 'DEFINE', 'MEASURE', 'VAR', 'RETURN', 'ORDER BY', 'ASC', 'DESC',
  'CALCULATE', 'CALCULATETABLE', 'FILTER', 'ALL', 'ALLEXCEPT', 'ALLSELECTED',
  'ALLNOBLANKROW', 'ALLCROSSFILTERED', 'VALUES', 'DISTINCT', 'DISTINCTCOUNT',
  'SUMMARIZE', 'SUMMARIZECOLUMNS', 'ADDCOLUMNS', 'SELECTCOLUMNS',
  'TOPN', 'GENERATE', 'GENERATEALL', 'GENERATESERIES',
  'CROSSJOIN', 'NATURALINNERJOIN', 'NATURALLEFTOUTERJOIN',
  'UNION', 'INTERSECT', 'EXCEPT', 'DATATABLE', 'ROW',
  'SUMX', 'AVERAGEX', 'MINX', 'MAXX', 'COUNTX', 'COUNTAX', 'RANKX', 'PRODUCTX',
  'CONCATENATEX', 'PERCENTILEX.INC', 'PERCENTILEX.EXC', 'MEDIANX',
  'SUM', 'AVERAGE', 'MIN', 'MAX', 'COUNT', 'COUNTA', 'COUNTBLANK', 'COUNTROWS',
  'DIVIDE', 'BLANK', 'ERROR', 'TRUE', 'FALSE', 'NOT',
  'IF', 'IF.EAGER', 'SWITCH', 'IFERROR', 'ISBLANK', 'ISINSCOPE',
  'AND', 'OR', 'IN', 'NOT',
  'RELATED', 'RELATEDTABLE', 'LOOKUPVALUE', 'USERELATIONSHIP', 'CROSSFILTER',
  'TREATAS', 'KEEPFILTERS', 'REMOVEFILTERS',
  'EARLIER', 'EARLIEST',
  'DATE', 'YEAR', 'MONTH', 'DAY', 'HOUR', 'MINUTE', 'SECOND',
  'TODAY', 'NOW', 'CALENDAR', 'CALENDARAUTO',
  'DATESYTD', 'DATESMTD', 'DATESQTD',
  'TOTALYTD', 'TOTALMTD', 'TOTALQTD',
  'SAMEPERIODLASTYEAR', 'PREVIOUSMONTH', 'PREVIOUSQUARTER', 'PREVIOUSYEAR',
  'NEXTMONTH', 'NEXTQUARTER', 'NEXTYEAR', 'NEXTDAY',
  'DATEADD', 'DATESBETWEEN', 'DATESINPERIOD', 'PARALLELPERIOD',
  'FIRSTDATE', 'LASTDATE', 'FIRSTNONBLANK', 'LASTNONBLANK',
  'STARTOFMONTH', 'STARTOFQUARTER', 'STARTOFYEAR',
  'ENDOFMONTH', 'ENDOFQUARTER', 'ENDOFYEAR',
  'CLOSINGBALANCEMONTH', 'CLOSINGBALANCEQUARTER', 'CLOSINGBALANCEYEAR',
  'OPENINGBALANCEMONTH', 'OPENINGBALANCEQUARTER', 'OPENINGBALANCEYEAR',
  'FORMAT', 'CONCATENATE', 'LEFT', 'RIGHT', 'MID', 'LEN', 'FIND', 'SEARCH',
  'REPLACE', 'SUBSTITUTE', 'TRIM', 'UPPER', 'LOWER', 'EXACT', 'FIXED',
  'REPT', 'UNICHAR', 'UNICODE', 'COMBINEVALUES', 'CONTAINSSTRING',
  'CONTAINSSTRINGEXACT', 'PATHCONTAINS',
  'HASONEFILTER', 'HASONEVALUE', 'ISFILTERED', 'ISCROSSFILTERED',
  'SELECTEDVALUE', 'USERCULTURE', 'USERNAME', 'USERPRINCIPALNAME',
  'CONTAINS', 'CONTAINSROW',
  'POWER', 'SQRT', 'ABS', 'MOD', 'INT', 'ROUND', 'ROUNDUP', 'ROUNDDOWN',
  'CEILING', 'FLOOR', 'SIGN', 'LOG', 'LOG10', 'LN', 'EXP', 'FACT',
  'RAND', 'RANDBETWEEN', 'PI',
  'TABLE', 'COLUMN',
]

const M_KEYWORDS = [
  'let', 'in', 'if', 'then', 'else', 'each', 'error', 'try', 'otherwise',
  'true', 'false', 'null', 'not', 'and', 'or', 'type', 'is', 'as',
  'section', 'shared', 'meta', 'optional', 'nullable',
  '#shared', '#sections', '#date', '#time', '#datetime', '#datetimezone', '#duration',
  'Text.From', 'Number.From', 'Date.From', 'DateTime.From',
  'Table.FromRows', 'Table.FromRecords', 'Table.FromColumns',
  'Table.AddColumn', 'Table.SelectRows', 'Table.TransformColumns',
  'Table.RemoveColumns', 'Table.RenameColumns', 'Table.ExpandRecordColumn',
  'Table.ExpandTableColumn', 'Table.Group', 'Table.Join', 'Table.Combine',
  'Table.Sort', 'Table.Distinct', 'Table.Buffer', 'Table.RowCount',
  'Table.FirstN', 'Table.LastN', 'Table.Skip', 'Table.SelectColumns',
  'List.Generate', 'List.Transform', 'List.Select', 'List.Accumulate',
  'List.Combine', 'List.Distinct', 'List.Sort', 'List.Buffer',
  'Record.Field', 'Record.FieldValues', 'Record.FromTable',
  'Web.Contents', 'Web.Page', 'Json.Document', 'Csv.Document',
  'Excel.Workbook', 'Sql.Database', 'OData.Feed',
  'Lines.FromBinary', 'Binary.FromText',
  'Expression.Evaluate', 'Value.ReplaceType',
]

// ---------------------------------------------------------------------------
// Sample code
// ---------------------------------------------------------------------------

const DAX_SAMPLES: Record<string, string> = {
  'Complex CALCULATE': `Sales Amount = CALCULATE(SUM(Sales[Amount]),FILTER(ALL(Products),Products[Category]="Electronics"),DATESINPERIOD(Calendar[Date],MAX(Calendar[Date]),-12,MONTH))`,
  'Time Intelligence': `YoY Growth % = VAR CurrentYear = TOTALYTD(SUM(Sales[Revenue]),Calendar[Date]) VAR PreviousYear = CALCULATE(TOTALYTD(SUM(Sales[Revenue]),Calendar[Date]),SAMEPERIODLASTYEAR(Calendar[Date])) RETURN DIVIDE(CurrentYear - PreviousYear,PreviousYear,BLANK())`,
  'SWITCH pattern': `Category Label = SWITCH(TRUE(),Products[Price]>1000,"Premium",Products[Price]>500,"Mid-Range",Products[Price]>100,"Standard","Budget")`,
  'Iterator pattern': `Weighted Avg Price = SUMX(Products,Products[Price]*DIVIDE(Products[Quantity],CALCULATE(SUM(Products[Quantity]),ALL(Products))))`,
}

const M_SAMPLES: Record<string, string> = {
  'API call': `let Source = Json.Document(Web.Contents("https://api.example.com/data", [Headers=[Authorization="Bearer token123", Accept="application/json"]])), Data = Source[results], AsTable = Table.FromRecords(Data), TypedCols = Table.TransformColumnTypes(AsTable, {{"id", Int64.Type}, {"name", type text}, {"date", type date}}) in TypedCols`,
  'Custom function': `let FormatName = (firstName as text, lastName as text, optional title as text) => let FullName = if title <> null then title & " " & firstName & " " & lastName else firstName & " " & lastName in Text.Trim(FullName), Source = Table.AddColumn(Employees, "DisplayName", each FormatName([FirstName], [LastName], [Title])) in Source`,
  'Date table': `let StartDate = #date(2020, 1, 1), EndDate = #date(2025, 12, 31), DayCount = Duration.Days(EndDate - StartDate) + 1, DateList = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)), AsTable = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}, null, ExtraValues.Error), Typed = Table.TransformColumnTypes(AsTable, {{"Date", type date}}), AddYear = Table.AddColumn(Typed, "Year", each Date.Year([Date]), Int64.Type), AddMonth = Table.AddColumn(AddYear, "Month", each Date.Month([Date]), Int64.Type), AddMonthName = Table.AddColumn(AddMonth, "MonthName", each Date.MonthName([Date]), type text) in AddMonthName`,
}

// ---------------------------------------------------------------------------
// Formatting engines
// ---------------------------------------------------------------------------

/** Extract string literals, replacing them with placeholders */
function extractStrings(code: string): { cleaned: string; strings: string[] } {
  const strings: string[] = []
  const cleaned = code.replace(/"([^"]*(?:""[^"]*)*)"/g, (match) => {
    strings.push(match)
    return `__STR${strings.length - 1}__`
  })
  return { cleaned, strings }
}

/** Re-insert string literals */
function restoreStrings(code: string, strings: string[]): string {
  return code.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)])
}

/** Uppercase DAX keywords in text (word-boundary aware) */
function uppercaseDaxKeywords(code: string): string {
  // Sort keywords by length descending so longer matches win
  const sorted = [...DAX_KEYWORDS].sort((a, b) => b.length - a.length)
  let result = code
  for (const kw of sorted) {
    // Use word boundary for simple keywords; for multi-word like "ORDER BY" use raw match
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`\\b${escaped}\\b`, 'gi')
    result = result.replace(re, kw)
  }
  return result
}

function formatDax(input: string, opts: FormatterOptions): string {
  if (!input.trim()) return ''

  const { cleaned, strings } = extractStrings(input)

  // Normalise whitespace to single spaces
  let code = cleaned.replace(/\s+/g, ' ').trim()

  // Uppercase keywords
  if (opts.uppercaseKeywords) {
    code = uppercaseDaxKeywords(code)
  }

  // Determine indent string
  const indent = opts.indentStyle === 'tab' ? '\t' : ' '.repeat(Number(opts.indentStyle))

  // Tokenise keeping parens, commas, operators, and words together
  const tokens: string[] = []
  let i = 0
  while (i < code.length) {
    if (code[i] === ' ') { i++; continue }

    // Placeholder
    if (code.substring(i, i + 5) === '__STR') {
      const end = code.indexOf('__', i + 5) + 2
      tokens.push(code.substring(i, end))
      i = end
      continue
    }

    // Operators: >=, <=, <>, &&, ||, ==
    if ('>=<=<>&&||=='.includes(code.substring(i, i + 2)) && i + 1 < code.length) {
      const two = code.substring(i, i + 2)
      if (['>=', '<=', '<>', '&&', '||', '=='].includes(two)) {
        tokens.push(two)
        i += 2
        continue
      }
    }

    // Single char tokens
    if ('(){}[],=+-*/<>&|'.includes(code[i])) {
      tokens.push(code[i])
      i++
      continue
    }

    // Word / identifier (including dots, brackets for table refs)
    let word = ''
    while (i < code.length && code[i] !== ' ' && !'(){}[],=+-*/<>&|'.includes(code[i])) {
      // Handle square brackets as part of identifier
      if (code[i] === '[') {
        const closeBracket = code.indexOf(']', i)
        if (closeBracket !== -1) {
          word += code.substring(i, closeBracket + 1)
          i = closeBracket + 1
          continue
        }
      }
      word += code[i]
      i++
    }
    if (word) tokens.push(word)
  }

  // Build formatted output
  const lines: string[] = []
  let currentLine = ''
  let depth = 0
  const isVarReturn = (t: string) => ['VAR', 'RETURN'].includes(t.toUpperCase())
  const isOperator = (t: string) => ['+', '-', '*', '/', '=', '<', '>', '>=', '<=', '<>', '&&', '||', '=='].includes(t)

  const pushLine = (line: string) => {
    if (opts.compact && line.trim() === '') return
    lines.push(line)
  }

  const indentStr = (d: number) => indent.repeat(Math.max(0, d))

  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti]
    const nextT = ti + 1 < tokens.length ? tokens[ti + 1] : ''

    if (t === '(') {
      currentLine += '('
      depth++
      // Start new line after opening paren (unless compact)
      if (!opts.compact) {
        pushLine(currentLine)
        currentLine = indentStr(depth)
      }
    } else if (t === ')') {
      depth--
      if (!opts.compact) {
        if (currentLine.trim()) pushLine(currentLine)
        currentLine = indentStr(depth) + ')'
      } else {
        currentLine += ')'
      }
    } else if (t === ',') {
      currentLine += ','
      if (!opts.compact) {
        pushLine(currentLine)
        currentLine = indentStr(depth)
      } else {
        currentLine += ' '
      }
    } else if (isVarReturn(t)) {
      // VAR / RETURN always start a new line
      if (currentLine.trim()) pushLine(currentLine)
      const varDepth = t.toUpperCase() === 'RETURN' ? Math.max(0, depth) : depth
      currentLine = indentStr(varDepth) + t
      if (nextT && nextT !== '(' && nextT !== ')') currentLine += ' '
    } else if (isOperator(t)) {
      currentLine += ` ${t} `
    } else {
      // Normal token
      if (currentLine.length > 0 && !currentLine.endsWith('(') && !currentLine.endsWith('\t') && currentLine !== indentStr(depth)) {
        // Avoid double space
        if (!currentLine.endsWith(' ')) currentLine += ' '
      }
      currentLine += t
    }

  }

  if (currentLine.trim()) pushLine(currentLine)

  let result = lines.join('\n')

  // Apply max line length (simple: don't break, just warn — real formatters do complex line breaking)
  // For now we leave it as-is since forcing breaks on DAX would be complex

  result = restoreStrings(result, strings)
  return result
}

function formatM(input: string, opts: FormatterOptions): string {
  if (!input.trim()) return ''

  const { cleaned, strings } = extractStrings(input)

  let code = cleaned.replace(/\s+/g, ' ').trim()

  const indent = opts.indentStyle === 'tab' ? '\t' : ' '.repeat(Number(opts.indentStyle))

  // Tokenise
  const tokens: string[] = []
  let i = 0
  while (i < code.length) {
    if (code[i] === ' ') { i++; continue }

    // Placeholder
    if (code.substring(i, i + 5) === '__STR') {
      const end = code.indexOf('__', i + 5) + 2
      tokens.push(code.substring(i, end))
      i = end
      continue
    }

    // Operators =>
    if (code.substring(i, i + 2) === '=>') {
      tokens.push('=>')
      i += 2
      continue
    }
    if (code.substring(i, i + 2) === '<>') {
      tokens.push('<>')
      i += 2
      continue
    }

    // Single char tokens
    if ('(){}[],=+-*/<>&|'.includes(code[i])) {
      tokens.push(code[i])
      i++
      continue
    }

    // Word / dotted identifier
    let word = ''
    while (i < code.length && code[i] !== ' ' && !'(){}[],=+-*/<>&|'.includes(code[i])) {
      if (code[i] === '[') {
        const cb = code.indexOf(']', i)
        if (cb !== -1) { word += code.substring(i, cb + 1); i = cb + 1; continue }
      }
      word += code[i]
      i++
    }
    if (word) tokens.push(word)
  }

  const lines: string[] = []
  let currentLine = ''
  let depth = 0
  const indentStr = (d: number) => indent.repeat(Math.max(0, d))
  const isOperator = (t: string) => ['+', '-', '*', '/', '=', '<', '>', '<>', '=>', '&'].includes(t)
  const pushLine = (line: string) => {
    if (opts.compact && line.trim() === '') return
    lines.push(line)
  }

  for (let ti = 0; ti < tokens.length; ti++) {
    const t = tokens[ti]

    if (t.toLowerCase() === 'let') {
      if (currentLine.trim()) pushLine(currentLine)
      currentLine = indentStr(depth) + 'let'
      pushLine(currentLine)
      depth++
      currentLine = indentStr(depth)
    } else if (t.toLowerCase() === 'in') {
      if (currentLine.trim()) pushLine(currentLine)
      depth = Math.max(0, depth - 1)
      currentLine = indentStr(depth) + 'in'
      pushLine(currentLine)
      depth++
      currentLine = indentStr(depth)
    } else if (t === '(') {
      currentLine += '('
      depth++
      if (!opts.compact) {
        pushLine(currentLine)
        currentLine = indentStr(depth)
      }
    } else if (t === ')') {
      depth = Math.max(0, depth - 1)
      if (!opts.compact) {
        if (currentLine.trim()) pushLine(currentLine)
        currentLine = indentStr(depth) + ')'
      } else {
        currentLine += ')'
      }
    } else if (t === '{') {
      currentLine += '{'
      depth++
      if (!opts.compact) {
        pushLine(currentLine)
        currentLine = indentStr(depth)
      }
    } else if (t === '}') {
      depth = Math.max(0, depth - 1)
      if (!opts.compact) {
        if (currentLine.trim()) pushLine(currentLine)
        currentLine = indentStr(depth) + '}'
      } else {
        currentLine += '}'
      }
    } else if (t === ',') {
      currentLine += ','
      if (!opts.compact) {
        pushLine(currentLine)
        currentLine = indentStr(depth)
      } else {
        currentLine += ' '
      }
    } else if (isOperator(t)) {
      currentLine += ` ${t} `
    } else {
      if (currentLine.length > 0 && !currentLine.endsWith('(') && !currentLine.endsWith('{') && !currentLine.endsWith('\t') && currentLine !== indentStr(depth)) {
        if (!currentLine.endsWith(' ')) currentLine += ' '
      }
      currentLine += t
    }
  }

  if (currentLine.trim()) pushLine(currentLine)

  let result = lines.join('\n')
  result = restoreStrings(result, strings)
  return result
}

// ---------------------------------------------------------------------------
// Syntax highlight (simple token colouring)
// ---------------------------------------------------------------------------

function highlightDax(code: string) {
  return code.split('\n').map((line, li) => {
    const parts: React.ReactElement[] = []
    // Regex-based highlight
    const regex = /("(?:[^"]*(?:""[^"]*)*)"|'[^']*'|\b\d+(?:\.\d+)?\b|--[^\n]*|\b[A-Z][A-Z._]+\b|\[([^\]]*)\])/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`${li}-${lastIndex}`} className="text-pbi-text">{line.substring(lastIndex, match.index)}</span>)
      }
      const m = match[0]
      let cls = 'text-pbi-text'
      if (m.startsWith('"') || m.startsWith("'")) cls = 'text-success'
      else if (m.startsWith('--')) cls = 'text-pbi-muted italic'
      else if (m.startsWith('[')) cls = 'text-info'
      else if (/^\d/.test(m)) cls = 'text-warning'
      else if (DAX_KEYWORDS.includes(m)) cls = 'text-primary font-bold'
      parts.push(<span key={`${li}-${match.index}`} className={cls}>{m}</span>)
      lastIndex = match.index + m.length
    }
    if (lastIndex < line.length) {
      parts.push(<span key={`${li}-end`} className="text-pbi-text">{line.substring(lastIndex)}</span>)
    }
    return <div key={li} className="flex"><span className="select-none text-pbi-muted/50 w-8 text-right mr-4 shrink-0">{li + 1}</span><span className="whitespace-pre">{parts}</span></div>
  })
}

function highlightM(code: string) {
  const kwSet = new Set(M_KEYWORDS.map(k => k.toLowerCase()))
  return code.split('\n').map((line, li) => {
    const parts: React.ReactElement[] = []
    const regex = /("(?:[^"]*(?:""[^"]*)*)"|\/\/[^\n]*|\b\d+(?:\.\d+)?\b|#\w+|[A-Za-z_][\w.]*(?:\.\w+)*|\[([^\]]*)\])/g
    let lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={`${li}-${lastIndex}`} className="text-pbi-text">{line.substring(lastIndex, match.index)}</span>)
      }
      const m = match[0]
      let cls = 'text-pbi-text'
      if (m.startsWith('"')) cls = 'text-success'
      else if (m.startsWith('//')) cls = 'text-pbi-muted italic'
      else if (m.startsWith('#')) cls = 'text-danger'
      else if (m.startsWith('[')) cls = 'text-info'
      else if (/^\d/.test(m)) cls = 'text-warning'
      else if (kwSet.has(m.toLowerCase())) cls = 'text-primary font-bold'
      else if (m.includes('.') && /^[A-Z]/.test(m)) cls = 'text-fabric-light'
      parts.push(<span key={`${li}-${match.index}`} className={cls}>{m}</span>)
      lastIndex = match.index + m.length
    }
    if (lastIndex < line.length) {
      parts.push(<span key={`${li}-end`} className="text-pbi-text">{line.substring(lastIndex)}</span>)
    }
    return <div key={li} className="flex"><span className="select-none text-pbi-muted/50 w-8 text-right mr-4 shrink-0">{li + 1}</span><span className="whitespace-pre">{parts}</span></div>
  })
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DaxFormatter() {
  const [language, setLanguage] = useState<Language>('dax')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [stats, setStats] = useState<FormatStats | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [isFormatting, setIsFormatting] = useState(false)
  const [options, setOptions] = useState<FormatterOptions>({
    indentStyle: '4',
    uppercaseKeywords: true,
    maxLineLength: 120,
    compact: false,
  })
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const samples = language === 'dax' ? DAX_SAMPLES : M_SAMPLES

  const handleFormat = useCallback(() => {
    if (!input.trim()) return
    setIsFormatting(true)

    // Slight delay for animation feel
    setTimeout(() => {
      const start = performance.now()
      const formatted = language === 'dax' ? formatDax(input, options) : formatM(input, options)
      const elapsed = performance.now() - start

      setOutput(formatted)
      setStats({
        linesBefore: input.split('\n').length,
        linesAfter: formatted.split('\n').length,
        charsBefore: input.length,
        charsAfter: formatted.length,
        timeMs: Math.round(elapsed * 100) / 100,
      })
      setIsFormatting(false)
    }, 300)
  }, [input, language, options])

  const handleCopy = useCallback(async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const handleLoadSample = useCallback((key: string) => {
    const sample = samples[key]
    if (sample) {
      setInput(sample)
      setOutput('')
      setStats(null)
    }
  }, [samples])

  const handleClear = useCallback(() => {
    setInput('')
    setOutput('')
    setStats(null)
  }, [])

  const inputLineNumbers = useMemo(() => {
    const count = input ? input.split('\n').length : 1
    return Array.from({ length: count }, (_, i) => i + 1)
  }, [input])

  const highlightedOutput = useMemo(() => {
    if (!output) return null
    return language === 'dax' ? highlightDax(output) : highlightM(output)
  }, [output, language])

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto pt-10 md:pt-12 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
            <Code2 className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">Formateur DAX & M</h1>
            <p className="text-pbi-muted text-sm mt-0.5">Formatez et embellissez votre code Power BI</p>
          </div>
        </div>

        {/* Language toggle */}
        <div className="flex items-center gap-2 bg-pbi-card rounded-xl p-1 border border-pbi-border">
          <button
            onClick={() => { setLanguage('dax'); setOutput(''); setStats(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              language === 'dax'
                ? 'bg-primary text-pbi-darker shadow-lg'
                : 'text-pbi-muted hover:text-pbi-text'
            }`}
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              DAX
            </span>
          </button>
          <button
            onClick={() => { setLanguage('m'); setOutput(''); setStats(null) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              language === 'm'
                ? 'bg-fabric text-white shadow-lg'
                : 'text-pbi-muted hover:text-pbi-text'
            }`}
          >
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Power Query M
            </span>
          </button>
        </div>
      </motion.div>

      {/* Sample buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4"
      >
        <span className="text-pbi-muted text-xs self-center mr-1">Exemples :</span>
        {Object.keys(samples).map((key) => (
          <button
            key={key}
            onClick={() => handleLoadSample(key)}
            className="px-3 py-1.5 text-xs rounded-lg bg-pbi-card border border-pbi-border text-pbi-muted hover:text-primary hover:border-primary/40 transition-all"
          >
            {key}
          </button>
        ))}
      </motion.div>

      {/* Options panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-pbi-muted hover:text-pbi-text transition-colors"
        >
          <Settings2 className="w-4 h-4" />
          Options
          <motion.div animate={{ rotate: showOptions ? 180 : 0 }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 p-4 rounded-xl bg-pbi-card border border-pbi-border">
                {/* Indent size */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-pbi-muted flex items-center gap-1">
                    <ArrowRightLeft className="w-3 h-3" /> Indentation
                  </label>
                  <div className="flex gap-1">
                    {(['2', '4', 'tab'] as IndentStyle[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setOptions({ ...options, indentStyle: s })}
                        className={`px-3 py-1 text-xs rounded-md border transition-all ${
                          options.indentStyle === s
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'border-pbi-border text-pbi-muted hover:border-pbi-muted'
                        }`}
                      >
                        {s === 'tab' ? 'Tab' : `${s} esp.`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Uppercase keywords */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-pbi-muted flex items-center gap-1">
                    <Type className="w-3 h-3" /> Mots-cles
                  </label>
                  <button
                    onClick={() => setOptions({ ...options, uppercaseKeywords: !options.uppercaseKeywords })}
                    className={`px-3 py-1 text-xs rounded-md border transition-all ${
                      options.uppercaseKeywords
                        ? 'bg-primary/20 border-primary/50 text-primary'
                        : 'border-pbi-border text-pbi-muted hover:border-pbi-muted'
                    }`}
                  >
                    {options.uppercaseKeywords ? 'MAJUSCULES' : 'minuscules'}
                  </button>
                </div>

                {/* Max line length */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-pbi-muted flex items-center gap-1">
                    <Hash className="w-3 h-3" /> Longueur max
                  </label>
                  <div className="flex gap-1">
                    {([80, 120, 0] as const).map((l) => (
                      <button
                        key={l}
                        onClick={() => setOptions({ ...options, maxLineLength: l })}
                        className={`px-3 py-1 text-xs rounded-md border transition-all ${
                          options.maxLineLength === l
                            ? 'bg-primary/20 border-primary/50 text-primary'
                            : 'border-pbi-border text-pbi-muted hover:border-pbi-muted'
                        }`}
                      >
                        {l === 0 ? 'Illimite' : l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact mode */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-pbi-muted flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Mode compact
                  </label>
                  <button
                    onClick={() => setOptions({ ...options, compact: !options.compact })}
                    className={`px-3 py-1 text-xs rounded-md border transition-all ${
                      options.compact
                        ? 'bg-warning/20 border-warning/50 text-warning'
                        : 'border-pbi-border text-pbi-muted hover:border-pbi-muted'
                    }`}
                  >
                    {options.compact ? 'Actif' : 'Inactif'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main editor area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-0 lg:gap-0 mb-4"
      >
        {/* Input panel */}
        <div className="glass-card overflow-hidden rounded-xl lg:rounded-r-none">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-pbi-border bg-white/80">
            <span className="text-xs font-medium text-pbi-muted uppercase tracking-wider">Entree</span>
            <button
              onClick={handleClear}
              className="text-pbi-muted hover:text-danger transition-colors p-1"
              title="Effacer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="relative">
            {/* Line numbers gutter */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gray-100 border-r border-pbi-border/30 select-none overflow-hidden pointer-events-none">
              <div className="py-4 px-1 text-right">
                {inputLineNumbers.map((n) => (
                  <div key={n} className="text-[11px] leading-[1.6] text-pbi-muted/40 pr-1">{n}</div>
                ))}
              </div>
            </div>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={language === 'dax'
                ? 'Collez votre code DAX ici...\n\nEx: CALCULATE(SUM(Sales[Amount]), FILTER(...))'
                : 'Collez votre code M (Power Query) ici...\n\nEx: let Source = ... in Source'
              }
              className="w-full min-h-[400px] bg-transparent text-pbi-text font-mono text-sm leading-[1.6] p-4 pl-14 resize-y focus:outline-none placeholder:text-pbi-muted/30"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Format button (center column) */}
        <div className="flex lg:flex-col items-center justify-center py-3 lg:py-0 lg:px-3 gap-2">
          <motion.button
            onClick={handleFormat}
            disabled={!input.trim() || isFormatting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-xl font-medium transition-all ${
              input.trim()
                ? 'bg-primary text-pbi-darker shadow-lg shadow-primary/20 hover:shadow-primary/40'
                : 'bg-pbi-card text-pbi-muted border border-pbi-border cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              {isFormatting ? (
                <motion.div
                  key="spin"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  className="animate-spin"
                >
                  <Sparkles className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="play"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Play className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
          <span className="text-[10px] text-pbi-muted text-center hidden lg:block">Formater</span>
        </div>

        {/* Output panel */}
        <div className="glass-card overflow-hidden rounded-xl lg:rounded-l-none">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-pbi-border bg-white/80">
            <span className="text-xs font-medium text-pbi-muted uppercase tracking-wider">Sortie</span>
            <motion.button
              onClick={handleCopy}
              disabled={!output}
              whileTap={{ scale: 0.9 }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all ${
                output
                  ? copied
                    ? 'bg-success/20 text-success'
                    : 'bg-pbi-card-hover text-pbi-muted hover:text-pbi-text border border-pbi-border'
                  : 'text-pbi-muted/30 cursor-not-allowed'
              }`}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" /> Copie!
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copier
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
          <div className="min-h-[400px] p-4 font-mono text-sm leading-[1.6] overflow-auto">
            {highlightedOutput ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {highlightedOutput}
              </motion.div>
            ) : (
              <p className="text-pbi-muted/30 italic">Le code formate apparaitra ici...</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <AnimatePresence>
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Lignes', before: stats.linesBefore, after: stats.linesAfter, icon: Hash },
                { label: 'Caracteres', before: stats.charsBefore, after: stats.charsAfter, icon: Type },
              ].map(({ label, before, after, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-pbi-card border border-pbi-border"
                >
                  <Icon className="w-4 h-4 text-pbi-muted" />
                  <span className="text-xs text-pbi-muted">{label}</span>
                  <span className="text-sm text-pbi-text font-mono">{before}</span>
                  <span className="text-pbi-muted">→</span>
                  <span className={`text-sm font-mono font-medium ${
                    after > before ? 'text-info' : after < before ? 'text-success' : 'text-pbi-text'
                  }`}>
                    {after}
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-pbi-card border border-pbi-border">
                <Zap className="w-4 h-4 text-warning" />
                <span className="text-xs text-pbi-muted">Temps</span>
                <span className="text-sm text-warning font-mono font-medium">{stats.timeMs}ms</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
