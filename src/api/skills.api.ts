import type { UserCardData } from '@/entities/user/user';
import type { SkillCategory, City } from '@/entities/skill/skill';

// Интерфейс для данных пользователей из JSON
interface UserData {
	id: string;
	name: string;
	avatarUrl: string;
	birthDate: string;
	genderId: string;
	locationId: string;
	description: string;
	createdAt: string;
	skillsCanTeach: Array<{
		subcategoryId: number;
		description: string;
		images: string[];
	}>;
	skillsWantToLearn: number[];
}

// Интерфейс для данных городов из JSON
interface CitiesData {
	cities: City[];
}

// Интерфейс для данных лайков из JSON
interface LikeData {
	userId: string;
	targetUserId: string;
	createdAt: string;
}

// Интерфейс для данных запросов из JSON
interface RequestData {
	id: string;
	skillId: number;
	fromUserId: string;
	toUserId: string;
	statusId: number;
	createdAt: string;
	finishedAt: string | null;
}

/**
 * API для работы с навыками и пользователями
 */
export class SkillsAPI {
	/**
	 * Получить всех пользователей
	 */
	static async getUsers(): Promise<UserCardData[]> {
		try {
			// Загружаем данные пользователей
			const usersResponse = await fetch('/db/users.json');
			const usersData: UserData[] = await usersResponse.json();

			// Загружаем данные навыков
			const skillsResponse = await fetch('/db/skills.json');
			const skillsData: SkillCategory[] = await skillsResponse.json();

			// Загружаем данные городов
			const citiesResponse = await fetch('/db/city.json');
			const citiesData: CitiesData = await citiesResponse.json();

			// Преобразуем данные в формат для карточек
			return usersData.map((user) => {
				// Находим город пользователя
				const city = citiesData.cities.find((c) => c.id === user.locationId);

				// Вычисляем возраст
				const birthDate = new Date(user.birthDate);
				const today = new Date();
				const age = today.getFullYear() - birthDate.getFullYear();

				// Получаем названия навыков, которые может преподавать
				const canTeachSkills = user.skillsCanTeach.map((skill) => {
					const category = skillsData.find((cat) =>
						cat.skills.some((s) => s.id === skill.subcategoryId)
					);
					const skillName = category?.skills.find(
						(s) => s.id === skill.subcategoryId
					);
					return skillName?.name || 'Неизвестный навык';
				});

				// Получаем названия навыков, которые хочет изучить
				const wantToLearnSkills = user.skillsWantToLearn.map((skillId) => {
					const category = skillsData.find((cat) =>
						cat.skills.some((s) => s.id === skillId)
					);
					const skillName = category?.skills.find((s) => s.id === skillId);
					return skillName?.name || 'Неизвестный навык';
				});

				return {
					id: user.id,
					name: user.name,
					avatarUrl: user.avatarUrl,
					location: city?.['city-name'] || 'Неизвестный город',
					age,
					skillsCanTeach: canTeachSkills,
					skillsWantToLearn: wantToLearnSkills,
					isFavorite: false, // По умолчанию не в избранном
					createdAt: user.createdAt, // Дата создания аккаунта
				};
			});
		} catch (error) {
			console.error('Ошибка при загрузке пользователей:', error);
			return [];
		}
	}

	/**
	 * Получить данные конкретного пользователя по ID, включая описание и изображения
	 */
	static async getOfferById(userId: string) {
		try {
			const usersResponse = await fetch('/db/users.json');
			const usersData: UserData[] = await usersResponse.json();

			const skillsResponse = await fetch('/db/skills.json');
			const skillsData: SkillCategory[] = await skillsResponse.json();

			const user = usersData.find((u) => u.id === userId);

			if (!user) return null;

			const skillsCanTeach = user.skillsCanTeach.map((skill) => {
				const category = skillsData.find((cat) =>
					cat.skills.some((s) => s.id === skill.subcategoryId)
				);
				const skillData = category?.skills.find(
					(s) => s.id === skill.subcategoryId
				);

				return {
					subcategoryId: skill.subcategoryId,
					title: skillData?.name || 'Неизвестный навык',
					categoty: category?.name || 'Неизвестная категория',
					description: skill.description,
					images: skill.images,
				};
			});

			return {
				id: user.id,
				skillsCanTeach,
			};
		} catch (error) {
			console.error(`Ошибка при загрузке пользователя с id ${userId}:`, error);
			return null;
		}
	}

