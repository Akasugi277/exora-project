plugins {
    java
    application
    id("com.github.johnrengelman.shadow") version "8.1.1"
}

group = "com.exora"
version = "0.1.0"

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(21))
    }
}

application {
    mainClass.set("com.exora.jupiter.Main")
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("com.discord4j:discord4j-core:3.2.6")
    implementation("org.postgresql:postgresql:42.7.3")
    implementation("io.lettuce:lettuce-core:6.3.2.RELEASE")
    implementation("ch.qos.logback:logback-classic:1.4.14")
}

tasks.shadowJar {
    archiveClassifier.set("all")
    manifest {
        attributes["Main-Class"] = application.mainClass.get()
    }
}

tasks.build {
    dependsOn(tasks.shadowJar)
}
