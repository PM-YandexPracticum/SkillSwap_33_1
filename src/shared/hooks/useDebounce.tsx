import { useState } from 'react';

// установлена библиотека lodash в ней есть debounce
export function useDebounce() {
	const [test, setTest] = useState();

	return [test, setTest];
}
