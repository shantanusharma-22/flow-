// Top-level build file for Flow Android Kotlin Player
plugins {
    id("com.android.application") version "8.3.1" apply false
    id("org.jetbrains.kotlin.android") version "1.9.23" apply false
}

tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}
