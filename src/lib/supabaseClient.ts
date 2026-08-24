import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { Database } from '$lib/database.types';

export type TypedSupabaseClient = SupabaseClient<Database>;

let client: TypedSupabaseClient | null = null;

/**
 * Lazy browser-side Supabase client.
 * Set PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY in .env to enable.
 */
export function getSupabase(): TypedSupabaseClient | null {
	if (!browser) return null;

	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !key || url.includes('YOUR_') || key.includes('YOUR_')) {
		return null;
	}

	if (!client) {
		client = createClient<Database>(url, key);
	}

	return client;
}
