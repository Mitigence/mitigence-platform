'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Lead {
  name: string
  company_role: string
  industry: string
  company_size: string
  challenge: string
  description: string
  intent: string
  email: string
  phone: string
  urgency: string
}

interface Message {
  id: string
  role: 'bot' | 'user'
  content: string
  timestamp: Date
}

type StepType = 'text' | 'email' | 'tel' | 'quickreply'

interface Step {
  id: number
  botMessage: string
  type: StepType
  options?: string[]
  placeholder?: string
  optional?: boolean
  field: keyof Lead
}

// ─── Conversation steps ───────────────────────────────────────────────────────

const steps: Step[] = [
  {
    id: 0,
    botMessage:
      "Hi there! 👋 I'm the Mitigence assistant. I'll help connect you with the right specialist for your security needs.\n\nFirst, what's your name?",
    type: 'text',
    placeholder: 'Your first name...',
    field: 'name',
  },
  {
    id: 1,
    botMessage:
      "Nice to meet you, {name}! What company are you with, and what's your role there?",
    type: 'text',
    placeholder: 'e.g. Acme Corp, Security Manager',
    field: 'company_role',
  },
  {
    id: 2,
    botMessage: 'Got it. What industry is {company} in?',
    type: 'quickreply',
    options: [
      'Financial Services',
      'Healthcare',
      'Technology',
      'Manufacturing',
      'Government',
      'Retail / E-commerce',
      'Other',
    ],
    field: 'industry',
  },
  {
    id: 3,
    botMessage: 'And roughly how large is the organization?',
    type: 'quickreply',
    options: [
      '1–50 employees',
      '51–200 employees',
      '201–500 employees',
      '501–2,000 employees',
      '2,000+ employees',
    ],
    field: 'company_size',
  },
  {
    id: 4,
    botMessage:
      "What's your biggest security challenge right now? (Pick the one that feels most urgent)",
    type: 'quickreply',
    options: [
      'Cloud Security',
      'Identity & Access Management',
      'Application Security',
      'Compliance & Audit',
      'Security Monitoring',
      'Incident Response',
      'Not sure yet',
    ],
    field: 'challenge',
  },
  {
    id: 5,
    botMessage:
      "Can you tell me a bit more about what you're dealing with? Even a sentence or two helps us prepare.",
    type: 'text',
    placeholder: 'Describe your situation...',
    optional: true,
    field: 'description',
  },
  {
    id: 6,
    botMessage: 'What are you hoping Mitigence can help with?',
    type: 'quickreply',
    options: [
      'Security Assessment',
      'Build a Security Program',
      'Ongoing Engineering Support',
      'Just exploring for now',
    ],
    field: 'intent',
  },
  {
    id: 7,
    botMessage: "What's the best email address to reach you?",
    type: 'email',
    placeholder: 'you@company.com',
    field: 'email',
  },
  {
    id: 8,
    botMessage:
      "And a phone number? (Completely optional — we won't cold call you)",
    type: 'tel',
    placeholder: '+1 (555) 000-0000',
    optional: true,
    field: 'phone',
  },
  {
    id: 9,
    botMessage: 'Last question — how soon are you looking to move on this?',
    type: 'quickreply',
    options: [
      'Immediate — this week',
      'Short-term — this month',
      'Planning — next quarter',
      'Just researching for now',
    ],
    field: 'urgency',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2, 10)
}

