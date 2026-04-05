import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Calculator,
  CreditCard,
  Code2,
  BookOpen,
  TrendingUp,
  Zap,
  Network,
  BarChart3,
  AlignLeft,
  Download,
  GraduationCap,
  Sparkles,
  Bot,
  Award,
  FileCode,
  GitBranch,
  Plug,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/simulator', label: 'Simulateur', icon: Calculator },
  { path: '/licenses', label: 'Licences', icon: CreditCard },
  { path: '/dax', label: 'DAX', icon: Code2 },
  { path: '/fiches', label: 'Fiches', icon: BookOpen },
  { path: '/roi', label: 'ROI', icon: TrendingUp },
  { path: '/performance', label: 'Perf', icon: Zap },
  { path: '/architecture', label: 'Archi', icon: Network },
  { path: '/formatter', label: 'Format', icon: AlignLeft },
  { path: '/tools', label: 'Outils', icon: Download },
  { path: '/resources', label: 'Ressources', icon: GraduationCap },
  { path: '/whatsnew', label: 'News', icon: Sparkles },
  { path: '/ai', label: 'IA', icon: Bot },
  { path: '/certifications', label: 'Certifs', icon: Award },
  { path: '/notebooks', label: 'Notebooks', icon: FileCode },
  { path: '/api', label: 'API', icon: Plug },
  { path: '/cicd', label: 'CI/CD', icon: GitBranch },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(false)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-pbi-darker">
      {/* Desktop Sidebar */}
      <motion.aside
        className="hidden md:flex fixed left-0 top-0 h-full z-50 flex-col"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        animate={{ width: expanded ? 240 : 72 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
          background: 'rgba(15, 15, 30, 0.85)',
          backdropFilter: 'blur(24px)',
          borderRight: '1px solid rgba(42, 58, 92, 0.4)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-pbi-border/40">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg gradient-text whitespace-nowrap"
              >
                PBI Hub
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors group"
              >
                {/* Active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: 'rgba(242, 200, 17, 0.1)',
                      border: '1px solid rgba(242, 200, 17, 0.2)',
                    }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-center w-7 h-7 shrink-0">
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive
                        ? 'text-primary'
                        : 'text-pbi-muted group-hover:text-pbi-text'
                    }`}
                  />
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className={`relative z-10 text-sm font-medium whitespace-nowrap ${
                        isActive ? 'text-primary' : 'text-pbi-muted group-hover:text-pbi-text'
                      }`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-pbi-border/40">
          <AnimatePresence>
            {expanded ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-pbi-muted text-center leading-relaxed"
              >
                Expert Power BI
                <br />& Fabric
              </motion.p>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="w-2 h-2 rounded-full bg-primary/50" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 md:ml-[72px] pb-20 md:pb-0">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile bottom navigation */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background: 'rgba(15, 15, 30, 0.92)',
          backdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(42, 58, 92, 0.4)',
        }}
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-active"
                  className="absolute inset-0 rounded-lg"
                  style={{
                    background: 'rgba(242, 200, 17, 0.1)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                className={`relative z-10 w-5 h-5 ${
                  isActive ? 'text-primary' : 'text-pbi-muted'
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium ${
                  isActive ? 'text-primary' : 'text-pbi-muted'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          )
        })}
      </nav>
    </div>
  )
}
