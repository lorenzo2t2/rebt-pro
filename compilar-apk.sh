#!/usr/bin/env bash
# Compila la APK de REBT Pro (WebView con la app dentro, sin internet).
# Uso:  ./compilar-apk.sh          -> deja movil/REBT-Pro.apk
# Cada ejecución sube el número de versión.
set -e
cd "$(dirname "$0")"
export ANDROID_HOME="/c/Users/enzov/AppData/Local/Android/sdk"

G=android-app/app/build.gradle.kts
CODE=$(grep -o 'versionCode = [0-9]*' $G | grep -o '[0-9]*$')
NAME=$(grep -o 'versionName = "[^"]*"' $G | sed 's/.*"\(.*\)"/\1/')
NEWCODE=$((CODE + 1))
NEWNAME=$(node -e "console.log(require(\"./app/version.json\").version)")
cp $G /tmp/build.gradle.kts.bak
sed -i "s/versionCode = $CODE/versionCode = $NEWCODE/; s/versionName = \"$NAME\"/versionName = \"$NEWNAME\"/" $G
trap 'cp /tmp/build.gradle.kts.bak '"$G"'; echo "No se pudo compilar: versión sin cambios."' ERR

rm -rf android-app/app/src/main/assets
mkdir -p android-app/app/src/main/assets
cp -r app/. android-app/app/src/main/assets/
rm -f android-app/app/src/main/assets/sw.js   # en la APK no hace falta service worker

(cd android-app && ./gradlew --no-daemon assembleRelease)

mkdir -p movil
cp android-app/app/build/outputs/apk/release/app-release.apk movil/REBT-Pro.apk
trap - ERR
echo "Listo: versión $NEWNAME -> movil/REBT-Pro.apk"
