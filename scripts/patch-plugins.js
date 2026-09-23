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

// @capacitor-community/speech-recognition ships only a CocoaPods podspec, no
// Package.swift, so `npx cap sync ios` silently drops it from the SPM-based
// iOS build (this project has no Podfile / CocoaPods). Add one so it links
// like the other plugins. Its legacy ios/Plugin/Plugin.h+.m are pure
// Objective-C CAP_PLUGIN() bridging boilerplate, superseded by the @objc(...)
// annotation already on Plugin.swift (same pattern as text-to-speech's
// Package.swift-only plugin) — SPM targets can't mix Obj-C + Swift sources,
// so those two files are excluded rather than patched.
const speechRecognitionPackageSwift =
  "node_modules/@capacitor-community/speech-recognition/Package.swift";
const speechRecognitionPackageSwiftContent = `// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CapacitorCommunitySpeechRecognition",
    platforms: [.iOS(.v15)],
    products: [
        .library(
            name: "CapacitorCommunitySpeechRecognition",
            targets: ["SpeechRecognitionPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "8.0.0")
    ],
    targets: [
        .target(
            name: "SpeechRecognitionPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Plugin",
            exclude: ["Plugin.h", "Plugin.m"])
    ]
)
`;
if (fs.existsSync("node_modules/@capacitor-community/speech-recognition")) {
  const existing = fs.existsSync(speechRecognitionPackageSwift)
    ? fs.readFileSync(speechRecognitionPackageSwift, "utf8")
    : null;
  if (existing !== speechRecognitionPackageSwiftContent) {
    fs.writeFileSync(speechRecognitionPackageSwift, speechRecognitionPackageSwiftContent);
    console.log(`[patch-plugins] Added ${speechRecognitionPackageSwift}`);
  }
}
