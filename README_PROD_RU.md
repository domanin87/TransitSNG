# TransitSNG — Инструкция по развертыванию (Postgres / Render / Docker)

Этот проект подготовлен для работы с PostgreSQL и содержит backend (Express + Sequelize) и frontend (React + Vite).
Ниже — пошаговая инструкция, как запустить проект в продакшн с использованием строки подключения Postgres.

## Предпосылки
- Docker & docker-compose (если используешь docker-compose)
- Node.js >= 18 (для локальной сборки фронтенда/бэкенда)
- Render account (опционально)

## Переменные окружения (обязательные)
- `DATABASE_URL` — строка подключения к Postgres, пример:
  `postgresql://transitsng:PASSWORD@HOST:5432/transitsng`
- `SECRET_KEY` — секрет для JWT
- (опционально) `REACT_APP_API_URL` — URL backend, указываем для фронтенда при сборке

## Проверка готовности к работе с Postgres
1. Миграция создаёт расширение `pgcrypto` для генерации UUID (используется `gen_random_uuid()`).
2. Убедись, что у пользователя базы есть права на создание расширений или предварительно создай расширение вручную: 
   ```sql
   CREATE EXTENSION IF NOT EXISTS pgcrypto;
   ```
   Если у тебя управляемая БД (например Render Postgres), обычно расширение уже доступно.

## Развёртывание через Docker Compose (локально или сервер)
1. В корне проекта есть `docker-compose.prod.yml`. Проверь и обнови переменные окружения внутри или используй `.env` файл.
2. Запуск:
   ```bash
   docker-compose -f docker-compose.prod.yml up --build -d
   ```
3. Выполни миграции и сиды (если нужно):
   ```bash
   docker-compose exec backend npx sequelize-cli db:migrate --env production
   docker-compose exec backend npx sequelize-cli db:seed:all --env production
   ```

## Развёртывание на Render
1. Backend сервис:
   - Build command: `npm install && npm run migrate && npm run start:prod` (либо `npm start` если настроен)
   - Environment: добавь `DATABASE_URL`, `SECRET_KEY`
2. Frontend сервис:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
   - Environment: `REACT_APP_API_URL` = `https://your-backend`

## Локальная проверка (dev)
1. Backend:
   ```bash
   cd backend
   npm install
   DATABASE_URL=postgresql://... SECRET_KEY=secret node server.js
   ```
2. Frontend (dev):
   ```bash
   cd frontend
   npm install
   REACT_APP_API_URL=http://localhost:3001 npm run start
   ```

## Частые проблемы и их решения
- `ERR_INVALID_ARG_TYPE` при инициализации Sequelize — проверь, установлена ли `DATABASE_URL` в окружении сервера.
- Ошибка с `pgcrypto` — если база не даёт прав на создание расширений, попроси администратора включить `pgcrypto` или создай вручную заранее.
- `undefined` в запросах фронтенда — нужно перед сборкой фронтенда установить `REACT_APP_API_URL` или задать переменную в Render.

## Контакты и дальнейшие доработки
- Я могу продолжить и: интегрировать карты/accurate distance API, подключить платёжный провайдер, улучшить админ UX, подготовить mobile skeleton.
- Скажи, какой модуль приоритетнее — и я продолжу дорабатывать прямо сейчас.

---
## Полный checklist для продакшн-развёртывания (резюме)
Дата сборки: 2025-09-22 15:58 UTC

1. Установи переменные окружения (DATABASE_URL, SECRET_KEY, REACT_APP_API_URL).
2. На PostgreSQL — проверь расширение pgcrypto (если нет прав, создай вручную).
3. Для Docker: запусти `docker-compose -f docker-compose.prod.yml up --build -d`.
4. Выполни миграции: `docker-compose exec backend npx sequelize-cli db:migrate --env production`.
5. Собери фронтенд (если не используешь docker-compose для фронтенда):
   - `cd frontend && REACT_APP_API_URL=https://your-backend npm ci && npm run build`
6. Настрой HTTPS (proxy/nginx/letsencrypt) — `nginx.front.conf` готов как шаблон.
7. Настрой periodic backups для Postgres и логи для backend.

## Дальше (фичи высокого приоритета)
- Интеграция точного расстояния: openrouteservice / Google Distance Matrix (потребует API key).
- Платёжный шлюз: Kaspi/Halyk (понадобятся merchant credentials).
- Push-уведомления и мобильная сборка (Expo/React Native).


## Мультиязычность (полная)
Данные новостей/вакансий/тарифов хранятся в БД в трёх вариантах: *_ru, *_kk, *_en. API возвращает локализованные поля в зависимости от query ?lang= или заголовка Accept-Language.

## Distance service (ORS)
Set ORS_API_KEY in .env to enable precise route distance via OpenRouteService. If not provided, fallback haversine will be used.

## Payments
Mock adapters for Kaspi and Halyk are provided under backend/services/payments/; they return demo transaction IDs. Replace with real adapters when you have credentials.

## Maps (Leaflet)
Frontend uses Leaflet for map rendering. Install dependencies in frontend:

```
cd frontend
npm install react-leaflet leaflet
```

If ORS_API_KEY is set, the backend will request route geometry and frontend will draw the polyline. Otherwise a straight line will be drawn.
