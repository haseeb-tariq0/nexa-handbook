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
      announcements: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["announcement_category"]
          created_at: string
          id: string
          is_pinned: boolean
          posted_by_id: string | null
          published_at: string
          title: string
          updated_at: string
        }
        Insert: {
          body: string
          category: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          id?: string
          is_pinned?: boolean
          posted_by_id?: string | null
          published_at?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["announcement_category"]
          created_at?: string
          id?: string
          is_pinned?: boolean
          posted_by_id?: string | null
          published_at?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_posted_by_id_fkey"
            columns: ["posted_by_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      comms_standards: {
        Row: {
          body: string | null
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["comms_kind"]
          meta: Json
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["comms_kind"]
          meta?: Json
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["comms_kind"]
          meta?: Json
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          core_expertise: string[]
          created_at: string
          description: string | null
          id: string
          key_tools: string[]
          lead_id: string | null
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          core_expertise?: string[]
          created_at?: string
          description?: string | null
          id?: string
          key_tools?: string[]
          lead_id?: string | null
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          core_expertise?: string[]
          created_at?: string
          description?: string | null
          id?: string
          key_tools?: string[]
          lead_id?: string | null
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_lead_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          category: Database["public"]["Enums"]["document_category"]
          created_at: string
          description: string | null
          external_url: string
          file_type: Database["public"]["Enums"]["document_file_type"] | null
          id: string
          is_published: boolean
          owner_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          external_url: string
          file_type?: Database["public"]["Enums"]["document_file_type"] | null
          id?: string
          is_published?: boolean
          owner_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["document_category"]
          created_at?: string
          description?: string | null
          external_url?: string
          file_type?: Database["public"]["Enums"]["document_file_type"] | null
          id?: string
          is_published?: boolean
          owner_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_tools: {
        Row: {
          accent_color: string | null
          created_at: string
          description: string | null
          icon_emoji: string | null
          id: string
          is_live: boolean
          name: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          is_live?: boolean
          name: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          accent_color?: string | null
          created_at?: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          is_live?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          body: string
          category: Database["public"]["Enums"]["template_category"]
          created_at: string
          description: string | null
          id: string
          owner_id: string | null
          title: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          body: string
          category: Database["public"]["Enums"]["template_category"]
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          title: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          body?: string
          category?: Database["public"]["Enums"]["template_category"]
          created_at?: string
          description?: string | null
          id?: string
          owner_id?: string | null
          title?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "message_templates_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_completions: {
        Row: {
          completed_at: string
          id: string
          step_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          step_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          step_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_completions_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "onboarding_steps"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "onboarding_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_steps: {
        Row: {
          created_at: string
          day_label: string
          description: string | null
          external_url: string | null
          id: string
          linked_section: string | null
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          day_label: string
          description?: string | null
          external_url?: string | null
          id?: string
          linked_section?: string | null
          sort_order: number
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          day_label?: string
          description?: string | null
          external_url?: string | null
          id?: string
          linked_section?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      onboarding_videos: {
        Row: {
          created_at: string
          description: string | null
          duration_label: string | null
          id: string
          is_active: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_label?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_label?: string | null
          id?: string
          is_active?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
      platform_logins: {
        Row: {
          access_notes: string | null
          category: Database["public"]["Enums"]["platform_category"]
          created_at: string
          credential_value: string | null
          description: string | null
          id: string
          login_identifier: string | null
          managed_by_id: string | null
          price: string | null
          tool_name: string
          tool_url: string | null
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          access_notes?: string | null
          category: Database["public"]["Enums"]["platform_category"]
          created_at?: string
          credential_value?: string | null
          description?: string | null
          id?: string
          login_identifier?: string | null
          managed_by_id?: string | null
          price?: string | null
          tool_name: string
          tool_url?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          access_notes?: string | null
          category?: Database["public"]["Enums"]["platform_category"]
          created_at?: string
          credential_value?: string | null
          description?: string | null
          id?: string
          login_identifier?: string | null
          managed_by_id?: string | null
          price?: string | null
          tool_name?: string
          tool_url?: string | null
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_logins_managed_by_id_fkey"
            columns: ["managed_by_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      sops: {
        Row: {
          body: string | null
          created_at: string
          department_id: string | null
          external_link: string | null
          id: string
          is_published: boolean
          last_reviewed_at: string | null
          owner_id: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          department_id?: string | null
          external_link?: string | null
          id?: string
          is_published?: boolean
          last_reviewed_at?: string | null
          owner_id?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          body?: string | null
          created_at?: string
          department_id?: string | null
          external_link?: string | null
          id?: string
          is_published?: boolean
          last_reviewed_at?: string | null
          owner_id?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sops_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sops_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          department_id: string | null
          email: string
          full_name: string
          id: string
          intended_admin: boolean | null
          is_active: boolean
          location: string | null
          phone: string | null
          reports_to: string | null
          role_title: string
          slack_handle: string | null
          sort_order: number
          updated_at: string
          whatsapp: string | null
          working_hours: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          email: string
          full_name: string
          id?: string
          intended_admin?: boolean | null
          is_active?: boolean
          location?: string | null
          phone?: string | null
          reports_to?: string | null
          role_title: string
          slack_handle?: string | null
          sort_order?: number
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          department_id?: string | null
          email?: string
          full_name?: string
          id?: string
          intended_admin?: boolean | null
          is_active?: boolean
          location?: string | null
          phone?: string | null
          reports_to?: string | null
          role_title?: string
          slack_handle?: string | null
          sort_order?: number
          updated_at?: string
          whatsapp?: string | null
          working_hours?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_reports_to_fkey"
            columns: ["reports_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_template_usage: {
        Args: { template_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      announcement_category:
        | "new"
        | "reminder"
        | "access"
        | "ops"
        | "tools"
        | "team"
      comms_kind:
        | "channel"
        | "response_standard"
        | "meeting_do"
        | "meeting_dont"
        | "meeting_decision"
        | "escalation_path"
      document_category:
        | "brand"
        | "templates"
        | "policies"
        | "onboarding"
        | "hr"
        | "finance"
        | "operations"
        | "creative"
        | "ai_tech"
      document_file_type:
        | "pdf"
        | "docx"
        | "pptx"
        | "gdoc"
        | "gsheet"
        | "link"
        | "video"
      platform_category:
        | "design"
        | "production"
        | "web"
        | "sales_am"
        | "seo"
        | "content"
        | "performance"
        | "social"
        | "everyone"
        | "ai_labs"
      template_category:
        | "client_facing"
        | "internal"
        | "announcement"
        | "hr"
        | "meeting"
        | "escalation"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      announcement_category: [
        "new",
        "reminder",
        "access",
        "ops",
        "tools",
        "team",
      ],
      comms_kind: [
        "channel",
        "response_standard",
        "meeting_do",
        "meeting_dont",
        "meeting_decision",
        "escalation_path",
      ],
      document_category: [
        "brand",
        "templates",
        "policies",
        "onboarding",
        "hr",
        "finance",
        "operations",
        "creative",
        "ai_tech",
      ],
      document_file_type: [
        "pdf",
        "docx",
        "pptx",
        "gdoc",
        "gsheet",
        "link",
        "video",
      ],
      platform_category: [
        "design",
        "production",
        "web",
        "sales_am",
        "seo",
        "content",
        "performance",
        "social",
        "everyone",
        "ai_labs",
      ],
      template_category: [
        "client_facing",
        "internal",
        "announcement",
        "hr",
        "meeting",
        "escalation",
      ],
    },
  },
} as const
