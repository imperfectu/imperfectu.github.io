import { mockMedia } from '$lib/data/mockMedia';
import type { EntryGenerator } from './$types';

export const entries: EntryGenerator = () => mockMedia.map((m) => ({ id: m.id }));