function interpolate(template: string, lead: Partial<Lead>): string {
  let result = template

  // Replace {name}
  if (lead.name) {
    result = result.replace(/\{name\}/g, lead.name)
  }

  // Replace {company} — extract company from company_role if possible
  const company = lead.company_role
    ? lead.company_role.split(',')[0].trim() || 'your company'
    : 'your company'
  result = result.replace(/\{company\}/g, company)

  return result
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 px-4 py-2.5 bg-zinc-800 rounded-2xl rounded-tl-sm w-fit">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block w-2 h-2 bg-zinc-500 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Chat bubble SVG ──────────────────────────────────────────────────────────

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
        fill="white"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M15 5L5 15M5 5L15 15"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M14 8L2 2L5.5 8L2 14L14 8Z"
        fill="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function LeadCaptureBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [messages, setMessages] = useState<Message[]>([])
  const [lead, setLead] = useState<Partial<Lead>>({})
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [inputError, setInputError] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasStarted = useRef(false)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Focus input when step changes and it's a text/email/tel type
  useEffect(() => {
    if (currentStep >= 0 && !isTyping && !isComplete) {
      const step = steps[currentStep]
      if (step && step.type !== 'quickreply') {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }, [currentStep, isTyping, isComplete])

  const addBotMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'bot', content, timestamp: new Date() },
    ])
  }, [])

  const addUserMessage = useCallback((content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: uid(), role: 'user', content, timestamp: new Date() },
    ])
  }, [])

  const showNextBot = useCallback(
    (stepIndex: number, updatedLead: Partial<Lead>) => {
      setIsTyping(true)
      setTimeout(() => {
        setIsTyping(false)
        if (stepIndex < steps.length) {
          const step = steps[stepIndex]
          addBotMessage(interpolate(step.botMessage, updatedLead))
          setCurrentStep(stepIndex)
        }
      }, 800)
    },
    [addBotMessage]
  )

  // Open chat and start conversation
  const openChat = useCallback(() => {
    setIsOpen(true)
    if (!hasStarted.current) {
      hasStarted.current = true
      setTimeout(() => {
        addBotMessage(interpolate(steps[0].botMessage, {}))
        setCurrentStep(0)
      }, 600)
    }
  }, [addBotMessage])

  const handleSubmitLead = useCallback(
    async (finalLead: Partial<Lead>) => {
      setIsSubmitting(true)
      setIsTyping(true)

      try {
        await fetch('/api/lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(finalLead),
        })
      } catch {
        // Silent — show success either way to not alarm user
      }

      setTimeout(() => {
        setIsTyping(false)
        setIsSubmitting(false)
        setIsComplete(true)
        addBotMessage(
          `Thank you, ${finalLead.name ?? 'there'}! 🎯 A Mitigence specialist will reach out to ${finalLead.email ?? 'you'} within 24 hours.\n\nIn the meantime, would you like to book a strategy session directly?`
        )
      }, 1200)
    },
    [addBotMessage]
  )

  const advanceStep = useCallback(
    (value: string, stepIndex: number) => {
      const step = steps[stepIndex]
      if (!step) return

      const updatedLead = { ...lead, [step.field]: value }
      setLead(updatedLead)
      addUserMessage(value || 'Skip')

      const nextStepIndex = stepIndex + 1

      if (nextStepIndex >= steps.length) {
        // All steps done — submit
        setCurrentStep(steps.length)
        handleSubmitLead(updatedLead)
      } else {
        showNextBot(nextStepIndex, updatedLead)
      }
    },
    [lead, addUserMessage, handleSubmitLead, showNextBot]
  )

  const handleTextSubmit = useCallback(() => {
    if (currentStep < 0 || currentStep >= steps.length) return
    const step = steps[currentStep]
    const val = inputValue.trim()

    // Validate email
    if (step.type === 'email') {
      if (!emailRegex.test(val)) {
        setInputError('Please enter a valid email address.')
        return
      }
    }

    // Required field check (non-optional)
    if (!val && !step.optional) {
      setInputError('This field is required.')
      return
    }

    setInputError('')
    setInputValue('')
    advanceStep(val, currentStep)
  }, [currentStep, inputValue, advanceStep])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault()
        handleTextSubmit()
      }
    },
    [handleTextSubmit]
  )

  const handleChipClick = useCallback(
    (option: string) => {
      if (isTyping || isSubmitting || isComplete) return
      advanceStep(option, currentStep)
    },
    [isTyping, isSubmitting, isComplete, advanceStep, currentStep]
  )

  const handleSkip = useCallback(() => {
    if (currentStep < 0 || currentStep >= steps.length) return
    setInputError('')
    setInputValue('')
    advanceStep('', currentStep)
  }, [currentStep, advanceStep])

  // Determine what to show in the input area
  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null
  const showInput =
    !isComplete &&
    !isTyping &&
    currentStepData !== null &&
    currentStepData.type !== 'quickreply'
  const showChips =
    !isComplete &&
    !isTyping &&
    currentStepData !== null &&
    currentStepData.type === 'quickreply'

  return (
    <>
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-window"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[560px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxWidth: '24rem' }}
          >
            {/* Header */}
            <div className="bg-zinc-900 rounded-t-2xl px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="block w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                <div>
                  <p className="text-white font-medium text-sm leading-none">
                    Mitigence Assistant
                  </p>
                  <p className="text-zinc-400 text-xs mt-0.5">
                    Usually replies instantly
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-label="Close chat"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={
                      msg.role === 'bot'
                        ? 'bg-zinc-800 text-white rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm max-w-[80%] whitespace-pre-line'
                        : 'bg-red-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm max-w-[80%] ml-auto'
                    }
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}

              {/* Completion CTA buttons */}
              {isComplete && (
                <div className="flex flex-col gap-2 pt-1">
                  <a
                    href="/consultation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    📅 Book a Call
                  </a>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white text-sm px-4 py-2.5 rounded-xl transition-colors"
                  >
                    {"I'll wait for your email"}
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick reply chips */}
            {showChips && currentStepData && (
              <div className="flex flex-wrap gap-2 px-4 pb-3 shrink-0">
                {currentStepData.options?.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleChipClick(option)}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-600 text-white text-sm px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Text input area */}
            {showInput && currentStepData && (
              <div className="border-t border-zinc-800 px-3 py-3 flex flex-col gap-1.5 shrink-0">
                {inputError && (
                  <p className="text-red-400 text-xs px-1">{inputError}</p>
                )}
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type={currentStepData.type === 'email' ? 'email' : currentStepData.type === 'tel' ? 'tel' : 'text'}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value)
                      if (inputError) setInputError('')
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStepData.placeholder ?? 'Type a message...'}
                    className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 text-sm px-3 py-2 rounded-xl outline-none border border-zinc-700 focus:border-red-600 transition-colors"
                    disabled={isSubmitting}
                    autoComplete="off"
                  />
                  <button
                    onClick={handleTextSubmit}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-2 rounded-xl transition-colors"
                    aria-label="Send message"
                  >
                    <SendIcon />
                  </button>
                </div>
                {currentStepData.optional && (
                  <button
                    onClick={handleSkip}
                    className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-red-600 text-white text-sm px-3 py-1.5 rounded-full self-start transition-colors"
                  >
                    Skip →
                  </button>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={isOpen ? () => setIsOpen(false) : openChat}
          className="w-14 h-14 bg-red-600 hover:bg-red-700 rounded-full shadow-lg flex items-center justify-center transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.7 }}
                transition={{ duration: 0.15 }}
              >
                <CloseIcon />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ opacity: 0, rotate: 90, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.7 }}
                transition={{ duration: 0.15 }}
              >
                <ChatIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  )
}
