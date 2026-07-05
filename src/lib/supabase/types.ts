export type ProfileRole = 'pm' | 'client'
export type DeliverableStatus = 'pending' | 'in-progress' | 'complete'
export type MeetingStatus = 'upcoming' | 'completed'
export type Priority = 'High' | 'Medium' | 'Low'
export type Effort = 'Low' | 'Medium' | 'High'

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_at?: string
        }
        Update: Partial<{
          id: string
          name: string
          slug: string
          created_at: string
        }>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: ProfileRole
          client_id: string | null
          full_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          role: ProfileRole
          client_id?: string | null
          full_name?: string | null
          created_at?: string
        }
        Update: Partial<{
          role: ProfileRole
          client_id: string | null
          full_name: string | null
        }>
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          client_id: string
          name: string
          phase: string
          progress: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          name: string
          phase?: string
          progress?: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: Partial<{
          name: string
          phase: string
          progress: number
          status: string
          updated_at: string
        }>
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          project_id: string
          title: string
          report_type: string
          report_date: string
          status: string
          file_path: string | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          report_type?: string
          report_date?: string
          status?: string
          file_path?: string | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: Partial<{
          title: string
          report_type: string
          report_date: string
          status: string
          file_path: string | null
        }>
        Relationships: []
      }
      deliverables: {
        Row: {
          id: string
          project_id: string
          item: string
          status: DeliverableStatus
          week_label: string
          due_date: string | null
          delay_explanation: string | null
          file_path: string | null
          updated_by: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          item: string
          status?: DeliverableStatus
          week_label?: string
          due_date?: string | null
          delay_explanation?: string | null
          file_path?: string | null
          updated_by?: string | null
          updated_at?: string
        }
        Update: Partial<{
          item: string
          status: DeliverableStatus
          week_label: string
          due_date: string | null
          delay_explanation: string | null
          file_path: string | null
          updated_by: string | null
          updated_at: string
        }>
        Relationships: []
      }
      meetings: {
        Row: {
          id: string
          project_id: string
          title: string
          meeting_type: string
          scheduled_at: string
          status: MeetingStatus
          mom_file_path: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          title: string
          meeting_type?: string
          scheduled_at: string
          status?: MeetingStatus
          mom_file_path?: string | null
          created_at?: string
        }
        Update: Partial<{
          title: string
          meeting_type: string
          scheduled_at: string
          status: MeetingStatus
          mom_file_path: string | null
        }>
        Relationships: []
      }
      recommendations: {
        Row: {
          id: string
          project_id: string
          finding: string
          priority: Priority
          effort: Effort
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          finding: string
          priority: Priority
          effort: Effort
          created_at?: string
        }
        Update: Partial<{
          finding: string
          priority: Priority
          effort: Effort
        }>
        Relationships: []
      }
    }
  }
}
