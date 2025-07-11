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
      admins: {
        Row: {
          email: string
          id: string
          name: string
          password: string
        }
        Insert: {
          email: string
          id?: string
          name: string
          password: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          password?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          created_at: string | null
          date: string
          id: string
          name: string
          status: string
          time: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          name: string
          status: string
          time: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          name?: string
          status?: string
          time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendances: {
        Row: {
          date: string
          id: string
          schedule_id: string | null
          status: string
          student_id: string | null
          subject_id: string | null
          timestamp: string
        }
        Insert: {
          date: string
          id?: string
          schedule_id?: string | null
          status: string
          student_id?: string | null
          subject_id?: string | null
          timestamp: string
        }
        Update: {
          date?: string
          id?: string
          schedule_id?: string | null
          status?: string
          student_id?: string | null
          subject_id?: string | null
          timestamp?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          class: string | null
          created_at: string | null
          email: string
          id: string
          name: string
          role: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          class?: string | null
          created_at?: string | null
          email: string
          id: string
          name: string
          role: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          class?: string | null
          created_at?: string | null
          email?: string
          id?: string
          name?: string
          role?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          class: string
          day_of_week: string
          end_time: string
          id: string
          room_number: string
          start_time: string
          subject_id: string | null
          teacher_id: string | null
        }
        Insert: {
          class: string
          day_of_week: string
          end_time: string
          id?: string
          room_number: string
          start_time: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          class?: string
          day_of_week?: string
          end_time?: string
          id?: string
          room_number?: string
          start_time?: string
          subject_id?: string | null
          teacher_id?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          class: string
          email: string
          id: string
          name: string
          password: string
          student_id: string
        }
        Insert: {
          class: string
          email: string
          id?: string
          name: string
          password?: string
          student_id: string
        }
        Update: {
          class?: string
          email?: string
          id?: string
          name?: string
          password?: string
          student_id?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          code: string
          id: string
          name: string
          teacher_id: string | null
        }
        Insert: {
          code: string
          id?: string
          name: string
          teacher_id?: string | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Relationships: []
      }
      teachers: {
        Row: {
          email: string
          id: string
          name: string
          password: string
          subjects: string[] | null
          teacher_id: string
        }
        Insert: {
          email: string
          id?: string
          name: string
          password?: string
          subjects?: string[] | null
          teacher_id: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          password?: string
          subjects?: string[] | null
          teacher_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          email: string
          id: string
          name: string
          password: string
          role: string
          role_id: string
        }
        Insert: {
          email: string
          id?: string
          name: string
          password: string
          role: string
          role_id: string
        }
        Update: {
          email?: string
          id?: string
          name?: string
          password?: string
          role?: string
          role_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_attendance_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_profiles_table: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      insert_profile: {
        Args: {
          p_id: string
          p_name: string
          p_email: string
          p_role: string
          p_class?: string
          p_subject?: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
