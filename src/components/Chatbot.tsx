import { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  ExternalLink,
  Code2,
  BookOpen,
  Network,
  Server,
  CreditCard,
  Zap,
} from 'lucide-react'

import { daxFunctions } from '../data/daxReference'
import { techCards } from '../data/techCards'
import { architecturePatterns } from '../data/architecturePatterns'
import { fabricCapacities } from '../data/fabricCapacities'
import { licenses } from '../data/licenses'
import { performanceChecklist } from '../data/performanceChecklist'

// ─── Types ────────────────────────────────────────────────────────

interface ChatMessage {
  id: string
  role: 'user' | 'bot'
  text: string
  cards?: ResultCard[]
  links?: PageLink[]
  timestamp: Date
}

interface ResultCard {
  type: 'dax' | 'techcard' | 'architecture' | 'capacity' | 'license' | 'checklist'
  title: string
  subtitle?: string
  body: string
  extra?: string
}

interface PageLink {
  label: string
  path: string
}

// ─── French stop words ────────────────────────────────────────────

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'est', 'et', 'en',
  'pour', 'avec', 'dans', 'sur', 'que', 'qui', 'quoi', 'comment', 'quel',
  'quelle', 'quels', 'quelles', 'ce', 'cette', 'ces', 'il', 'elle', 'on',
  'nous', 'vous', 'ils', 'elles', 'au', 'aux', 'se', 'son', 'sa', 'ses',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'ne', 'pas', 'plus', 'aussi',
  'je', 'tu', 'me', 'te', 'si', 'ou', 'mais', 'donc', 'car', 'ni',
  'par', 'entre', 'chez', 'vers', 'sans', 'sous', 'tout', 'tous', 'toute',
  'toutes', 'bien', 'tres', 'trop', 'peu', 'assez', 'encore', 'deja',
  'fait', 'faire', 'avoir', 'etre', 'peut', 'faut', 'dois', 'doit',
])

// ─── Helpers ──────────────────────────────────────────────────────

function extractKeywords(query: string): string[] {
  return query
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOP_WORDS.has(w))
}

function fuzzyMatch(text: string, keyword: string): boolean {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return norm.includes(keyword)
}

