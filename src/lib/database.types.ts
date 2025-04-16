export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cases: {
        Row: {
          id: string
          type: 'person' | 'vehicle'
          title: string
          description: string
          photos: string[]
          location_lat: number
          location_lng: number
          location_city: string
          location_state: string
          created_by: string | null
          created_at: string | null
          updated_at: string | null
          resolved_at: string | null
          resolved_by: string | null
          resolution_notes: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_year: number | null
          vehicle_color: string | null
          vehicle_plate: string | null
          vehicle_vin: string | null
          person_name: string | null
          person_age: number | null
          person_gender: string | null
          person_height: number | null
          person_weight: number | null
          person_characteristics: string | null
          last_seen_at: string | null
          last_seen_location: string | null
          is_approved: boolean | null
          approved_by: string | null
          approved_at: string | null
          verification_status: string | null
          ai_moderation_flag: boolean | null
          ai_moderation_score: number | null
        }
        Insert: {
          // Define insert type
        }
        Update: {
          // Define update type
        }
      }
      case_comments: {
        Row: {
          id: string
          case_id: string | null
          user_id: string | null
          content: string
          is_official: boolean | null
          is_hidden: boolean | null
          hidden_reason: string | null
          hidden_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          // Define insert type
        }
        Update: {
          // Define update type
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_type: 'person' | 'vehicle'
      user_role: 'user' | 'family' | 'authority' | 'moderator' | 'admin'
    }
  }
}