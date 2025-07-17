// Хук useLocalList для хранения списков в localStorage
// Пример из ТЗ:
// export const useLocalList = <T>(key: string, initial: T[]) => {
//   const [list, set] = useState<T[]>(() => {
//     const raw = localStorage.getItem(key);
//     return raw ? JSON.parse(raw) : initial;
//   });
//   useEffect(() => localStorage.setItem(key, JSON.stringify(list)), [list]);
//   return [list, set] as const;
// };
