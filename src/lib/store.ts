import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface JourneyState {
  // Security Journey Designer (Module 2)
  currentMaturity: string | null
  targetMaturity: string | null

  // Engagement Studio (Module 3)
  businessContexts: string[]
  objectives: string[]
  environment: string | null
  scopeItems: string[]
  timeline: string | null

  // Enterprise Explorer (Module 1)
  exploredDomains: string[]

  // Team Builder (Module 6)
  selectedPods: string[]

  // Capability Explorer (Module 4)
  exploredCapabilities: string[]
}

interface JourneyActions {
  setCurrentMaturity: (maturity: string) => void
  setTargetMaturity: (maturity: string) => void
  toggleBusinessContext: (id: string) => void
  toggleObjective: (id: string) => void
  setEnvironment: (env: string) => void
  toggleScopeItem: (id: string) => void
  setTimeline: (timeline: string) => void
  addExploredDomain: (domain: string) => void
  togglePod: (podId: string) => void
  addExploredCapability: (capabilityId: string) => void
  reset: () => void
}

const initialState: JourneyState = {
  currentMaturity: null,
  targetMaturity: null,
  businessContexts: [],
  objectives: [],
  environment: null,
  scopeItems: [],
  timeline: null,
  exploredDomains: [],
  selectedPods: [],
  exploredCapabilities: [],
}

export const useJourneyStore = create<JourneyState & JourneyActions>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentMaturity: (maturity) => set({ currentMaturity: maturity }),
      setTargetMaturity: (maturity) => set({ targetMaturity: maturity }),

      toggleBusinessContext: (id) =>
        set((state) => ({
          businessContexts: state.businessContexts.includes(id)
            ? state.businessContexts.filter((c) => c !== id)
            : [...state.businessContexts, id],
        })),

      toggleObjective: (id) =>
        set((state) => ({
          objectives: state.objectives.includes(id)
            ? state.objectives.filter((o) => o !== id)
            : [...state.objectives, id],
        })),

      setEnvironment: (env) => set({ environment: env }),

      toggleScopeItem: (id) =>
        set((state) => ({
          scopeItems: state.scopeItems.includes(id)
            ? state.scopeItems.filter((s) => s !== id)
            : [...state.scopeItems, id],
        })),

      setTimeline: (timeline) => set({ timeline }),

      addExploredDomain: (domain) =>
        set((state) => ({
          exploredDomains: [...new Set([...state.exploredDomains, domain])],
        })),

      togglePod: (podId) =>
        set((state) => ({
          selectedPods: state.selectedPods.includes(podId)
            ? state.selectedPods.filter((p) => p !== podId)
            : [...state.selectedPods, podId],
        })),

      addExploredCapability: (capabilityId) =>
        set((state) => ({
          exploredCapabilities: [
            ...new Set([...state.exploredCapabilities, capabilityId]),
          ],
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'mitigence-journey',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? sessionStorage : localStorage
      ),
    }
  )
)
