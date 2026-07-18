'use client'

import { Component, ReactNode } from 'react'
import * as Sentry from '@sentry/nextjs'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { errorInfo } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-6">
          <div className="max-w-sm text-center">
            <h2 className="text-xl font-bold text-[#141312] mb-2">
              Something went wrong
            </h2>
            <p className="text-[#6B6A66] mb-6">
              We&apos;ve logged the issue and we&apos;re looking into it. Try refreshing the page.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="bg-[#141312] text-[#FAF9F6] text-sm font-medium rounded-lg px-5 py-2.5"
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}