'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'
import type { RiskResult } from '@/lib/risk'
import type { DeliverableStatus, MeetingStatus, Priority, Effort } from '@/lib/supabase/types'

const TABS = ['Overview', 'Reports', 'Deliverables', 'Meetings', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

const RISK_STYLES: Record<RiskResult['level'], string> = {
  'On track': 'bg-green-500/10 text-green-500 border-green-500/20',
  'At risk': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Delayed: 'bg-red-600/10 text-red-500 border-red-600/20',
}

interface Project {
  id: string
  name: string
  phase: string
  progress: number
}

interface Report {
  id: string
  title: string
  report_type: string
  report_date: string
  status: string
  file_path: string | null
}

interface Deliverable {
  id: string
  item: string
  status: DeliverableStatus
  week_label: string
  due_date: string | null
  delay_explanation: string | null
  file_path: string | null
}

interface Meeting {
  id: string
  title: string
  meeting_type: string
  scheduled_at: string
  status: MeetingStatus
  mom_file_path: string | null
}

interface Recommendation {
  id: string
  finding: string
  priority: Priority
  effort: Effort
}

interface ClientWorkspaceProps {
  project: Project
  risk: RiskResult
  recentActivity: string[]
  reports: Report[]
  deliverables: Deliverable[]
  meetings: Meeting[]
  recommendations: Recommendation[]
  fileUrls: Record<string, string>
}

function isDeliverableOverdue(deliverable: Deliverable): boolean {
  if (deliverable.status === 'complete' || !deliverable.due_date) return false
  return new Date(deliverable.due_date).getTime() < Date.now()
}

function isMeetingOverdue(meeting: Meeting): boolean {
  if (meeting.status === 'completed') return false
  return new Date(meeting.scheduled_at).getTime() < Date.now()
}

function formatScheduledAt(scheduledAt: string): string {
  return new Date(scheduledAt).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function ClientWorkspace({
  project,
  risk,
  recentActivity,
  reports,
  deliverables,
  meetings,
  recommendations,
  fileUrls,
}: ClientWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const completedCount = deliverables.filter((d) => d.status === 'complete').length
  const nextMeeting = meetings
    .filter((m) => m.status === 'upcoming')
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0]

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
      {/* Workspace header */}
      <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <span className="text-zinc-400 text-xs">Mitigence Workspace</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-zinc-500 text-xs">Live session</span>
        </div>
      </div>

      {/* Project header */}
      <div className="px-6 py-4 border-b border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-white font-semibold">{project.name}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{project.phase || 'No phase set'}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-zinc-800 rounded-full h-1.5">
              <div className="bg-red-600 h-1.5 rounded-full" style={{ width: `${project.progress}%` }} />
            </div>
            <span className="text-zinc-400 text-xs">{project.progress}%</span>
            <span className={`text-xs rounded-full px-2.5 py-1 border ${RISK_STYLES[risk.level]}`}>
              {risk.level}
            </span>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-zinc-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-5 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-red-600 text-white bg-red-600/5'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-6 min-h-64">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={defaultTransition}
          >
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Deliverables completed</p>
                  <p className="text-2xl font-bold text-white">
                    {completedCount} / {deliverables.length}
                  </p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Open recommendations</p>
                  <p className="text-2xl font-bold text-white">{recommendations.length}</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Next meeting</p>
                  <p className="text-white font-semibold text-sm">
                    {nextMeeting ? formatScheduledAt(nextMeeting.scheduled_at) : 'No meetings scheduled'}
                  </p>
                </div>
                <div className="sm:col-span-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-3">This week&apos;s activity</p>
                  {recentActivity.length > 0 ? (
                    <ul className="space-y-2">
                      {recentActivity.map((entry) => (
                        <li key={entry} className="flex items-center gap-2 text-zinc-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />
                          {entry}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-zinc-600 text-xs">No recent activity.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Reports' && (
              <div className="space-y-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4"
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        {r.report_type} &middot; {r.report_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {r.file_path && fileUrls[r.file_path] && (
                        <a
                          href={fileUrls[r.file_path]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                        >
                          Download
                        </a>
                      )}
                      <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
                        {r.status}
                      </span>
                    </div>
                  </div>
                ))}
                {reports.length === 0 && <p className="text-zinc-600 text-sm">No reports yet.</p>}
              </div>
            )}

            {activeTab === 'Deliverables' && (
              <div className="space-y-2">
                {deliverables.map((d) => {
                  const overdue = isDeliverableOverdue(d)
                  return (
                    <div key={d.id} className="py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-xs ${
                              d.status === 'complete'
                                ? 'border-green-600 bg-green-600 text-white'
                                : d.status === 'in-progress'
                                  ? 'border-red-600 bg-red-600/20 text-red-500'
                                  : 'border-zinc-700'
                            }`}
                          >
                            {d.status === 'complete' ? '✓' : d.status === 'in-progress' ? '·' : ''}
                          </span>
                          <span
                            className={`text-sm ${d.status === 'complete' ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}
                          >
                            {d.item}
                          </span>
                          {d.file_path && fileUrls[d.file_path] && (
                            <a
                              href={fileUrls[d.file_path]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-500 hover:text-red-400 text-xs font-medium transition-colors"
                            >
                              Download
                            </a>
                          )}
                        </div>
                        <span className={`text-xs ${overdue ? 'text-red-500' : 'text-zinc-600'}`}>
                          {d.week_label}
                          {d.due_date ? ` · Due ${d.due_date}${overdue ? ' (overdue)' : ''}` : ''}
                        </span>
                      </div>
                      {d.delay_explanation && (
                        <p className="text-zinc-500 text-xs mt-1 ml-7">{d.delay_explanation}</p>
                      )}
                    </div>
                  )
                })}
                {deliverables.length === 0 && (
                  <p className="text-zinc-600 text-sm">No deliverables yet.</p>
                )}
              </div>
            )}

            {activeTab === 'Meetings' && (
              <div className="space-y-3">
                {meetings.map((m) => {
                  const overdue = isMeetingOverdue(m)
                  return (
                    <div
                      key={m.id}
                      className={`rounded-lg border p-4 ${overdue ? 'border-red-600/40 bg-red-600/5' : 'border-zinc-800 bg-zinc-900'}`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-white text-sm font-medium">{m.title}</p>
                          <p className={`text-xs mt-0.5 ${overdue ? 'text-red-500' : 'text-zinc-500'}`}>
                            {formatScheduledAt(m.scheduled_at)}
                            {overdue ? ' (overdue)' : ''}
                            {m.mom_file_path && fileUrls[m.mom_file_path] && (
                              <>
                                {' · '}
                                <a
                                  href={fileUrls[m.mom_file_path]}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-red-500 hover:text-red-400 font-medium transition-colors"
                                >
                                  Download minutes
                                </a>
                              </>
                            )}
                          </p>
                        </div>
                        <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-1 flex-shrink-0">
                          {m.meeting_type}
                        </span>
                      </div>
                    </div>
                  )
                })}
                {meetings.length === 0 && <p className="text-zinc-600 text-sm">No meetings yet.</p>}
              </div>
            )}

            {activeTab === 'Recommendations' && (
              <div className="space-y-3">
                {recommendations.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 ${
                          r.priority === 'High'
                            ? 'bg-red-600/10 text-red-500 border border-red-600/20'
                            : 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20'
                        }`}
                      >
                        {r.priority}
                      </span>
                      <p className="text-zinc-300 text-sm">{r.finding}</p>
                    </div>
                    <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-zinc-600 text-sm">No recommendations yet.</p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
