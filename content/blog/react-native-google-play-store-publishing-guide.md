---
title: "Publishing a React Native Application to the Google Play Store"
description: "A practical guide to preparing, signing, testing, and publishing a React Native application on the Google Play Store."
date: "2026-08-12"
coverImage: "/images/blog-10.png"
tags:
  - React Native
  - Android
  - Google Play Store
  - Mobile Development
  - Android App Bundle
  - Deployment
  - CI/CD

featured: false
readTime: 10 min read
category: "Development"
---

## Introduction

Developing a React Native application and running it successfully in
development mode is only the first part of the deployment process.

Before publishing the application on the Google Play Store, the Android
project needs to be configured for production, signed with a release key,
built as an Android App Bundle, tested, and submitted through Google Play
Console.

This guide explains how to:

- Prepare a React Native application for production.
- Configure the Android application identifier and version.
- Configure release signing.
- Generate a production `.aab` file.
- Create and configure a Google Play Console application.
- Configure the required store listing and policy information.
- Test the application using internal and closed testing.
- Understand Android permissions and Play Console declarations.
- Submit the application for production release.
- Troubleshoot common deployment issues.

> **Security note:** Never commit keystores, passwords, API keys, access
> tokens, or other sensitive credentials to Git. Store sensitive values
> securely and keep production credentials separate from development
> configuration.

---

## 1. Understand the Release Process

A React Native application normally goes through several stages before it
is publicly available:

```text
React Native Application
          │
          ▼
   Production Configuration
          │
          ▼
      Release Signing
          │
          ▼
     Generate .aab
          │
          ▼
      Local Testing
          │
          ▼
   Google Play Console
          │
          ▼
    Internal Testing
          │
          ▼
     Closed Testing
          │
          ▼
   Production Access
          │
          ▼
    Google Play Review
          │
          ▼
     Public Release
```

The exact testing requirements can depend on the type and age of the
developer account.

For newly created personal developer accounts, Google may require a
closed testing period before production access is available.

---

## 2. Prepare the React Native Application

Before creating the production build, make sure the application works
correctly without relying on development tooling.

The production application should use:

- Production API endpoints.
- Production environment variables.
- Production authentication configuration.
- Correct application name.
- Correct application icon.
- Correct splash screen.
- Production database/backend configuration.
- Production Firebase or third-party service configuration, if used.

The application should not depend on:

```text
Metro development server
localhost
Development API
Debug-only configuration
Local development credentials
```

For example, avoid using:

```text
http://localhost:8000/api
```

as the production API endpoint.

Instead, configure the application to use the production backend:

```text
https://api.example.com
```

The exact configuration depends on how environment variables and API
configuration are implemented in the React Native project.

---

## 3. Configure the Android Application ID

Every Android application published on Google Play needs a unique
application identifier.

A typical identifier looks like:

```text
com.example.bookingapp
```

In a React Native project, the Android configuration is generally
located under:

```text
android/
```

Depending on the React Native setup, the application ID can be configured
in:

```text
android/app/build.gradle
```

For example:

```gradle
android {
    defaultConfig {
        applicationId "com.example.bookingapp"
        minSdkVersion ...
        targetSdkVersion ...
        versionCode 1
        versionName "1.0.0"
    }
}
```

The `applicationId` uniquely identifies the Android application.

Choose it carefully because changing it after publishing effectively
creates a different application on Google Play.

---

## 4. Configure the Application Version

Android applications use two important version values:

```text
versionCode
versionName
```

### `versionCode`

This is an internal integer used by Google Play to identify application
versions.

For example:

```gradle
versionCode 1
```

When publishing an update:

```gradle
versionCode 2
```

The value must increase with every uploaded release.

### `versionName`

This is the user-facing version:

```gradle
versionName "1.0.0"
```

A later release might be:

```gradle
versionName "1.1.0"
```

A typical release sequence could be:

```text
1.0.0 → Initial release
1.1.0 → Feature update
1.1.1 → Bug fix
2.0.0 → Major release
```

---

## 5. Configure Production Permissions

Using a backend API does not normally require special Play Store
permissions.

For example, an application that only communicates with its backend
usually requires:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

The permission is commonly already present in React Native Android
projects.

Additional permissions are required only when the application accesses
specific device capabilities.

Examples include:

```text
Camera
Location
Microphone
Contacts
Photos / Media
Bluetooth
Calendar
Notifications
```

For example, an application that uses the camera may require:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

Do not request permissions that the application does not actually need.

Unnecessary permissions increase privacy concerns and can create
additional Play Console policy requirements.

---

## 6. Configure Notifications If Required

If the application uses push notifications, Android 13 and newer
versions require the notification permission to be requested at runtime.

The application may require:

```xml
<uses-permission
    android:name="android.permission.POST_NOTIFICATIONS" />
```

The React Native implementation must also request the permission from the
user when appropriate.

If the application does not use notifications, this permission is not
required.

---

## 7. Create a Release Signing Key

Android applications distributed through Google Play must be signed.

For a production application, create and configure a release signing
key.

The signing configuration normally uses a keystore containing:

```text
Keystore
    ├── Key alias
    ├── Store password
    └── Key password
```

The exact commands depend on the Android tooling being used.

A keystore should be treated as sensitive production infrastructure.

Do not commit it to Git:

```text
*.jks
*.keystore
```

should generally be excluded through `.gitignore`.

For example:

```text
# Android signing files
*.jks
*.keystore
```

---

## 8. Use Google Play App Signing

For a new application, Google Play App Signing is the recommended
approach.

The general model is:

```text
Developer
    │
    │ Upload key
    ▼
Google Play
    │
    │ App signing key
    ▼
Published Application
```

The upload key is used to upload the application bundle.

Google manages the application signing key used for distribution.

Keep the upload keystore and its credentials secure because losing access
to the required signing credentials can make future releases more
difficult to manage.

---

## 9. Configure Release Signing in React Native

The Android release configuration is commonly defined in:

```text
android/gradle.properties
android/app/build.gradle
```

A typical setup may contain values similar to:

```properties
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=<store-password>
MYAPP_UPLOAD_KEY_PASSWORD=<key-password>
```

The values should not be committed as plain-text production secrets.

A safer approach is to provide sensitive values through a secure local or
CI/CD environment.

The release build configuration can then reference those values.

For example:

```gradle
android {
    signingConfigs {
        release {
            storeFile file(MYAPP_UPLOAD_STORE_FILE)
            storePassword MYAPP_UPLOAD_STORE_PASSWORD
            keyAlias MYAPP_UPLOAD_KEY_ALIAS
            keyPassword MYAPP_UPLOAD_KEY_PASSWORD
        }
    }
}
```

The exact configuration may differ depending on the React Native and
Android Gradle setup.

---

## 10. Generate the Android App Bundle

Google Play uses the Android App Bundle format for new applications.

The production bundle normally has the extension:

```text
.aab
```

From the React Native project:

```bash
cd android
./gradlew bundleRelease
```

After a successful build, the bundle is normally generated under a path
similar to:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

The exact output location can vary depending on the project configuration.

The `.aab` file is the artifact that will be uploaded to Google Play
Console.

---

## 11. Test the Release Build Locally

Do not assume that an application working in development mode will work
correctly in production.

This is a common mistake.

Development mode can hide problems related to:

- Environment configuration.
- Production API URLs.
- Release signing.
- ProGuard/R8 configuration.
- Missing assets.
- Native dependencies.
- Network security configuration.
- Authentication configuration.
- Push notifications.

Install and test the release build on a physical Android device.

Verify:

```text
Application launches
Login works
API requests work
Booking flow works
Images load
Navigation works
Notifications work
Logout works
Error handling works
Application works without Metro
```

Most importantly, disconnect the development environment and verify that
the application can operate independently.

---

## 12. Create a Google Play Console Account

To publish the application, create a Google Play Developer account.

The account requires registration and identity verification.

Google currently charges a one-time registration fee for a developer
account.

There are different account types, including:

```text
Personal
Organization
```

Choose the account type appropriate for the application and its ownership.

Complete the required verification before attempting to publish the
application.

---

## 13. Create the Application in Play Console

After creating the developer account:

```text
Google Play Console
        │
        ▼
    Create App
```

You will provide information such as:

```text
App name
Default language
App or Game
Free or Paid
Contact email
```

The application will then appear in the Play Console dashboard.

---

## 14. Complete the Store Listing

The Play Store listing contains the information users see before
installing the application.

Typical requirements include:

```text
Application name
Short description
Full description
Application icon
Screenshots
Feature graphic
Category
Contact information
Privacy policy
```

The screenshots should represent the actual production application.

Do not use misleading screenshots or features that are not available in
the released application.

---

## 15. Configure the Privacy Policy

If the application collects user information or communicates with a
backend, you should have an appropriate privacy policy.

For a booking application, the backend may process information such as:

```text
Name
Email address
Phone number
Account information
Booking information
Location information, if applicable
Payment-related information, if applicable
```

The privacy policy should accurately describe what data is collected,
why it is collected, how it is used, and how it is handled.

Do not simply copy a generic privacy policy without checking whether it
actually matches the application's behavior.

---

## 16. Complete the Data Safety Section

Google Play Console requires developers to provide information about the
application's data practices.

You should review:

```text
Data collected
Data shared
Purpose of data collection
Data handling
Security practices
Deletion options
```

For example, if the application sends a user's name and booking details
to your backend, the Play Console declarations should accurately reflect
that behavior.

The Data Safety section should match the actual application and backend
implementation.

Do not declare that the application collects no data simply because the
data is stored on your own backend.

---

## 17. Configure App Access

If the application requires authentication, Google may need access to
the application's functionality during review.

For example:

```text
Login required
        │
        ▼
Google Play Review
        │
        ▼
Reviewer needs access
```

Provide the required test credentials or instructions through the
appropriate Play Console section when requested.

Do not provide personal user credentials.

Create dedicated reviewer/test credentials with only the access required
to test the application.

---

## 18. Complete Content Rating

Google Play requires applications to complete the content rating
questionnaire.

The answers determine the appropriate rating for the application.