	/**
	 * Получить популярных пользователей (по количеству лайков)
	 */
	static async getPopularUsers(): Promise<UserCardData[]> {
		try {
			const users = await this.getUsers();

			// Загружаем данные лайков
			const likesResponse = await fetch('/db/likes.json');
			const likesData: LikeData[] = await likesResponse.json();

			// Считаем лайки для каждого пользователя
			const userLikes = likesData.reduce(
				(acc, like) => {
					const targetUserId = like.targetUserId;
					return {
						...acc,
						[targetUserId]: (acc[targetUserId] || 0) + 1,
					};
				},
				{} as Record<string, number>
			);

			// Сортируем пользователей по количеству лайков (по убыванию)
			users.sort((a, b) => (userLikes[b.id] || 0) - (userLikes[a.id] || 0));

			return users.slice(0, 3);
		} catch (error) {
			console.error('Ошибка при загрузке популярных пользователей:', error);
			// Возвращаем первые 3 пользователя как fallback
			const users = await this.getUsers();
			return users.slice(0, 3);
		}
	}

	/**
	 * Получить новых пользователей (по дате создания аккаунта)
	 */
	static async getNewUsers(): Promise<UserCardData[]> {
		try {
			const users = await this.getUsers();

			// Сортируем по дате создания (новые сначала)
			users.sort((a, b) => {
				const dateA = new Date(a.createdAt || '');
				const dateB = new Date(b.createdAt || '');
				return dateB.getTime() - dateA.getTime();
			});

			return users.slice(0, 3);
		} catch (error) {
			console.error('Ошибка при загрузке новых пользователей:', error);
			// Возвращаем последние 3 пользователя как fallback
			const users = await this.getUsers();
			return users.slice(-3);
		}
	}

	/**
	 * Получить рекомендуемых пользователей (по количеству успешных обменов)
	 */
	static async getRecommendedUsers(): Promise<UserCardData[]> {
		try {
			const users = await this.getUsers();

			// Загружаем данные запросов
			const requestsResponse = await fetch('/db/requests.json');
			const requestsData: RequestData[] = await requestsResponse.json();

			// Считаем завершенные обмены для каждого пользователя
			// statusId === 4 означает завершенный обмен
			const userExchanges = requestsData
				.filter((req) => req.statusId === 4 && req.finishedAt)
				.reduce(
					(acc, req) => {
						const toUserId = req.toUserId;
						return {
							...acc,
							[toUserId]: (acc[toUserId] || 0) + 1,
						};
					},
					{} as Record<string, number>
				);

			// Сортируем по количеству успешных обменов (по убыванию)
			users.sort(
				(a, b) => (userExchanges[b.id] || 0) - (userExchanges[a.id] || 0)
			);

			return users.slice(0, 3);
		} catch (error) {
			console.error('Ошибка при загрузке рекомендуемых пользователей:', error);
			// Возвращаем случайных 3 пользователей как fallback
			const users = await this.getUsers();
			const shuffled = users.sort(() => 0.5 - Math.random());
			return shuffled.slice(0, 3);
		}
	}

	/**
	 * Получить категории навыков
	 */
	static async getSkillCategories(): Promise<SkillCategory[]> {
		try {
			const response = await fetch('/db/skills.json');
			return await response.json();
		} catch (error) {
			console.error('Ошибка при загрузке категорий навыков:', error);
			return [];
		}
	}

	/**
	 * Получить города
	 */
	static async getCities(): Promise<City[]> {
		try {
			const response = await fetch('/db/city.json');
			const data: CitiesData = await response.json();
			return data.cities;
		} catch (error) {
			console.error('Ошибка при загрузке городов:', error);
			return [];
		}
	}
}
