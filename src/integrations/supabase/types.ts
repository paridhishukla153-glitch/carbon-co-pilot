export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string
          category: string
          co2e: number
          created_at: string
          emission_factor: number
          id: string
          notes: string | null
          occurred_on: string
          quantity: number
          source: string
          trips: number
          unit: string
          user_id: string
        }
        Insert: {
          activity_type: string
          category: string
          co2e: number
          created_at?: string
          emission_factor: number
          id?: string
          notes?: string | null
          occurred_on?: string
          quantity: number
          source?: string
          trips?: number
          unit: string
          user_id: string
        }
        Update: {
          activity_type?: string
          category?: string
          co2e?: number
          created_at?: string
          emission_factor?: number
          id?: string
          notes?: string | null
          occurred_on?: string
          quantity?: number
          source?: string
          trips?: number
          unit?: string
          user_id?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          description: string
          icon: string
          id: string
          slug: string
          title: string
        }
        Insert: {
          description: string
          icon?: string
          id?: string
          slug: string
          title: string
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      challenge_actions: {
        Row: {
          challenge_id: string
          co2e_avoided: number
          created_at: string
          description: string
          evidence: string | null
          id: string
          user_id: string
          verification_method: string
          verification_status: string
        }
        Insert: {
          challenge_id: string
          co2e_avoided?: number
          created_at?: string
          description: string
          evidence?: string | null
          id?: string
          user_id: string
          verification_method?: string
          verification_status?: string
        }
        Update: {
          challenge_id?: string
          co2e_avoided?: number
          created_at?: string
          description?: string
          evidence?: string | null
          id?: string
          user_id?: string
          verification_method?: string
          verification_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_actions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_participants: {
        Row: {
          challenge_id: string
          co2e_avoided: number
          completed_at: string | null
          id: string
          joined_at: string
          progress: number
          status: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          co2e_avoided?: number
          completed_at?: string | null
          id?: string
          joined_at?: string
          progress?: number
          status?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          co2e_avoided?: number
          completed_at?: string | null
          id?: string
          joined_at?: string
          progress?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_participants_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          category: string
          created_at: string
          demo_participants: number
          description: string
          difficulty: string
          duration_days: number
          eco_points: number
          ends_on: string
          id: string
          potential_reduction_kg: number
          slug: string
          target_actions: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          demo_participants?: number
          description: string
          difficulty: string
          duration_days?: number
          eco_points?: number
          ends_on?: string
          id?: string
          potential_reduction_kg?: number
          slug: string
          target_actions?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          demo_participants?: number
          description?: string
          difficulty?: string
          duration_days?: number
          eco_points?: number
          ends_on?: string
          id?: string
          potential_reduction_kg?: number
          slug?: string
          target_actions?: number
          title?: string
        }
        Relationships: []
      }
      civic_metrics: {
        Row: {
          challenge_participation_pct: number
          co2e_avoided: number
          energy_reduction_kwh: number
          id: string
          is_demo: boolean
          participants: number
          region: string
          transport_shift_pct: number
          walk_cycle_km: number
          week_start: string
        }
        Insert: {
          challenge_participation_pct: number
          co2e_avoided: number
          energy_reduction_kwh: number
          id?: string
          is_demo?: boolean
          participants: number
          region?: string
          transport_shift_pct: number
          walk_cycle_km: number
          week_start: string
        }
        Update: {
          challenge_participation_pct?: number
          co2e_avoided?: number
          energy_reduction_kwh?: number
          id?: string
          is_demo?: boolean
          participants?: number
          region?: string
          transport_shift_pct?: number
          walk_cycle_km?: number
          week_start?: string
        }
        Relationships: []
      }
      communities: {
        Row: {
          campus: string
          co2e_avoided: number
          id: string
          is_demo: boolean
          members: number
          name: string
          participation_pct: number
          verified_actions: number
        }
        Insert: {
          campus?: string
          co2e_avoided?: number
          id?: string
          is_demo?: boolean
          members?: number
          name: string
          participation_pct?: number
          verified_actions?: number
        }
        Update: {
          campus?: string
          co2e_avoided?: number
          id?: string
          is_demo?: boolean
          members?: number
          name?: string
          participation_pct?: number
          verified_actions?: number
        }
        Relationships: []
      }
      community_members: {
        Row: {
          community_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          community_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          community_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_members_community_id_fkey"
            columns: ["community_id"]
            isOneToOne: false
            referencedRelation: "communities"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_leaderboard: {
        Row: {
          campus: string
          co2e_avoided_all: number
          co2e_avoided_month: number
          co2e_avoided_week: number
          community: string
          display_name: string
          eco_points: number
          id: string
          is_demo: boolean
          verified_actions: number
        }
        Insert: {
          campus?: string
          co2e_avoided_all: number
          co2e_avoided_month: number
          co2e_avoided_week: number
          community: string
          display_name: string
          eco_points: number
          id?: string
          is_demo?: boolean
          verified_actions: number
        }
        Update: {
          campus?: string
          co2e_avoided_all?: number
          co2e_avoided_month?: number
          co2e_avoided_week?: number
          community?: string
          display_name?: string
          eco_points?: number
          id?: string
          is_demo?: boolean
          verified_actions?: number
        }
        Relationships: []
      }
      emission_factors: {
        Row: {
          activity_type: string
          category: string
          created_at: string
          factor: number
          id: string
          label: string
          region: string
          source: string
          unit: string
        }
        Insert: {
          activity_type: string
          category: string
          created_at?: string
          factor: number
          id?: string
          label: string
          region?: string
          source: string
          unit: string
        }
        Update: {
          activity_type?: string
          category?: string
          created_at?: string
          factor?: number
          id?: string
          label?: string
          region?: string
          source?: string
          unit?: string
        }
        Relationships: []
      }
      footprints: {
        Row: {
          energy_co2e: number
          food_co2e: number
          id: string
          other_co2e: number
          total_co2e: number
          transport_co2e: number
          updated_at: string
          user_id: string
          week_start: string
        }
        Insert: {
          energy_co2e?: number
          food_co2e?: number
          id?: string
          other_co2e?: number
          total_co2e?: number
          transport_co2e?: number
          updated_at?: string
          user_id: string
          week_start: string
        }
        Update: {
          energy_co2e?: number
          food_co2e?: number
          id?: string
          other_co2e?: number
          total_co2e?: number
          transport_co2e?: number
          updated_at?: string
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      nudge_feedback: {
        Row: {
          action_type: string
          created_at: string
          feedback: string
          id: string
          nudge_id: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          feedback: string
          id?: string
          nudge_id: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          feedback?: string
          id?: string
          nudge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nudge_feedback_nudge_id_fkey"
            columns: ["nudge_id"]
            isOneToOne: false
            referencedRelation: "nudges"
            referencedColumns: ["id"]
          },
        ]
      }
      nudges: {
        Row: {
          action_type: string
          created_at: string
          difficulty: string
          id: string
          message: string
          potential_reduction_kg: number | null
          provider: string
          reason: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          difficulty: string
          id?: string
          message: string
          potential_reduction_kg?: number | null
          provider?: string
          reason: string
          status?: string
          title: string
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          difficulty?: string
          id?: string
          message?: string
          potential_reduction_kg?: number | null
          provider?: string
          reason?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          baseline_weekly_co2e: number
          campus: string | null
          community: string | null
          created_at: string
          eco_points: number
          email: string | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          preferences: string[]
          primary_goal: string | null
          seeded: boolean
          streak_days: number
          updated_at: string
        }
        Insert: {
          baseline_weekly_co2e?: number
          campus?: string | null
          community?: string | null
          created_at?: string
          eco_points?: number
          email?: string | null
          full_name?: string | null
          id: string
          last_activity_date?: string | null
          preferences?: string[]
          primary_goal?: string | null
          seeded?: boolean
          streak_days?: number
          updated_at?: string
        }
        Update: {
          baseline_weekly_co2e?: number
          campus?: string | null
          community?: string | null
          created_at?: string
          eco_points?: number
          email?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          preferences?: string[]
          primary_goal?: string | null
          seeded?: boolean
          streak_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_slug: string
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_slug: string
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_slug?: string
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_slug_fkey"
            columns: ["badge_slug"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["slug"]
          },
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
