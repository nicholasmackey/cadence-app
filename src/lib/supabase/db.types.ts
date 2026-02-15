export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          id: string
          owner_profile_id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_profile_id: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_profile_id?: string
          name?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'families_owner_profile_id_fkey'
            columns: ['owner_profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      family_members: {
        Row: {
          id: string
          family_id: string
          user_id: string
          role: 'owner' | 'member'
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          user_id: string
          role: 'owner' | 'member'
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          user_id?: string
          role?: 'owner' | 'member'
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'family_members_family_id_fkey'
            columns: ['family_id']
            isOneToOne: false
            referencedRelation: 'families'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'family_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      children: {
        Row: {
          id: string
          family_id: string
          name: string
          birth_year: number | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          name: string
          birth_year?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          name?: string
          birth_year?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'children_family_id_fkey'
            columns: ['family_id']
            isOneToOne: false
            referencedRelation: 'families'
            referencedColumns: ['id']
          },
        ]
      }
      activities: {
        Row: {
          id: string
          family_id: string
          child_id: string
          occurred_at: string
          subject: string
          duration_minutes: number | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          family_id: string
          child_id: string
          occurred_at?: string
          subject: string
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          family_id?: string
          child_id?: string
          occurred_at?: string
          subject?: string
          duration_minutes?: number | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'activities_family_id_fkey'
            columns: ['family_id']
            isOneToOne: false
            referencedRelation: 'families'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'activities_child_id_family_id_fkey'
            columns: ['child_id', 'family_id']
            isOneToOne: false
            referencedRelation: 'children'
            referencedColumns: ['id', 'family_id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: {
      is_family_member: {
        Args: {
          target_family_id: string
        }
        Returns: boolean
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
