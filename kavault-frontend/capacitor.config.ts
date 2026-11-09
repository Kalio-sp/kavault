import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.kavault.app",
  appName: "KAVAULT",
  webDir: "dist",
  server: {
    // Используется для iOS и Android
    androidScheme: "https",
    iosScheme: "kavault",
  },
  ios: {
    contentInset: "always",
    preferredContentMode: "mobile",
    scheme: "KAVAULT",
  },
  plugins: {
    StatusBar: {
      style: "DARK",
      backgroundColor: "#09090b",
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#09090b",
      showSpinner: false,
    },
  },
};

export default config;
