plugins { id("com.android.application") }

android {
    namespace = "es.rebtpro.app"
    compileSdk = 36
    defaultConfig {
        applicationId = "es.rebtpro.app"
        minSdk = 24
        targetSdk = 35
        versionCode = 5
        versionName = "1.8.0"
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("debug")
            isMinifyEnabled = false
        }
    }
}
dependencies { implementation("androidx.core:core:1.13.1") }
