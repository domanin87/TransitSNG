

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
