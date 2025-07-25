import type { Skill } from '@/entities/skill/skill';

export async function fetchSkills(): Promise<Skill[]> {
	const response = await fetch('/db/skills.json');
	if (!response.ok) {
		throw new Error('Failed to load skills');
	}
	const data = await response.json();
	return data as Skill[];
}
