/**
 * Database Types for Tamedachi
 * 
 * These types match the Supabase database schema.
 * Generated from the database migrations.
 */

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
      pets: {
        Row: {
          id: string
          user_id: string
          name: string
          health_score: number
          age_years: number
          good_content_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name?: string
          health_score?: number
          age_years?: number
          good_content_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          health_score?: number
          age_years?: number
          good_content_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      content_submissions: {
        Row: {
          id: string
          user_id: string
          pet_id: string
          url: string
          credibility_score: number
          quality_category: 'excellent' | 'good' | 'questionable' | 'poor'
          is_good_content: boolean
          submitted_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pet_id: string
          url: string
          credibility_score: number
          quality_category: 'excellent' | 'good' | 'questionable' | 'poor'
          is_good_content: boolean
          submitted_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pet_id?: string
          url?: string
          credibility_score?: number
          quality_category?: 'excellent' | 'good' | 'questionable' | 'poor'
          is_good_content?: boolean
          submitted_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
