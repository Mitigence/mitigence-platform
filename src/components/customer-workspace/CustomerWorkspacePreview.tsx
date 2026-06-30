'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { defaultTransition } from '@/lib/animations'

const TABS = ['Overview', 'Reports', 'Deliverables', 'Meetings', 'Recommendations'] as const
type Tab = (typeof TABS)[number]

const mockProject = {
  name: 'Cloud Security Engineering',
  phase: 'Engineering — Week 6 of 12',
  progress: 52,
  status: 'On track',
}

const mockReports = [
  { title: 'Mid-point Assessment Summary', date: 'Week 6', type: 'Executive Summary', status: 'Available' },
  { title: 'Cloud Posture Report — AWS', date: 'Week 5', type: 'Technical Findings', status: 'Available' },
  { title: 'IAM Gap Analysis', date: 'Week 4', type: 'Engineering Report', status: 'Available' },
]

const mockDeliverables = [
  { item: 'Assessment Report', status: 'complete', week: 'Week 3' },
  { item: 'Architecture Design Document', status: 'complete', week: 'Week 4' },
  { item: 'Landing Zone Configuration', status: 'complete', week: 'Week 5' },
  { item: 'IAM Policy Framework', status: 'in-progress', week: 'Week 7' },
  { item: 'Security Hub Configuration', status: 'pending', week: 'Week 8' },
  { item: 'Validation Report', status: 'pending', week: 'Week 10' },
  { item: 'Knowledge Transfer Package', status: 'pending', week: 'Week 12' },
]

const mockMeetings = [
  { title: 'Weekly Engineering Review', date: 'Next: Thursday 10:00', type: 'Recurring' },
  { title: 'IAM Architecture Walkthrough', date: 'Tomorrow 14:00', type: 'Workshop' },
  { title: 'Executive Mid-Point Briefing', date: 'Week 7', type: 'Steering' },
]

const mockRecommendations = [
  { priority: 'High', finding: 'Enable AWS CloudTrail in all regions', effort: 'Low' },
  { priority: 'High', finding: 'Remove wildcard IAM policies from production roles', effort: 'Medium' },
  { priority: 'Medium', finding: 'Enable S3 Object Lock for critical data buckets', effort: 'Low' },
  { priority: 'Medium', finding: 'Implement SCP guardrails to prevent public exposure', effort: 'Medium' },
]

export function CustomerWorkspacePreview() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview')

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
            <h3 className="text-white font-semibold">{mockProject.name}</h3>
            <p className="text-zinc-500 text-xs mt-0.5">{mockProject.phase}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-32 bg-zinc-800 rounded-full h-1.5">
              <div
                className="bg-red-600 h-1.5 rounded-full"
                style={{ width: `${mockProject.progress}%` }}
              />
            </div>
            <span className="text-zinc-400 text-xs">{mockProject.progress}%</span>
            <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">
              {mockProject.status}
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
                  <p className="text-2xl font-bold text-white">3 / 7</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Open recommendations</p>
                  <p className="text-2xl font-bold text-white">4</p>
                </div>
                <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-1">Next meeting</p>
                  <p className="text-white font-semibold text-sm">Thursday 10:00</p>
                </div>
                <div className="sm:col-span-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                  <p className="text-zinc-500 text-xs mb-3">This week&apos;s activity</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />IAM Policy Framework — engineering in progress</li>
                    <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />IAM Architecture Walkthrough scheduled for tomorrow</li>
                    <li className="flex items-center gap-2 text-zinc-300 text-xs"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600 flex-shrink-0" />Mid-point executive briefing prepared for next week</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'Reports' && (
              <div className="space-y-3">
                {mockReports.map((r) => (
                  <div key={r.title} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                    <div>
                      <p className="text-white text-sm font-medium">{r.title}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{r.type} · {r.date}</p>
                    </div>
                    <span className="text-xs text-green-500 bg-green-500/10 border border-green-500/20 rounded-full px-2.5 py-1">{r.status}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Deliverables' && (
              <div className="space-y-2">
                {mockDeliverables.map((d) => (
                  <div key={d.item} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 text-xs ${
                        d.status === 'complete' ? 'border-green-600 bg-green-600 text-white' :
                        d.status === 'in-progress' ? 'border-red-600 bg-red-600/20 text-red-500' :
                        'border-zinc-700'
                      }`}>
                        {d.status === 'complete' ? '✓' : d.status === 'in-progress' ? '·' : ''}
                      </span>
                      <span className={`text-sm ${d.status === 'complete' ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>{d.item}</span>
                    </div>
                    <span className="text-zinc-600 text-xs">{d.week}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Meetings' && (
              <div className="space-y-3">
                {mockMeetings.map((m) => (
                  <div key={m.title} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-white text-sm font-medium">{m.title}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{m.date}</p>
                      </div>
                      <span className="text-xs text-zinc-500 bg-zinc-800 border border-zinc-700 rounded-full px-2.5 py-1 flex-shrink-0">{m.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Recommendations' && (
              <div className="space-y-3">
                {mockRecommendations.map((r) => (
                  <div key={r.finding} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900 p-4 gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`text-xs font-semibold rounded-full px-2.5 py-1 flex-shrink-0 ${
                        r.priority === 'High' ? 'bg-red-600/10 text-red-500 border border-red-600/20' : 'bg-yellow-600/10 text-yellow-500 border border-yellow-600/20'
                      }`}>{r.priority}</span>
                      <p className="text-zinc-300 text-sm">{r.finding}</p>
                    </div>
                    <span className="text-zinc-500 text-xs flex-shrink-0">Effort: {r.effort}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-6 pb-6 border-t border-zinc-900 pt-4">
        <p className="text-zinc-600 text-xs">
          This is a preview of the Mitigence Customer Workspace — what active clients see throughout an engagement.
        </p>
      </div>
    </div>
  )
}
