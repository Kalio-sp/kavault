# KAVAULT ⚡️
> Personal Knowledge Engine & Gamified Learning Platform

KAVAULT — это полностековая платформа для организации знаний, системного изучения языков (Японский, Английский, Немецкий) и трекинга навыков. Проект выполнен в эстетике **Cyber-Obsidian** с акцентом на максимальный фокус, интервальное повторение (SRS), интерактивный граф знаний и соревновательную Task-систему с MMR.

---

## 🧭 Архитектура репозитория

```text
kavault/
├── kavault-frontend/      # Клиентское приложение (React 19 + Vite + TypeScript + Capacitor + Electron)
├── kavault-backend/       # Серверный API (NestJS + Prisma ORM + PostgreSQL + JWT)
├── scripts/               # Инструменты сборки, деплоя и запуска
│   ├── build/             # Скрипты сборки Android APK и Windows-пакетов
│   ├── deploy/            # Развёртывание на production-сервер Yandex Cloud
│   ├── dev/               # Локальный запуск и отладка (iOS, Web, Desktop)
│   └── git/               # Утилиты версионирования
├── .github/workflows/     # CI/CD автоматические сборки (Android, Windows, iOS)
├── docker-compose.yml     # Локальное окружение базы данных (Docker)
├── docker-compose.production.yml # Production стек (Frontend Nginx, Backend NestJS, Postgres)
├── server-config.json     # Динамическая конфигурация подключения клиентов
├── start.bat              # Быстрый запуск для локальной работы
└── deploy.bat             # Быстрый деплой на сервер в облаке
```

---

## ⚡️ Ключевой функционал

- 🇯🇵 **Изучение языков по уровням:**
  - Японский (N5–N1), Английский и Немецкий (A1–C2).
  - Аудирование, диктанты, квизы, интерактивные диалоги и карточки интервального повторения (SRS).
- 🏆 **Task-System & MMR:**
  - Начисление рейтинга за пройденный материал, соревновательные лиги от Новичка до Легенды, стрики и ачивки.
- 🕸 **Интерактивный граф знаний:**
  - 2D/3D визуализация ассоциативных связей между заметками, колодами и изученными темами.
- 📦 **Импорт и шеринг колод:**
  - Импорт колод из Anki (.apkg), Quizlet, CSV/JSON и отправка своих наборов друзьям по ссылкам.
- 💭 **Thoughts Hub:**
  - Чистое пространство для фиксации мыслей и заметок без лишнего шума.
- 📱 **Кроссплатформенность:**
  - **Web & iOS:** PWA / Safari с полноэкранным нативным режимом.
  - **Android:** Нативный APK через Capacitor.
  - **Windows:** Портативный десктопный клиент через Electron.

---

## 🛠 Стек технологий

* **Frontend:** React 19, TypeScript, Vite, Tailwind/Custom CSS, Lucide Icons, Capacitor, Electron.
* **Backend:** NestJS, TypeScript, Prisma ORM, Passport.js, JWT, Bcrypt.
* **База данных:** PostgreSQL 15 (Alpine).
* **Инфраструктура:** Docker, Docker Compose, Nginx (Reverse Proxy & Static Cache).

---

## 🚀 Быстрый старт

### 1. Клонирование и настройка
```bash
git clone https://github.com/Kalio-sp/kavault.git
cd kavault
cp .env.example .env
```

### 2. Запуск в режиме разработки (Windows)
Просто запустите файл `start.bat` в корне проекта или выполните:
```bash
# Бэкенд
cd kavault-backend
npm install
npm run start:dev

# Фронтенд
cd ../kavault-frontend
npm install
npm run dev
```

### 3. Развёртывание на продакшн-сервере
Для обновления production-сервера запустите `deploy.bat` или выполните:
```bash
docker compose -f docker-compose.production.yml up -d --build
```

---

## 🔒 Безопасность

* Все приватные переменные (`JWT_SECRET`, пароли БД) вынесены в файл `.env` и исключены из репозитория через `.gitignore`.
* Пароли пользователей хешируются с использованием `bcrypt` (10 раундов соли).
* Авторизация защищена ролевой моделью (`CREATOR` / `USER`) на базе асимметричных JWT токенов.

---

## 📄 Лицензия

Разработано для KAVAULT. Все права защищены © 2026.
