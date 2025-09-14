TransitSNG Mobile - Flutter project ready for local build and CI.

Как собрать локально:
1. Установи Flutter SDK, Android SDK, Android Studio.
2. Открой терминал в папке mobile/ и выполни:
   flutter pub get
   flutter build apk --release --split-per-abi
3. APK окажутся в mobile/build/app/outputs/flutter-apk/

CI (GitHub Actions):
- В репозитории должен быть workflow .github/workflows/build-android.yml
- После пуша в main артефакты появятся в Actions -> job -> Artifacts.

Примечание:
- Если Flutter ругается, что android/ или ios/ не полные, выполни локально:
   flutter create -t app .
  Это создаст недостающие android/ и ios/ директории, оставив твой код в lib/.