The questionnaire should be answered based on the actual content and
functionality of the application.

---

## 19. Configure Target Audience

Specify the intended target audience of the application.

The information should accurately describe the users for whom the
application is designed.

Additional requirements may apply depending on whether children are
included in the target audience.

---

## 20. Upload the Application for Internal Testing

Do not immediately publish the first `.aab` to production.

Start with:

```text
Play Console
    → Test and release
        → Testing
            → Internal testing
```

Upload:

```text
app-release.aab
```

Add internal testers and distribute the application.

Use this stage to verify the actual Google Play-distributed build.

Test:

```text
Installation
Application startup
Login
API connectivity
Booking creation
Booking updates
Notifications
Deep links
Application updates
```

---

## 21. Use Closed Testing

After internal testing, use a closed testing track when required.

The flow becomes:

```text
Internal Testing
       │
       ▼
Closed Testing
       │
       ▼
Production Access
       │
       ▼
Production Release
```

For newly created personal developer accounts, Google currently requires
a closed test involving at least 12 opted-in testers for 14 continuous
days before production access can be requested.

The exact requirements should always be checked in the Play Console
because Google can change its developer requirements.

---

## 22. Create a Production Release

Once the application satisfies the required testing and Play Console
requirements:

```text
Play Console
    → Test and release
        → Production
            → Create new release
```

Select or upload the production `.aab`.

Review:

```text
Version
Release notes
Countries / regions
App bundle
Policy status
Store listing
```

Then submit the release for review.

---

## 23. Google Play Review

Google reviews the application before making it publicly available.

Possible outcomes include:

```text
Approved
Rejected
Additional information requested
```

If the application is rejected, read the exact policy issue and fix the
underlying problem rather than repeatedly resubmitting the same build.

Common issues can involve:

- Privacy policy.
- Data Safety declarations.
- App access.
- Permissions.
- Misleading store listing information.
- Restricted functionality.
- Broken application functionality.
- Incomplete reviewer instructions.

---

## 24. Updating the Application

After the first release, future releases follow a simpler process.

For example:

```text
Code changes
     │
     ▼
Increase versionCode
     │
     ▼
Update versionName if required
     │
     ▼
Generate new .aab
     │
     ▼
Test
     │
     ▼
Upload to Play Console
     │
     ▼
Release update
```

Remember that `versionCode` must increase for every uploaded release.

Example:

```gradle
versionCode 1
versionName "1.0.0"
```

Next release:

```gradle
versionCode 2
versionName "1.0.1"
```

---

## 25. Recommended Release Checklist

Before publishing the application, verify:

```text
React Native
├── Production API configured
├── Production environment configured
├── No localhost URLs
├── No development-only configuration
└── Production functionality tested

Android
├── Correct applicationId
├── Correct versionCode
├── Correct versionName
├── Release signing configured
├── Keystore secured
└── Release build tested

Google Play Console
├── Developer account verified
├── Application created
├── Store listing completed
├── Screenshots uploaded
├── Privacy policy configured
├── Data Safety completed
├── Content rating completed
├── Target audience completed
└── App access configured if required

Testing
├── Internal testing completed
├── Closed testing completed if required
├── Real device testing completed
└── Production API verified

Release
├── .aab generated
├── .aab uploaded
├── Release notes added
├── Countries / regions configured
└── Production release submitted
```

---

## 26. Common Problems

### API works in development but not in release

Check:

```text
Production API URL
Environment variables
HTTPS configuration
Authentication tokens
Network security configuration
Backend CORS / server configuration
```

Do not assume that a successful development request means the release
application will use the same configuration.

---

### Application requires Metro after installation

This usually indicates that a development build was installed or the
release configuration is incorrect.

A properly generated release application should contain the required
JavaScript bundle and should not require the Metro development server.

---

### Release build crashes but debug build works

Check:

```text
R8 / ProGuard rules
Native dependencies
Environment variables
Release-only configuration
Asset bundling
Android permissions
```

Test the release build locally before uploading it.

---

### Google Play rejects the application

Do not treat rejection as a generic deployment failure.

Read the specific policy violation provided by Google Play Console and
address that requirement.

The rejection reason determines what needs to change.

---

## Conclusion

Publishing a React Native application is not simply a matter of uploading
the project to Google Play.

The complete process is:

```text
Develop
   ↓
Configure production environment
   ↓
Configure Android release
   ↓
Configure signing
   ↓
Generate .aab
   ↓
Test release build
   ↓
Create Play Console application
   ↓
Complete store and policy information
   ↓
Internal testing
   ↓
Closed testing if required
   ↓
Production access
   ↓
Upload .aab
   ↓
Google Play review
   ↓
Publish
```

The most important distinction is between **development mode** and the
actual **production release build**. The application must be independently
functional, correctly signed, connected to the production backend, and
compliant with Google Play's current requirements before it is submitted.

For an application that primarily communicates with a backend API, the
backend itself does not require a special Play Store permission. Android
permissions are determined by the device capabilities the application
actually accesses, while Play Console declarations describe the
application's data collection, privacy, and other policy requirements.
