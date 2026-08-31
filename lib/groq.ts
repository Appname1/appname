import Groq from 'groq-sdk'

// Collects GROQ_API_KEY, GROQ_API_KEY_2, GROQ_API_KEY_3, GROQ_API_KEY_4 — add more by
// adding GROQ_API_KEY_5 etc. and extending this array. Missing/empty keys are skipped.
const API_KEYS = [
  process.env.GROQ_API_KEY,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
  process.env.GROQ_API_KEY_4,
].filter((key): key is string => !!key && key.trim().length > 0)

if (API_KEYS.length === 0) {
  throw new Error('No GROQ_API_KEY configured')
}

interface GroqCallParams {
  model: string
  messages: { role: 'system' | 'user'; content: string }[]
  max_tokens: number
}

/**
 * Calls Groq, automatically retrying with the next available API key if the
 * current one is rate-limited (429). Throws the last error if all keys fail.
 */
export async function callGroqWithFallback(params: GroqCallParams) {
  let lastError: unknown = null

  for (let i = 0; i < API_KEYS.length; i++) {
    const client = new Groq({ apiKey: API_KEYS[i] })
    try {
      return await client.chat.completions.create(params)
    } catch (err) {
      lastError = err
      const status = (err as { status?: number })?.status
      if (status === 429 && i < API_KEYS.length - 1) {
        console.error(`[groq] Key ${i + 1}/${API_KEYS.length} rate-limited, trying next key`)
        continue
      }
      // Non-429 error, or we're out of keys — stop trying
      throw err
    }
  }

  throw lastError
}