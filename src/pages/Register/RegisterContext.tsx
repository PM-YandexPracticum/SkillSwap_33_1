import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface RegisterData {
	email: string;
	password: string;
	fullName?: string;
	birthDate?: string;
	gender?: string;
	city?: string;
	skillCategory?: string;
	skillSubcategory?: string;
	skillName?: string;
	description?: string;
	files?: FileList | null;
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
			| 'skillCategory'
			| 'skillSubcategory'
		>
	) => void;
	setStep3Data: (
		payload: Pick<RegisterData, 'skillName' | 'description' | 'files'>
	) => void;
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
			| 'skillCategory'
			| 'skillSubcategory'
		>
	) => {
		setData((prev) => ({ ...prev, ...payload }));
	};

	const setStep3Data = (
		payload: Pick<RegisterData, 'skillName' | 'description' | 'files'>
	) => {
		setData((prev) => ({ ...prev, ...payload }));
	};

	return (
		<RegisterContext.Provider
			value={{ data, setData, setStep1Data, setStep2Data, setStep3Data }}
		>
			{children}
		</RegisterContext.Provider>
	);
};
