// Patches Capacitor community plugins that ship with deprecated proguard-android.txt
// (incompatible with AGP 8+ / Gradle 9+). Runs automatically after npm install.
const fs = require("fs");
const files = [
  "node_modules/@capacitor-community/speech-recognition/android/build.gradle",
  "node_modules/@capacitor-community/text-to-speech/android/build.gradle",
];
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const orig = fs.readFileSync(f, "utf8");
  const patched = orig.replace(/proguard-android\.txt/g, "proguard-android-optimize.txt");
  if (patched !== orig) {
    fs.writeFileSync(f, patched);
    console.log(`[patch-plugins] Fixed ${f}`);
  }
}
