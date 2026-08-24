/**
 * Hand-written Supabase Database types aligned with
 * supabase/migrations/20260323000000_imperfectu_schema.sql
 * Regenerate later with: supabase gen types typescript --local
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type MaturityRatingDb = 'G' | 'PG' | 'PG-13' | 'R' | 'TV-MA' | 'NR';
export type TransmediaKindDb =
	| 'audio'
	| 'interactive'
	| 'document'
	| 'bts'
	| 'spatial'
	| 'download';
export type MediaGenreDb =
	| 'Drama'
	| 'Sci-Fi'
	| 'Thriller'
	| 'Documentary'
	| 'Experimental'
	| 'Horror'
	| 'Romance'
	| 'Fantasy'
	| 'Animation';

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string | null;
					display_name: string;
					avatar_url: string | null;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email?: string | null;
					display_name?: string;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string | null;
					display_name?: string;
					avatar_url?: string | null;
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			media_items: {
				Row: {
					id: string;
					title: string;
					description: string;
					thumbnail_url: string;
					backdrop_url: string | null;
					trailer_url: string;
					main_video_url: string;
					release_year: number;
					maturity_rating: MaturityRatingDb;
					duration_minutes: number | null;
					tags: string[];
					genres: MediaGenreDb[];
					cast_members: string[];
					creators: string[];
					featured: boolean;
					published: boolean;
					sort_order: number;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					title: string;
					description?: string;
					thumbnail_url: string;
					backdrop_url?: string | null;
					trailer_url?: string;
					main_video_url: string;
					release_year: number;
					maturity_rating?: MaturityRatingDb;
					duration_minutes?: number | null;
					tags?: string[];
					genres?: MediaGenreDb[];
					cast_members?: string[];
					creators?: string[];
					featured?: boolean;
					published?: boolean;
					sort_order?: number;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<Database['public']['Tables']['media_items']['Insert']>;
				Relationships: [];
			};
			media_chapters: {
				Row: {
					id: string;
					media_id: string;
					label: string;
					time_seconds: number;
					sort_order: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					media_id: string;
					label: string;
					time_seconds: number;
					sort_order?: number;
					created_at?: string;
				};
				Update: Partial<Database['public']['Tables']['media_chapters']['Insert']>;
				Relationships: [
					{
						foreignKeyName: 'media_chapters_media_id_fkey';
						columns: ['media_id'];
						isOneToOne: false;
						referencedRelation: 'media_items';
						referencedColumns: ['id'];
					}
				];
			};
			transmedia_items: {
				Row: {
					id: string;
					media_id: string;
					kind: TransmediaKindDb;
					title: string;
					description: string | null;
					asset_url: string | null;
					file_url: string | null;
					interactive_payload: Json | null;
					sort_order: number;
					published: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					media_id: string;
					kind: TransmediaKindDb;
					title: string;
					description?: string | null;
					asset_url?: string | null;
					file_url?: string | null;
					interactive_payload?: Json | null;
					sort_order?: number;
					published?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: Partial<Database['public']['Tables']['transmedia_items']['Insert']>;
				Relationships: [
					{
						foreignKeyName: 'transmedia_items_media_id_fkey';
						columns: ['media_id'];
						isOneToOne: false;
						referencedRelation: 'media_items';
						referencedColumns: ['id'];
					}
				];
			};
			content_rows: {
				Row: {
					id: string;
					title: string;
					sort_order: number;
					published: boolean;
					created_at: string;
				};
				Insert: {
					id: string;
					title: string;
					sort_order?: number;
					published?: boolean;
					created_at?: string;
				};
				Update: Partial<Database['public']['Tables']['content_rows']['Insert']>;
				Relationships: [];
			};
			content_row_items: {
				Row: {
					row_id: string;
					media_id: string;
					sort_order: number;
				};
				Insert: {
					row_id: string;
					media_id: string;
					sort_order?: number;
				};
				Update: Partial<Database['public']['Tables']['content_row_items']['Insert']>;
				Relationships: [];
			};
			watch_history: {
				Row: {
					id: string;
					user_id: string;
					media_id: string;
					progress_seconds: number;
					duration_seconds: number;
					completed: boolean;
					last_watched_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					media_id: string;
					progress_seconds?: number;
					duration_seconds?: number;
					completed?: boolean;
					last_watched_at?: string;
				};
				Update: Partial<Database['public']['Tables']['watch_history']['Insert']>;
				Relationships: [];
			};
		};
		Views: {
			media_with_flags: {
				Row: Database['public']['Tables']['media_items']['Row'] & {
					has_transmedia: boolean | null;
				};
				Relationships: [];
			};
		};
		Functions: Record<string, never>;
		Enums: {
			maturity_rating: MaturityRatingDb;
			transmedia_kind: TransmediaKindDb;
			media_genre: MediaGenreDb;
		};
		CompositeTypes: Record<string, never>;
	};
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
