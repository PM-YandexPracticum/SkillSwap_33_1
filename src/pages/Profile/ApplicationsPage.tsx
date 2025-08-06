import { useEffect, useState, useCallback } from 'react';
import { getUserRequests, type ExchangeRequest } from '@/api/requests.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import { SkillsAPI } from '@/api/skills.api';
import { SkillExchangeCard } from '@/widgets/SkillExchangeCard/SkillExchangeCard';

type RequestCard = {
	req: ExchangeRequest;
	userId: string;
	skill: {
		id: string;
		subcategoryId?: number;
		title: string;
		category: string;
		description: string;
		images?: string[];
	};
};

export const ApplicationsPage = () => {
	const [cards, setCards] = useState<RequestCard[]>([]);
	const currentUser = getCurrentUser();
	const currentId = currentUser ? `usr_${currentUser.id}` : '';

	const loadCards = useCallback(() => {
		if (!currentId) return;
		const all = getUserRequests().filter(
			(r) =>
				r.fromUserId === currentId &&
				(r.status === 'pending' || r.status === 'inProgress')
		);
		Promise.all(
			all.map(async (req) => {
				const otherUserId = req.toUserId;
				const offer = await SkillsAPI.getOfferById(otherUserId);
				const skill = offer?.skillsCanTeach?.find(
					(s: { subcategoryId: number }) =>
						s.subcategoryId === req.skillRequestedSubcategory
				);
				if (!skill) return null;
				return {
					req,
					userId: otherUserId,
					skill: {
						id: String(skill.subcategoryId),
						subcategoryId: skill.subcategoryId,
						title: skill.title,
						category: skill.category,
						description: skill.description,
						images: skill.images,
					},
				} as RequestCard;
			})
		).then((res) => setCards(res.filter(Boolean) as RequestCard[]));
	}, [currentId]);

	useEffect(() => {
		loadCards();
	}, [loadCards]);

	if (!currentUser) {
		return <div style={{ padding: 16 }}>Необходима авторизация</div>;
	}

	return (
		<div style={{ padding: 16 }}>
			<h2>Заявки</h2>
			{cards.length === 0 ? (
				<p>Заявок нет</p>
			) : (
				cards.map(({ req, userId, skill }) => (
					<div key={req.id} style={{ marginBottom: 16 }}>
						<SkillExchangeCard
							skill={skill}
							userId={userId}
							showHeaderButtons={false}
							showExchangeButton={false}
							isUserLoggedIn
							onStatusChange={loadCards}
						/>
						<p style={{ marginTop: 8 }}>
							Статус:{' '}
							{req.status === 'pending' ? 'Ожидает ответа' : 'В процессе'}
						</p>
					</div>
				))
			)}
		</div>
	);
};

export default ApplicationsPage;
