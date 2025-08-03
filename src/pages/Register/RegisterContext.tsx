import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface SkillCategory {
	id: number;
	name: string;
	icon: string;
	color: string;
	skills: Array<{
		id: number;
		name: string;
	}>;
}

interface RegisterData {
	email: string;
	password: string;
	fullName?: string;
	birthDate?: string | undefined;
	gender?: string;
	city?: string;
        wantToLearnCategories?: number[];
        wantToLearnSubcategories?: number[];
	skillName?: string;
	description?: string;
	files?: FileList | null;
        canTeachCategories?: number[];
        canTeachSubcategories?: number[];
	avatar?: File;
}

interface RegisterContextProps {
	data: RegisterData;
	setData: React.Dispatch<React.SetStateAction<RegisterData>>;
	setStep1Data: (payload: Pick<RegisterData, 'email' | 'password'>) => void;
	setStep2Data: (
		payload: Pick<
			RegisterData,
			| 'fullName'
			| 'birthDate'
			| 'gender'
			| 'city'
			| 'wantToLearnCategories'
			| 'wantToLearnSubcategories'
			| 'avatar'
		>
	) => void;
	setStep3Data: (
		payload: Pick<
			RegisterData,
			| 'skillName'
			| 'description'
			| 'files'
			| 'canTeachCategories'
			| 'canTeachSubcategories'
		>
	) => void;

	categories: SkillCategory[];
	setCategories: React.Dispatch<React.SetStateAction<SkillCategory[]>>;
}

const RegisterContext = createContext<RegisterContextProps | undefined>(
	undefined
);

export const useRegister = () => {
	const context = useContext(RegisterContext);
	if (!context)
		throw new Error('useRegister must be used within RegisterProvider');
	return context;
};

export const RegisterProvider = ({ children }: { children: ReactNode }) => {
	const [data, setData] = useState<RegisterData>({
		email: '',
		password: '',
	});

	const [categories, setCategories] = useState<SkillCategory[]>([]);

	const setStep1Data = (payload: Pick<RegisterData, 'email' | 'password'>) => {
		setData((prev) => ({ ...prev, ...payload }));
	};

	const setStep2Data = (
		payload: Pick<
			RegisterData,
			| 'fullName'
			| 'birthDate'
			| 'gender'
			| 'city'
			| 'wantToLearnCategories'
			| 'wantToLearnSubcategories'
			| 'avatar'
		>
	) => {
		setData((prev) => ({ ...prev, ...payload }));
	};

	const setStep3Data = (
		payload: Pick<
			RegisterData,
			| 'skillName'
			| 'description'
			| 'files'
			| 'canTeachCategories'
			| 'canTeachSubcategories'
		>
	) => {
		setData((prev) => ({ ...prev, ...payload }));
	};

	return (
		<RegisterContext.Provider
			value={{
				data,
				setData,
				setStep1Data,
				setStep2Data,
				setStep3Data,
				categories,
				setCategories,
			}}
		>
			{children}
		</RegisterContext.Provider>
	);
};
