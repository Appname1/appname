'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { THEMES, getTheme, Theme } from '@/lib/themes'
import { createClient } from '@/lib/supabase'

interface ThemeContextValue {
  theme: Theme
  setTheme: (key: string) => Promise<void>
  randomMode: boolean
  setRandomMode: (value: boolean) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function applyThemeVars(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--paper', theme.paper)
  root.style.setProperty('--canvas', theme.canvas)
  root.style.setProperty('--ink', theme.ink)
  root.style.setProperty('--muted', theme.muted)
  root.style.setProperty('--border', theme.border)
  root.style.setProperty('--white', theme.white)
  root.style.setProperty('--tag-bg', theme.tagBg)
  root.style.setProperty('--on-ink', theme.onInk)
  root.style.setProperty('--accent', theme.accent)
  root.style.setProperty('--accent-dark', theme.accentDark)
  root.style.setProperty('--accent-bg', theme.accentBg)
  root.style.setProperty('--green', theme.green)
  root.style.setProperty('--green-dark', theme.greenDark)
  root.style.setProperty('--green-bg', theme.greenBg)
  root.style.setProperty('--green-border', theme.greenBorder)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeKey, setThemeKey] = useState('original')
  const [randomMode, setRandomModeState] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function loadTheme() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        applyThemeVars(getTheme('original'))
        setLoaded(true)
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('theme, theme_random_mode')
        .eq('id', user.id)
        .single()

      const savedRandomMode = profile?.theme_random_mode ?? false
      let activeKey = profile?.theme ?? 'original'

      if (savedRandomMode) {
        activeKey = THEMES[Math.floor(Math.random() * THEMES.length)].key
      }

      setThemeKey(activeKey)
      setRandomModeState(savedRandomMode)
      applyThemeVars(getTheme(activeKey))
      setLoaded(true)
    }

    loadTheme()
  }, [])

  const setTheme = async (key: string) => {
    setThemeKey(key)
    applyThemeVars(getTheme(key))

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ theme: key }).eq('id', user.id)
    }
  }

  const setRandomMode = async (value: boolean) => {
    setRandomModeState(value)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('users').update({ theme_random_mode: value }).eq('id', user.id)
    }
  }

  if (!loaded) return null

  return (
    <ThemeContext.Provider value={{ theme: getTheme(themeKey), setTheme, randomMode, setRandomMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}