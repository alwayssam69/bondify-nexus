export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      profile_views: {
        Row: {
          id: string
          is_notified: boolean | null
          profile_id: string
          viewed_at: string | null
          viewer_id: string
        }
        Insert: {
          id?: string
          is_notified?: boolean | null
          profile_id: string
          viewed_at?: string | null
          viewer_id: string
        }
        Update: {
          id?: string
          is_notified?: boolean | null
          profile_id?: string
          viewed_at?: string | null
          viewer_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          company: string | null
          created_at: string | null
          education: string | null
          email: string | null
          experience: string | null
          full_name: string | null
          id: string
          location: string | null
          skills: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          skills?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          company?: string | null
          created_at?: string | null
          education?: string | null
          email?: string | null
          experience?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          skills?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_matches: {
        Row: {
          created_at: string
          id: string
          last_activity: string | null
          last_viewed: string | null
          match_score: number | null
          matched_user_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_activity?: string | null
          last_viewed?: string | null
          match_score?: number | null
          matched_user_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_activity?: string | null
          last_viewed?: string | null
          match_score?: number | null
          matched_user_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_matches_matched_user_id_fkey"
            columns: ["matched_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_matches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activity_score: number | null
          bio: string | null
          course_year: string | null
          created_at: string
          email: string | null
          experience_level: string | null
          full_name: string | null
          id: string
          image_url: string | null
          industry: string | null
          interests: string[] | null
          last_active: string | null
          location: string | null
          match_preferences: Json | null
          networking_goals: string[] | null
          profile_completeness: number | null
          profile_photos: string[] | null
          project_interests: string[] | null
          skills: string[] | null
          university: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          activity_score?: number | null
          bio?: string | null
          course_year?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id: string
          image_url?: string | null
          industry?: string | null
          interests?: string[] | null
          last_active?: string | null
          location?: string | null
          match_preferences?: Json | null
          networking_goals?: string[] | null
          profile_completeness?: number | null
          profile_photos?: string[] | null
          project_interests?: string[] | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          activity_score?: number | null
          bio?: string | null
          course_year?: string | null
          created_at?: string
          email?: string | null
          experience_level?: string | null
          full_name?: string | null
          id?: string
          image_url?: string | null
          industry?: string | null
          interests?: string[] | null
          last_active?: string | null
          location?: string | null
          match_preferences?: Json | null
          networking_goals?: string[] | null
          profile_completeness?: number | null
          profile_photos?: string[] | null
          project_interests?: string[] | null
          skills?: string[] | null
          university?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      user_swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          target_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          target_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          target_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_swipes_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_swipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