function scoreText(fields: string[], keywords: string[]): number {
  let score = 0
  const joined = fields.join(' ')
  for (const kw of keywords) {
    if (fuzzyMatch(joined, kw)) score++
    // Bonus for exact word match in title/name
    if (fuzzyMatch(fields[0] ?? '', kw)) score += 2
  }
  return score
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// ─── Search engine ────────────────────────────────────────────────

interface ScoredResult {
  score: number
  card: ResultCard
}

function searchAll(keywords: string[]): ScoredResult[] {
  const results: ScoredResult[] = []

  // DAX functions
  for (const fn of daxFunctions) {
    const s = scoreText(
      [fn.name, fn.category, fn.description, fn.syntax, fn.example, fn.tip],
      keywords,
    )
    if (s > 0) {
      results.push({
        score: s,
        card: {
          type: 'dax',
          title: fn.name,
          subtitle: `${fn.category} - ${fn.complexity}`,
          body: fn.description,
          extra: fn.syntax,
        },
      })
    }
  }

  // Tech cards
  for (const tc of techCards) {
    const s = scoreText(
      [tc.title, tc.category, tc.summary, ...tc.keyPoints, ...tc.bestPractices],
      keywords,
    )
    if (s > 0) {
      results.push({
        score: s,
        card: {
          type: 'techcard',
          title: tc.title,
          subtitle: tc.category,
          body: tc.summary.slice(0, 200) + (tc.summary.length > 200 ? '...' : ''),
        },
      })
    }
  }

  // Architecture patterns
  for (const ap of architecturePatterns) {
    const s = scoreText(
      [ap.name, ap.description, ...ap.useCases, ...ap.pros, ...ap.fabricServices],
      keywords,
    )
    if (s > 0) {
      results.push({
        score: s,
        card: {
          type: 'architecture',
          title: ap.name,
          subtitle: `Complexite: ${ap.complexity}`,
          body: ap.description.slice(0, 200) + (ap.description.length > 200 ? '...' : ''),
        },
      })
    }
  }

  // Fabric capacities
  for (const fc of fabricCapacities) {
    const s = scoreText(
      [fc.sku, fc.bestFor, `${fc.monthlyPrice}`, `${fc.cuPerSecond}`],
      keywords,
    )
    if (s > 0) {
      results.push({
        score: s,
        card: {
          type: 'capacity',
          title: fc.sku,
          subtitle: `${fc.monthlyPrice} EUR/mois`,
          body: `${fc.cuPerSecond} CU/s | ${fc.maxMemoryGB} Go RAM | ${fc.sparkVCores} Spark vCores`,
          extra: fc.bestFor,
        },
      })
    }
  }

  // Licenses
  for (const lic of licenses) {
    const priceStr = lic.pricePerUserMonth !== null
      ? `${lic.pricePerUserMonth} EUR/user/mois`
      : `${lic.pricePerCapacityMonth} EUR/capacite/mois`
    const s = scoreText(
      [lic.name, lic.description, lic.bestFor, priceStr],
      keywords,
    )
    if (s > 0) {
      results.push({
        score: s,
        card: {
          type: 'license',
          title: lic.name,
          subtitle: priceStr,
          body: lic.description,
          extra: lic.bestFor,
        },
      })
    }
  }

  // Performance checklist
  for (const cat of performanceChecklist) {
    for (const item of cat.items) {
      const s = scoreText(
        [item.title, item.description, item.category, item.impact],
        keywords,
      )
      if (s > 0) {
        results.push({
          score: s,
          card: {
            type: 'checklist',
            title: item.title,
            subtitle: `Impact: ${item.impact} | Effort: ${item.effort}`,
            body: item.description.slice(0, 200) + (item.description.length > 200 ? '...' : ''),
          },
        })
      }
    }
  }

  results.sort((a, b) => b.score - a.score)
  return results.slice(0, 5)
}

// ─── Intent detection ─────────────────────────────────────────────

interface IntentResult {
  intro: string
  cards: ResultCard[]
  links: PageLink[]
}

function detectIntent(raw: string, keywords: string[]): IntentResult | null {
  const lower = raw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Price / cost intent
  if (/prix|cout|combien|tarif|budget/.test(lower)) {
    const results = searchAll(keywords)
    // Also always include capacity/license results
    const capResults = searchAll([...keywords, 'capacity', 'license'])
    const merged = [...results, ...capResults]
    const unique = merged.filter((r, i, arr) => arr.findIndex(x => x.card.title === r.card.title) === i)
    unique.sort((a, b) => b.score - a.score)
    return {
      intro: 'Voici les informations tarifaires que j\'ai trouvees :',
      cards: unique.slice(0, 5).map(r => r.card),
      links: [
        { label: 'Simulateur de capacites', path: '/simulator' },
        { label: 'Comparateur de licences', path: '/licenses' },
      ],
    }
  }

  // DAX function intent
  if (/dax/.test(lower)) {
    const daxKeywords = keywords.filter(k => k !== 'dax')
    const fnName = daxKeywords.find(k =>
      daxFunctions.some(f => f.name.toLowerCase() === k),
    )
    if (fnName) {
      const fn = daxFunctions.find(f => f.name.toLowerCase() === fnName)!
      return {
        intro: `Voici la fonction DAX **${fn.name}** :`,
        cards: [{
          type: 'dax',
          title: fn.name,
          subtitle: `${fn.category} - ${fn.complexity}`,
          body: fn.description,
          extra: `Syntaxe: ${fn.syntax}\nExemple: ${fn.example}\nTip: ${fn.tip}`,
        }],
        links: [{ label: 'Reference DAX complete', path: '/dax' }],
      }
    }
    const results = searchAll(keywords)
    return {
      intro: 'Voici les resultats DAX correspondants :',
      cards: results.map(r => r.card),
      links: [{ label: 'Reference DAX complete', path: '/dax' }],
    }
  }

  // Tech cards intent
  if (/fiche|technique/.test(lower)) {
    const results = searchAll(keywords)
    return {
      intro: 'Voici les fiches techniques pertinentes :',
      cards: results.map(r => r.card),
      links: [{ label: 'Toutes les fiches techniques', path: '/fiches' }],
    }
  }

  // Architecture intent
  if (/architecture|pattern|patron/.test(lower)) {
    const results = searchAll(keywords)
    return {
      intro: 'Voici les patterns d\'architecture correspondants :',
      cards: results.map(r => r.card),
      links: [{ label: 'Tous les patterns', path: '/architecture' }],
    }
  }

  // Performance intent
  if (/performance|optimis|perf|lent|rapide|slow/.test(lower)) {
    const results = searchAll(keywords)
    return {
      intro: 'Voici les recommandations de performance :',
      cards: results.map(r => r.card),
      links: [{ label: 'Checklist complete', path: '/performance' }],
    }
  }

  // License intent
  if (/licence|license|pro\b|ppu|premium|free/.test(lower)) {
    const results = searchAll(keywords)
    return {
      intro: 'Voici les informations sur les licences :',
      cards: results.map(r => r.card),
      links: [{ label: 'Comparateur de licences', path: '/licenses' }],
    }
  }

  // Formatter intent
  if (/formateur|formatter|indent/.test(lower)) {
    return {
      intro: 'Vous cherchez a formater du code DAX ? Utilisez notre formateur integre !',
      cards: [],
      links: [{ label: 'Formateur DAX', path: '/formatter' }],
    }
  }

  // Tools intent
  if (/outil|tool|telecharger|download/.test(lower)) {
    return {
      intro: 'Voici notre page d\'outils et telechargements :',
      cards: [],
      links: [{ label: 'Outils & Telechargements', path: '/tools' }],
    }
  }

  // What's new intent
  if (/nouveaute|update|mise a jour|whats new/.test(lower)) {
    return {
      intro: 'Decouvrez les dernieres nouveautes Power BI et Fabric :',
      cards: [],
      links: [{ label: 'Nouveautes', path: '/whatsnew' }],
    }
  }

  // Resources intent
  if (/ressource|youtube|blog|formation|apprendre|learn/.test(lower)) {
    return {
      intro: 'Voici nos ressources d\'apprentissage :',
      cards: [],
      links: [{ label: 'Ressources & Formations', path: '/resources' }],
    }
  }

  return null
}

// ─── Build response ───────────────────────────────────────────────

function buildResponse(query: string): Pick<ChatMessage, 'text' | 'cards' | 'links'> {
  const keywords = extractKeywords(query)

  if (keywords.length === 0) {
    return {
      text: 'Je n\'ai pas bien compris votre question. Pouvez-vous reformuler ou essayer avec des mots-cles specifiques (ex: "CALCULATE syntaxe", "licence Pro prix", "architecture Lakehouse") ?',
    }
  }

  // Try intent detection first
  const intent = detectIntent(query, keywords)
  if (intent && (intent.cards.length > 0 || intent.links.length > 0)) {
    return {
      text: intent.intro,
      cards: intent.cards.length > 0 ? intent.cards : undefined,
      links: intent.links.length > 0 ? intent.links : undefined,
    }
  }

  // Fallback to general search
  const results = searchAll(keywords)
  if (results.length > 0) {
    return {
      text: `J'ai trouve ${results.length} resultat${results.length > 1 ? 's' : ''} pour votre recherche :`,
      cards: results.map(r => r.card),
    }
  }

  return {
    text: 'Desole, je n\'ai rien trouve pour cette recherche. Essayez avec d\'autres termes, par exemple : "CALCULATE", "Star Schema", "licence Pro", "capacite F64", "performance DAX".',
  }
}

// ─── Suggested questions ──────────────────────────────────────────

const SUGGESTIONS = [
  'Quelle est la syntaxe de CALCULATE ?',
  'Combien coute une capacite F64 ?',
  'Quelles sont les best practices pour le Star Schema ?',
  'Quelle licence choisir pour 200 utilisateurs ?',
  'Comment optimiser les performances DAX ?',
  'Quel pattern d\'architecture pour du temps reel ?',
]

// ─── Card type config ─────────────────────────────────────────────

const CARD_CONFIG: Record<ResultCard['type'], { icon: typeof Code2; color: string; border: string }> = {
  dax: { icon: Code2, color: 'text-[#f2c811]', border: 'border-[#f2c811]/30' },
  techcard: { icon: BookOpen, color: 'text-[#3b82f6]', border: 'border-[#3b82f6]/30' },
  architecture: { icon: Network, color: 'text-[#10b981]', border: 'border-[#10b981]/30' },
  capacity: { icon: Server, color: 'text-[#0078d4]', border: 'border-[#0078d4]/30' },
  license: { icon: CreditCard, color: 'text-[#f59e0b]', border: 'border-[#f59e0b]/30' },
  checklist: { icon: Zap, color: 'text-[#ef4444]', border: 'border-[#ef4444]/30' },
}

// ─── Component ────────────────────────────────────────────────────

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  // Auto-scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  const handleSend = useCallback((text?: string) => {
    const query = (text ?? input).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text: query,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulated thinking delay
    const delay = 300 + Math.random() * 500
    setTimeout(() => {
      const response = buildResponse(query)
      const botMsg: ChatMessage = {
        id: uid(),
        role: 'bot',
        text: response.text,
        cards: response.cards,
        links: response.links,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, delay)
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleNavigate = (path: string) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#f2c811] text-[#1a1a2e] shadow-lg shadow-[#f2c811]/30 transition-shadow hover:shadow-xl hover:shadow-[#f2c811]/40"
            aria-label="Ouvrir le chatbot"
          >
            <MessageCircle className="h-6 w-6" />
            {/* Pulsing ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-[#f2c811]/30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 flex h-[min(600px,85vh)] w-[min(420px,92vw)] flex-col overflow-hidden rounded-2xl border border-[#2a3a5c] bg-[#0f0f1e] shadow-2xl shadow-black/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#2a3a5c] bg-[#16213e] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f2c811]/15">
                  <Bot className="h-4.5 w-4.5 text-[#f2c811]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#e2e8f0]">PBI Assistant</h3>
                  <p className="text-xs text-[#94a3b8]">Power BI & Fabric Expert</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#94a3b8] transition-colors hover:bg-[#1a2744] hover:text-[#e2e8f0]"
                aria-label="Fermer le chatbot"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#2a3a5c]">
              {messages.length === 0 && !isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center pt-4"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f2c811]/10 mb-3">
                    <Sparkles className="h-6 w-6 text-[#f2c811]" />
                  </div>
                  <p className="text-sm text-[#94a3b8] text-center mb-4">
                    Posez-moi une question sur Power BI, DAX, Fabric, les licences ou l'architecture !
                  </p>
                  <div className="w-full space-y-2">
                    {SUGGESTIONS.map((s, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => handleSend(s)}
                        className="w-full rounded-lg border border-[#2a3a5c] bg-[#16213e]/60 px-3 py-2 text-left text-xs text-[#e2e8f0] transition-all hover:border-[#f2c811]/40 hover:bg-[#1a2744]"
                      >
                        {s}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'rounded-br-md bg-[#f2c811] text-[#1a1a2e] font-medium'
                        : 'rounded-bl-md bg-[#16213e] text-[#e2e8f0] border border-[#2a3a5c]'
                    }`}
                  >
                    {/* Message text */}
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Result cards */}
                    {msg.cards && msg.cards.length > 0 && (
                      <div className="mt-2.5 space-y-2">
                        {msg.cards.map((card, ci) => {
                          const cfg = CARD_CONFIG[card.type]
                          const Icon = cfg.icon
                          return (
                            <motion.div
                              key={ci}
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: ci * 0.08 }}
                              className={`rounded-xl border ${cfg.border} bg-[#0f0f1e]/80 backdrop-blur-sm p-2.5`}
                            >
                              <div className="flex items-start gap-2">
                                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${cfg.color}`} />
                                <div className="min-w-0">
                                  <p className={`text-xs font-semibold ${cfg.color}`}>{card.title}</p>
                                  {card.subtitle && (
                                    <p className="text-[10px] text-[#94a3b8]">{card.subtitle}</p>
                                  )}
                                  <p className="mt-1 text-xs text-[#e2e8f0]/80 leading-relaxed">
                                    {card.body}
                                  </p>
                                  {card.extra && (
                                    <p className="mt-1 text-[10px] text-[#94a3b8] font-mono whitespace-pre-wrap">
                                      {card.extra}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    )}

                    {/* Page links */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {msg.links.map((link, li) => (
                          <button
                            key={li}
                            onClick={() => handleNavigate(link.path)}
                            className="inline-flex items-center gap-1 rounded-lg bg-[#f2c811]/15 px-2.5 py-1 text-[10px] font-semibold text-[#f2c811] transition-colors hover:bg-[#f2c811]/25"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl rounded-bl-md border border-[#2a3a5c] bg-[#16213e] px-4 py-3">
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map(i => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-[#94a3b8]"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.15,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-[#2a3a5c] bg-[#16213e] p-3">
              <div className="flex items-center gap-2 rounded-xl border border-[#2a3a5c] bg-[#0f0f1e] px-3 py-2 focus-within:border-[#f2c811]/50 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-transparent text-sm text-[#e2e8f0] placeholder-[#94a3b8] outline-none"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f2c811] text-[#1a1a2e] transition-all hover:bg-[#f2c811]/90 disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Envoyer"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
