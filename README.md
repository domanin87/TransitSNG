
TransitSNG — Complete project with Live Tracking (generated 2025-09-14T15:47:55.048905Z)

What's included:
- backend/ : Express + Sequelize + Socket.IO, endpoints for tracking and toggle map_enabled for cargos
- frontend/ : React + Vite with Leaflet live map, Typeahead for cities, chat, admin skeleton, sample cards
- mobile/ : Flutter skeleton that can emit location via socket.io and REST

Quick local setup (docker-compose):
1. docker-compose up -d --build
2. cp backend/.env.example backend/.env (edit DATABASE_URL to postgres://postgres:rootpass@db:5432/transitsng)
3. cd backend && npm install && npm run migrate && npm start
4. cd frontend && npm install && npm run dev
5. mobile: open mobile in Flutter to run on device/emulator and set backendBase to your backend URL

Deploy to Render/GCP/others:
- Push repo to GitHub and connect to Render. Create managed Postgres and set DATABASE_URL.
- Create Backend Web Service (root: backend) and Static Site for frontend (root: frontend, build: npm install && npm run build, publish: frontend/dist).
- Set ALLOW_ORIGINS and JWT_SECRET env vars for backend.
- Run migrations: Render one-off job: node migrations/run_migrations.js

Notes about features:
- Map tracking: `map_enabled` on Cargo controls whether live map is visible for that cargo. Admin or payment flow should set that flag to true when user bought map tracking.
- Mobile app: skeleton uses geolocator and socket_io_client to send position updates to backend; treat as example — proper permissions & background handling required for production.
- RBAC: roles exist in users.role (user, carrier, moderator, accountant, admin, superadmin). Use middleware in backend to protect admin routes.

If you want, I will now:
- Commit and push these files to your GitHub repo (I cannot push without your credentials). I can provide the exact git commands to run.
- Prepare a ready `frontend/dist` build inside the archive so you can deploy frontend static without rebuilding.


------------------------------------------------------------------
ВАЖНО: сборка мобильных бинарных файлов (APK / AAB / IPA)
------------------------------------------------------------------
Я не могу собрать подписанные APK или IPA в этом окружении (нужны Android SDK, keystore, Xcode, Apple developer account).
Вместо этого в архив включены полноcтью готовые исходники Flutter приложения и детальные инструкции ниже,
чтобы ты мог собрать и подписать приложения локально или на CI.

ИНСТРУКЦИЯ: Android (debug APK и релизный AAB)
1. Установи Flutter SDK и Android SDK, Android Studio.
2. Открой проект `mobile/` в Android Studio или используйте CLI:
   flutter pub get
   flutter build apk --release   # соберёт release APK (unsigned)
   flutter build appbundle --release  # соберёт AAB
3. Для подписи релизного APK/AAB создай keystore:
   keytool -genkey -v -keystore ~/transitsng_keystore.jks -alias transitsng -keyalg RSA -keysize 2048 -validity 10000
4. В android/app/build.gradle добавь конфигурацию signingConfigs и release buildTypes.
5. Подпиши APK и загрузите AAB в Google Play Console.

ИНСТРУКЦИЯ: iOS (IPA через Xcode / Transporter)
1. На macOS установи Xcode и Flutter.
2. Открой ios/Runner.xcworkspace в Xcode.
3. Настрой подписывание: Apple Developer Team, provisioning profile, bundle id.
4. В Xcode: Product → Archive → Export → Upload to App Store (TestFlight).
5. Для CI можно использовать fastlane для автоматизации.

------------------------------------------------------------------
Замечание о дизайне, адаптивности и анимациях
------------------------------------------------------------------
- В frontend использованы CSS-трансформации и keyframes для плавных входов элементов.
- В мобильном приложении Flutter включены базовые анимации переходов между страницами (Hero, AnimatedContainer).
- Чтобы добиться "резинового" дизайна используйте responsive widgets (LayoutBuilder, MediaQuery) и flex layouts.
------------------------------------------------------------------

Если хочешь, я могу подготовить дополнительные CI скрипты (GitHub Actions) для сборки Android AAB и iOS (fastlane) — скажи, хочу ли ты это.



## CI: Автоматическая сборка мобильных приложений (GitHub Actions)

Добавлены два workflow:
- `.github/workflows/build-android.yml` — сборка Android (debug/release APK и AAB) на Ubuntu.
- `.github/workflows/build-ios.yml` — сборка iOS через fastlane на macOS runner (требуются Apple credentials и secrets).

### Необходимые секреты и конфигурация (GitHub repo -> Settings -> Secrets)
- Для Android:
  - KEYSTORE_BASE64 (опционально) — если вы хотите подписывать APK в CI, поместите keystore в base64 и используйте шаги подписи.
  - KEYSTORE_PASSWORD, KEY_ALIAS, KEY_PASSWORD — параметры keystore.
- Для iOS (fastlane):
  - APP_STORE_CONNECT_API_KEY — App Store Connect API Key (JSON contents) или use App Store Connect integration.
  - FASTLANE_USER — Apple ID email.
  - MATCH_PASSWORD — пароль для match/keychain если вы используете match.

### Как использовать
1. Push в ветку `main` — workflow запустятся автоматически.
2. После завершения зайдите в Actions → выберите job → Artifacts и скачайте собранные `*.apk` и `*.aab`.

> Примечание: сборка iOS требует действующей Apple Developer учётной записи и правильно настроенных provisioning profiles.
