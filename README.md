# SkillSwap

[Документация по структуре и использованию данных](./PROJECT_DOC.md)

## Быстрый старт

1. Установите зависимости:
   ```
   npm install
   ```
2. Запустите проект в режиме разработки:
   ```
   npm run dev
   ```
3. Откройте http://localhost:5173 (у меня так, надо смотреть в терминале)

## Скрипты

- `npm run dev` — запуск dev-сервера
- `npm run build` — сборка проекта
- `npm run lint` — проверка стиля кода
- `npm run format` — автоформатирование
- `npm run check` — проверка CSS стилей, ts, tsx файлов и фикс ошибок (перед пушем делать)
- `npm run test:jest` — запуск jest тестов
- `npm run cypress:open` — открыть cypress тесты
- `npm run storybook` — открыть storybook

## Структура проекта

```
skill-swap/
├── public/
│   ├── db/
│   │   ├── skills.json               # Мок-данные навыков
│   │   └── users.json                # Мок-данные пользователей
│   └── favicon.svg                   # Иконка сайта
│
├── src/
│   ├── app/                          # Глобальная инициализация приложения
│   │   ├── App.tsx                   # Корневой компонент с маршрутизацией
│   │   ├── index.tsx                 # Точка входа (createRoot)
│   │   ├── theme.css                 # CSS переменные тем (light/dark)
│   │   └── providers.tsx             # Обёртки контекста (Auth, Theme и др.)
│
│   ├── api/                          # Работа с мок-данными (fetch/axios)
│   │   ├── skills.api.ts             # Загрузка, фильтрация навыков
│   │   ├── auth.api.ts               # Мок-авторизация
│   │   ├── requests.api.ts           # Работа с заявками
│   │   └── favorites.api.ts          # Управление избранным (localStorage)
│
│   ├── entities/                     # Базовые доменные модели и типы
│   │   ├── skill.ts                  # Типы и интерфейсы Skill
│   │   ├── user.ts                   # Типы User
│   │   └── request.ts                # Типы заявок и статусов
│
│   ├── features/                     # Независимые фичи (состояние, логика)
│   │   ├── auth/
│   │   │   ├── model.ts              # useAuth + localStorage
│   │   │   └── AuthForm.tsx          # Компоненты входа/регистрации
│   │   ├── skills/
│   │   │   ├── model.ts              # Хранилище, фильтры, поиск
│   │   │   └── SkillFilters.tsx      # Фильтры по типу/категории
│   │   ├── favorites/
│   │   │   ├── model.ts              # useLocalStorage
│   │   │   └── FavoriteButton.tsx    # Кнопка добавления в избранное
│   │   └── requests/
│   │       ├── model.ts              # Хранилище заявок
│   │       └── RequestCard.tsx       # Карточка заявки в профиле
│
│   ├── widgets/                      # Готовые UI-блоки
│   │   ├── SkillCard.tsx             # Карточка навыка
│   │   ├── SkillGrid.tsx             # Сетка навыков
│   │   ├── FiltersBar.tsx            # Панель фильтров
│   │   ├── Navbar.tsx                # Навигация + переключение тем
│   │   └── Toast.tsx                 # Уведомления (успех/ошибка)
│
│   ├── pages/                        # Страницы приложения
│   │   ├── HomePage.tsx              # Каталог навыков
│   │   ├── SkillPage.tsx             # Динамическая страница навыка
│   │   ├── ProfilePage.tsx           # Профиль пользователя
│   │   ├── FavoritesPage.tsx         # Избранное
│   │   ├── CreateSkillPage.tsx       # Форма создания навыка
│   │   ├── LoginPage.tsx             # Вход / регистрация
│   │   └── NotFoundPage.tsx          # 404
│
│   ├── shared/
│   │   ├── ui/                       # Универсальные компоненты (атомы)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── RadioGroup.tsx
│   │   │   └── Tag.tsx
│   │   ├── hooks/                    # Переиспользуемые хуки
│   │   │   ├── useDebounce.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useLocalList.ts       # Хук из ТЗ
│   │   │   └── useTheme.ts
│   │   └── lib/                      # Утилиты и константы
│   │       ├── constants.ts
│   │       ├── helpers.ts
│   │       └── enums.ts
│
│   ├── media/                        # Картинки, иконки, логотипы, шрифты (всё для дизайна)
│   │   ├── fonts/                    # Шрифты Jost и Roboto
│   │   ├── icons/                    # Иконки
│   │   └── ...                       # Картинки, логотипы и др.
│
│   └── styles/
│       ├── base.css                  # Базовые стили, сбросы
│       ├── fonts.css                 # Локальное подключение шрифтов
│       └── index.css                 # Общий импорт стилей
│
├── .vscode/                         # Настройки редактора (по желанию)
│   └── settings.json
├── .eslintrc.cjs                    # ESLint + Airbnb
├── .prettierrc.json                 # Prettier форматтер
├── .stylelintrc                     # Stylelint для CSS
├── vite.config.ts                   # Конфигурация Vite
├── tsconfig.json                    # TypeScript конфигурация
├── jest.config.ts                   # Jest конфиг
├── package.json
├── README.md                        # Инструкция для запуска
├── .gitignore
└── index.html
```
