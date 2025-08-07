import { useEffect, useState, useCallback } from 'react';
import {
	getUserRequests,
	type ExchangeRequest,
	finishExchange,
} from '@/api/requests.api';
import { getCurrentUser } from '@/features/auth/AuthForm.model';
import { SkillsAPI } from '@/api/skills.api';
import { SkillExchangeCard } from '@/widgets/SkillExchangeCard/SkillExchangeCard';
import { toast } from '@/shared/lib/toast';

interface RequestCard {
	req: ExchangeRequest;
	userId: string;
	skill?: {
		id: string;
		subcategoryId?: number;
		title: string;
		category: string;
		description: string;
		images?: string[];
	};
}

export const ExchangesPage = () => {
	const [pendingCards, setPendingCards] = useState<RequestCard[]>([]);
	const [activeCards, setActiveCards] = useState<RequestCard[]>([]);
	const [historyCards, setHistoryCards] = useState<RequestCard[]>([]);
	const currentUser = getCurrentUser();
	const currentId = currentUser ? `usr_${currentUser.id}` : '';

	const loadCards = useCallback(() => {
		if (!currentId) return;
		const all = getUserRequests();
		const relevant = all.filter(
			(r) => r.toUserId === currentId || r.fromUserId === currentId
		);
		const pending = relevant.filter(
			(r) => r.status === 'pending' && r.toUserId === currentId
		);
		const active = relevant.filter(
			(r) => r.status === 'inProgress' && r.toUserId === currentId
		);
		const history = relevant.filter(
			(r) => r.status === 'done' || r.status === 'rejected'
		);

		const mapReq = async (
			req: ExchangeRequest,
			mode: 'pending' | 'active'
		): Promise<RequestCard> => {
			const otherUserId =
				mode === 'pending'
					? req.fromUserId
					: req.fromUserId === currentId
						? req.toUserId
						: req.fromUserId;
			const targetSubcategory =
				mode === 'pending'
					? req.skillOfferedSubcategory
					: req.fromUserId === currentId
						? req.skillRequestedSubcategory
						: req.skillOfferedSubcategory;
			const offer = await SkillsAPI.getOfferById(otherUserId);
			const skill = offer?.skillsCanTeach?.find(
				(s: { subcategoryId: number }) => s.subcategoryId === targetSubcategory
			);
			if (!skill) {
				return { req, userId: otherUserId } as RequestCard;
			}
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
		};

		Promise.all(pending.map((r) => mapReq(r, 'pending'))).then(setPendingCards);
		Promise.all(active.map((r) => mapReq(r, 'active'))).then(setActiveCards);
		Promise.all(history.map((r) => mapReq(r, 'active'))).then(setHistoryCards);
	}, [currentId]);

	useEffect(() => {
		loadCards();
	}, [loadCards]);

	if (!currentUser) {
		return <div style={{ padding: 16 }}>Необходима авторизация</div>;
	}

	const renderStatus = (status: string) => {
		if (status === 'inProgress') return 'В процессе';
		if (status === 'rejected') return 'Отклонено';
		if (status === 'done') return 'Завершено';
		return '';
	};

	const handleFinish = (id: string) => {
		finishExchange(id);
		toast.success('Сессия завершена');
		loadCards();
	};

	return (
		<div style={{ padding: 16 }}>
			<h2>Мои обмены</h2>
			<h3>Новые заявки</h3>
			{pendingCards.length === 0 ? (
				<p>Нет новых заявок</p>
			) : (
				pendingCards.map(({ req, userId, skill }) => (
					<div key={req.id} style={{ marginBottom: 16 }}>
						{skill ? (
                                                        <SkillExchangeCard
                                                                skill={skill}
                                                                userId={userId}
                                                                showHeaderButtons={false}
                                                                isUserLoggedIn
                                                                onStatusChange={loadCards}
                                                                showExchangeButton
                                                        />
                                                ) : (
                                                        <p>Пользователь {userId}</p>
                                                )}
                                        </div>
                                ))
			)}

			<h3>Активные</h3>
			{activeCards.length === 0 ? (
				<p>Нет активных обменов</p>
			) : (
				activeCards.map(({ req, userId, skill }) => (
					<div key={req.id} style={{ marginBottom: 16 }}>
						{skill ? (
							<SkillExchangeCard
								skill={skill}
								userId={userId}
								showHeaderButtons={false}
								isUserLoggedIn
								onStatusChange={loadCards}
								showExchangeButton={false}
							/>
						) : (
							<p>Пользователь {userId}</p>
						)}
						<button
							onClick={() => handleFinish(req.id)}
							style={{ marginTop: 8 }}
						>
							Завершить
						</button>
					</div>
				))
			)}

			<h3>История</h3>
			{historyCards.length === 0 ? (
				<p>История пуста</p>
			) : (
				historyCards.map(({ req, userId, skill }) => (
					<div key={req.id} style={{ marginBottom: 16 }}>
						{skill ? (
							<SkillExchangeCard
								skill={skill}
								userId={userId}
								showHeaderButtons={false}
								isUserLoggedIn
								showExchangeButton={false}
							/>
						) : (
							<p>Пользователь {userId}</p>
						)}
						<p>
							{renderStatus(req.status)}
							{req.completedAt &&
								` (${new Date(req.completedAt).toLocaleDateString()})`}
						</p>
					</div>
				))
			)}
		</div>
	);
};

export default ExchangesPage;
