# MostlyGoodMetrics Analytics Skill

You are an expert at instrumenting applications with MostlyGoodMetrics, a simple analytics platform for products that ship. You know how to install SDKs, track events, build funnels, set up retention analysis, and use the MCP tools and CLI.

## When to activate

- User asks to "add analytics" or "add tracking" to their app
- User asks about funnels, retention, A/B tests, or analytics data
- User asks to check their analytics, metrics, or dashboards
- User asks about event naming or analytics best practices
- MCP tools with the `mgm_` prefix are available in the session

---

## SDK Installation & Initialization

Detect the app platform from the codebase (check for `package.json`, `Podfile`, `Package.swift`, `build.gradle.kts`, `pubspec.yaml`, etc.) and install the appropriate SDK.

### JavaScript / TypeScript (Web)

```bash
npm install @mostly-good-metrics/javascript
```

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/javascript';

MostlyGoodMetrics.configure({
  apiKey: 'MGM_API_KEY',
  environment: 'production', // or 'development'
});

// Track events
MostlyGoodMetrics.track('button_clicked', {
  button_id: 'submit',
  page: '/checkout',
});

// Identify users
MostlyGoodMetrics.identify('user_123', {
  email: 'user@example.com',
  name: 'Jane Doe',
});

// Set super properties (attached to all subsequent events)
MostlyGoodMetrics.setSuperProperties({ plan: 'pro' });
```

**Where to initialize:** In your app's entry point (`main.ts`, `index.ts`, `App.tsx`, etc.) before any tracking calls.

### React Native

```bash
npm install @mostly-good-metrics/react-native
```

```typescript
import { MostlyGoodMetrics } from '@mostly-good-metrics/react-native';

// Initialize early in App.tsx or index.js
await MostlyGoodMetrics.configure({
  apiKey: 'MGM_API_KEY',
  environment: 'production',
  appVersion: '1.2.0', // enables install/update tracking
});

MostlyGoodMetrics.track('feature_used', { feature: 'dark_mode' });
MostlyGoodMetrics.identify('user_123');
```

**Where to initialize:** Top of `App.tsx` or `index.js`, before the root component renders. The SDK automatically tracks `$app_opened`, `$app_backgrounded`, `$app_installed`, and `$app_updated`.

### Swift (iOS / macOS)

**Swift Package Manager** — add to `Package.swift` or via Xcode > File > Add Package Dependencies:

```
https://github.com/Mostly-Good-Metrics/mostly-good-metrics-swift-sdk.git
```

From version: `1.0.0`

```swift
import MostlyGoodMetrics

// In AppDelegate.application(_:didFinishLaunchingWithOptions:) or @main App init
MostlyGoodMetrics.configure(apiKey: "MGM_API_KEY")

// Track events
MostlyGoodMetrics.shared?.track("purchase_completed", properties: [
    "product_id": "sku_123",
    "price": 29.99
])

// Identify users
MostlyGoodMetrics.shared?.identify(userId: "user_123", profile: [
    "email": "user@example.com",
    "name": "Jane Doe"
])

// Set super properties
MostlyGoodMetrics.shared?.setSuperProperties(["plan": "pro"])
```

**Where to initialize:** In `AppDelegate.application(_:didFinishLaunchingWithOptions:)` for UIKit apps, or in the `init()` of your `@main App` struct for SwiftUI. The SDK automatically tracks `$first_open`, `$app_updated`, `$app_opened`, `$app_backgrounded`.

### Android (Kotlin)

**Gradle** — add to your module's `build.gradle.kts`:

```kotlin
implementation("com.github.Mostly-Good-Metrics:mostly-good-metrics-android-sdk:1.0.0")
```

Also add JitPack to your `settings.gradle.kts` repositories:

```kotlin
dependencyResolutionManagement {
    repositories {
        maven { url = uri("https://jitpack.io") }
    }
}
```

```kotlin
import com.mostlygoodmetrics.sdk.MostlyGoodMetrics

// In your Application.onCreate()
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        MostlyGoodMetrics.configure(this, "MGM_API_KEY")
    }
}

// Track events anywhere
MostlyGoodMetrics.track("button_clicked", mapOf("button_name" to "submit"))

// Identify users
MostlyGoodMetrics.identify("user_123")

// Set super properties
MostlyGoodMetrics.setSuperProperties(mapOf("plan" to "pro"))
```

**Where to initialize:** In your custom `Application` class's `onCreate()`. Register it in `AndroidManifest.xml`. The SDK automatically tracks lifecycle events.

### Flutter (Dart)

**pubspec.yaml:**

```yaml
dependencies:
  mostly_good_metrics_flutter: ^1.0.0
```

```dart
import 'package:mostly_good_metrics_flutter/mostly_good_metrics_flutter.dart';

// In main() or initState of your root widget
await MostlyGoodMetrics.configure(
  MGMConfiguration(apiKey: 'MGM_API_KEY'),
);

// Track events
MostlyGoodMetrics.track('feature_used', properties: {'feature': 'export'});

// Identify users
MostlyGoodMetrics.identify('user_123');

// Set super properties
MostlyGoodMetrics.setSuperProperties({'plan': 'pro'});
```

**Where to initialize:** In `main()` after `WidgetsFlutterBinding.ensureInitialized()`, or in `initState()` of your root widget. The SDK automatically tracks lifecycle events.

### Capacitor (Ionic)

```bash
npm install @AnotherPillow/mostly-good-metrics-capacitor
npx cap sync
```

```typescript
import { MostlyGoodMetrics } from '@AnotherPillow/mostly-good-metrics-capacitor';

await MostlyGoodMetrics.configure({ apiKey: 'MGM_API_KEY' });
MostlyGoodMetrics.track('page_viewed', { page: '/home' });
```

---

## API Key

The API key format is `mgm_live_xxx...` (production) or `mgm_test_xxx...` (development). Store it as an environment variable or build config, never hardcoded in committed source code. Common patterns:

- **JS/TS:** `process.env.MGM_API_KEY` or `import.meta.env.VITE_MGM_API_KEY`
- **Swift:** Xcode build configuration or `.xcconfig` file
- **Android:** `BuildConfig` field via `build.gradle.kts`
- **Flutter:** `--dart-define=MGM_API_KEY=xxx` or `.env` with `flutter_dotenv`

---

## Event Naming Conventions

Follow these rules for consistent, queryable event names:

| Rule | Example | Why |
|------|---------|-----|
| Use `snake_case` | `signup_completed` | Consistent across platforms |
| Use past tense for completed actions | `purchase_completed` | Distinguishes intent from completion |
| Use present tense for states | `page_viewed`, `feature_used` | Describes what happened |
| Noun + verb pattern | `project_created`, `invite_sent` | Reads naturally in queries |
| `$` prefix = auto-tracked | `$app_opened`, `$first_open` | SDK-managed, don't create manually |

**Good names:**
```
signup_started          signup_completed
onboarding_step_completed
feature_used            upgrade_clicked
purchase_completed      subscription_created
invite_sent             project_created
search_performed        item_added_to_cart
```

**Bad names:**
```
click                   ← too vague
SignUpCompleted          ← wrong case
user-signed-up          ← wrong separator
event1                  ← meaningless
```

### Properties

Use properties for context, not separate event names:

```typescript
// GOOD: one event with properties
MostlyGoodMetrics.track('button_clicked', {
  button: 'hero_cta',
  page: 'pricing',
  variant: 'annual',
});

// BAD: separate events for each button
MostlyGoodMetrics.track('hero_cta_clicked');
MostlyGoodMetrics.track('pricing_button_clicked');
```

Reserved property prefixes:
- `$` — auto-populated by SDKs (`$device_type`, `$sdk`, `$version`, `$source`)

---

## Recommended Events by App Type

### SaaS Web App

```
signup_started
signup_completed
onboarding_step_completed    { step: 'profile' | 'team' | 'first_project' }
feature_used                 { feature: 'dashboard' | 'reports' | 'export' }
page_viewed                  { page: '/settings', referrer: '/dashboard' }
upgrade_clicked              { plan: 'pro', source: 'banner' | 'settings' }
subscription_created         { plan: 'pro', interval: 'monthly' | 'annual' }
invite_sent                  { role: 'admin' | 'member' }
invite_accepted
search_performed             { query_length: 5, results_count: 12 }
feedback_submitted           { type: 'bug' | 'feature' | 'general' }
api_key_created
project_created
```

### Mobile App (iOS / Android)

```
$first_open                  (auto-tracked by SDK)
$app_opened                  (auto-tracked by SDK)
$app_backgrounded            (auto-tracked by SDK)
$app_updated                 (auto-tracked by SDK)
onboarding_completed         { steps_viewed: 3 }
signup_completed             { method: 'email' | 'apple' | 'google' }
feature_used                 { feature: 'camera' | 'filters' | 'share' }
purchase_completed           { product_id: 'premium', price: 9.99 }
notification_opened          { campaign: 'welcome_day3' }
share_clicked                { content_type: 'photo' | 'profile' }
review_prompted              { action: 'accepted' | 'dismissed' | 'later' }
permission_requested         { type: 'notifications' | 'camera' | 'location' }
permission_granted           { type: 'notifications' }
tab_switched                 { tab: 'home' | 'search' | 'profile' }
```

### E-commerce

```
product_viewed               { product_id: 'sku_123', category: 'shoes', price: 89.99 }
product_searched             { query: 'running shoes', results_count: 24 }
add_to_cart                  { product_id: 'sku_123', quantity: 1 }
remove_from_cart             { product_id: 'sku_123' }
cart_viewed                  { item_count: 3, total: 199.97 }
checkout_started             { item_count: 3, total: 199.97 }
checkout_step_completed      { step: 'shipping' | 'payment' | 'review' }
coupon_applied               { code: 'SAVE20', discount: 20.00 }
purchase_completed           { order_id: 'ord_123', total: 179.97, item_count: 3 }
review_submitted             { product_id: 'sku_123', rating: 5 }
wishlist_added               { product_id: 'sku_123' }
```

### Developer Tool / API Product

```
signup_completed
api_key_created
first_api_call               { endpoint: '/v1/events' }
sdk_installed                { platform: 'javascript' | 'swift' | 'android' }
documentation_viewed         { page: '/quickstart', duration_seconds: 45 }
integration_connected        { type: 'slack' | 'github' | 'webhook' }
usage_limit_warning          { usage_percent: 80 }
plan_upgraded                { from: 'free', to: 'pro' }
support_ticket_created       { category: 'billing' | 'technical' }
```

---

## Funnel Templates

Create funnels to track conversion through multi-step flows. Each funnel needs ordered steps (event names) and a conversion window.

### Signup to Activation

Track how many signups become active users.

```
Steps:
  1. signup_completed        → "Signed Up"
  2. project_created         → "Created Project"
  3. api_key_created         → "Created API Key"
  4. first_event_received    → "Sent First Event"

Conversion window: 7 days
```

**CLI:**
```bash
mgm funnels create --name "Signup → Activation" \
  --steps "signup_completed,project_created,api_key_created,first_event_received" \
  --window 7d
```

**MCP:**
```
mgm_create_funnel({
  name: "Signup → Activation",
  steps: [
    { event_name: "signup_completed", name: "Signed Up" },
    { event_name: "project_created", name: "Created Project" },
    { event_name: "api_key_created", name: "Created API Key" },
    { event_name: "first_event_received", name: "Sent First Event" }
  ],
  conversion_window_minutes: 10080,
  date_range: "30d"
})
```

### Onboarding to Value

Track how onboarded users reach their "aha moment."

```
Steps:
  1. onboarding_completed    → "Finished Onboarding"
  2. feature_used            → "Used Core Feature"
  3. invite_sent             → "Invited Teammate"

Conversion window: 14 days
```

### Trial to Paid

Track free-to-paid conversion.

```
Steps:
  1. signup_completed        → "Signed Up"
  2. feature_used            → "Used Product"
  3. upgrade_clicked         → "Clicked Upgrade"
  4. subscription_created    → "Subscribed"

Conversion window: 30 days
```

### E-commerce Purchase

```
Steps:
  1. product_viewed          → "Viewed Product"
  2. add_to_cart             → "Added to Cart"
  3. checkout_started        → "Started Checkout"
  4. purchase_completed      → "Purchased"

Conversion window: 7 days
```

### Mobile Onboarding

```
Steps:
  1. $first_open             → "Installed App"
  2. signup_completed        → "Created Account"
  3. onboarding_completed    → "Finished Onboarding"
  4. feature_used            → "Used Core Feature"

Conversion window: 7 days
```

---

## Retention Patterns

Retention analysis tracks whether users come back after their first interaction.

### Weekly User Retention

Are users returning each week?

```
Cohort event:     signup_completed
Retention event:  (any event)
Grain:            week
Retention days:   1, 7, 14, 30
Date range:       90 days
```

**CLI:**
```bash
mgm retention create --name "Weekly Retention" \
  --cohort-event "signup_completed" \
  --grain week --days 1,7,14,30 \
  --range 90d
```

**MCP:**
```
mgm_create_retention({
  name: "Weekly Retention",
  cohort_event: "signup_completed",
  retention_event: null,
  cohort_grain: "week",
  retention_days: [1, 7, 14, 30],
  date_range: "90d"
})
```

### Feature-Specific Retention

Do users who try a feature keep using it?

```
Cohort event:     feature_used (first time)
Retention event:  feature_used
Grain:            week
Retention days:   7, 14, 30, 60
Date range:       90 days
```

### Purchase Repeat Rate

Do buyers come back to purchase again?

```
Cohort event:     purchase_completed
Retention event:  purchase_completed
Grain:            month
Retention days:   30, 60, 90
Date range:       180 days
```

---

## Full Workflow: "Add analytics to my app"

When a user asks you to add analytics, follow this end-to-end workflow:

### Step 1: Check authentication

If MCP tools are available:
```
mgm_whoami → check if logged in
```
If not logged in, guide them to authenticate:
```
mgm_login → sends magic link email, waits for auth
```

If no MCP tools, guide them to sign up at https://app.mostlygoodmetrics.com.

### Step 2: Get or create a project

```
mgm_list_projects → check for existing project
```
If none exists:
```
mgm_create_project({ name: "My App" })
```

### Step 3: Get an API key

```
mgm_create_api_key({ name: "Production" })
```
Save the returned key — it's only shown once.

### Step 4: Detect the platform

Check the codebase for platform indicators:

| File | Platform |
|------|----------|
| `package.json` with `react-native` | React Native |
| `package.json` without `react-native` | JavaScript/TypeScript |
| `Package.swift` or `*.xcodeproj` | Swift (iOS/macOS) |
| `build.gradle.kts` with `android` | Android (Kotlin) |
| `pubspec.yaml` | Flutter |
| `capacitor.config.ts` | Capacitor |

### Step 5: Install the SDK

Use the installation instructions from the "SDK Installation" section above for the detected platform.

### Step 6: Initialize the SDK

Add initialization code to the app's entry point with the API key from Step 3.

### Step 7: Add event tracking

Identify the key user flows in the codebase and add tracking:

1. **Authentication flows** — `signup_started`, `signup_completed`, `login_completed`
2. **Core feature usage** — `feature_used` with properties
3. **Conversion points** — `upgrade_clicked`, `purchase_completed`
4. **Navigation** — `page_viewed` or `tab_switched`

Use the "Recommended Events" section above matched to the app type.

### Step 8: Add user identification

Find where the user logs in or signs up and add:

```typescript
MostlyGoodMetrics.identify('user_id', {
  email: user.email,
  name: user.name,
});
```

### Step 9: Set up funnels

Create at least one funnel to track the primary conversion flow:

```
mgm_create_funnel → set up the main conversion funnel
```

Use the funnel templates above matched to the app type.

### Step 10: Set up retention

```
mgm_create_retention → set up weekly retention analysis
```

### Step 11: Verify events are flowing

```
mgm_list_events → check that events are arriving
mgm_list_event_types → see event type breakdown
```

Or via CLI:
```bash
mgm events list
mgm events types
```

### Step 12: Report to the user

Summarize what was set up:
- SDK installed and initialized
- Events being tracked (list them)
- Funnels created
- Retention analysis configured
- Link to dashboard: `https://app.mostlygoodmetrics.com`

---

## MCP Tools Reference

When MCP tools are available (`mgm_*` prefix), use them for server-side operations:

| Tool | Use for |
|------|---------|
| `mgm_whoami` | Check authentication status |
| `mgm_list_projects` | List all projects |
| `mgm_create_project` | Create a new project |
| `mgm_create_api_key` | Generate an API key |
| `mgm_get_dashboard` | View stats and trends |
| `mgm_list_events` | See recent events |
| `mgm_list_event_types` | Event types with counts |
| `mgm_create_funnel` | Create conversion funnel |
| `mgm_execute_funnel` | Run funnel analysis |
| `mgm_create_retention` | Create retention analysis |
| `mgm_execute_retention` | Run retention analysis |
| `mgm_create_query` | Create saved query |
| `mgm_execute_query` | Run analytics query |
| `mgm_create_experiment` | Create A/B test |
| `mgm_start_experiment` | Start an experiment |
| `mgm_send_events` | Send test events |

---

## CLI Reference

When MCP tools are not available, use the CLI:

```bash
# Install
npm install -g @mostly-good-metrics/cli

# Auth
mgm login                    # Magic link auth
mgm whoami                   # Current user

# Projects
mgm projects list
mgm projects create "My App"

# Guided setup (creates project + key + installs SDK)
mgm init

# API Keys
mgm keys create "Production"

# View analytics
mgm dashboard                # Last 7 days
mgm dashboard --range 30d

# Events
mgm events list
mgm events types

# Funnels
mgm funnels create --name "Onboarding" \
  --steps "signup_completed,project_created,first_event" \
  --window 7d
mgm funnels execute <id>

# Retention
mgm retention create --name "Weekly" \
  --cohort-event "signup_completed" \
  --grain week --days 1,7,14,30

# Experiments
mgm experiments create --name "pricing_v2" \
  --variants "control,variant_a" \
  --goal "purchase_completed"
mgm experiments start <id>
```

---

## Ingestion Endpoint

Events are sent to:

```
POST https://ingest.mostlygoodmetrics.com/v1/events
Authorization: Bearer <API_KEY>
```

Payload:
```json
{
  "events": [
    {
      "name": "button_clicked",
      "user_id": "user_123",
      "timestamp": "2024-01-15T10:30:00Z",
      "properties": {
        "button_name": "signup"
      }
    }
  ]
}
```

The SDKs handle batching, retry, and compression automatically. You should almost never need to call this directly.

---

## Auto-tracked Events

All SDKs automatically track these lifecycle events (no code required):

| Event | When |
|-------|------|
| `$first_open` | First app launch after SDK installation |
| `$app_updated` | First launch after app version changes |
| `$app_opened` | App comes to foreground |
| `$app_backgrounded` | App goes to background |
| `$app_launched` | App process starts |

These use the `$` prefix and should not be created manually.

## Reserved Properties

Properties auto-populated by SDKs:

| Property | Value |
|----------|-------|
| `$sdk` | `javascript`, `react-native`, `swift`, `android`, `flutter` |
| `$version` | Current app version |
| `$device_type` | `phone`, `tablet`, `desktop`, `tv`, `watch`, `vision` |
| `$device_model` | e.g., `iPhone15,2`, `Pixel 8` |
| `$source` | `sdk`, `revenuecat`, `stripe` |

---

## User Identification

Call `identify()` after the user logs in or signs up. The SDK links the anonymous session to the identified user, enabling accurate unique user counts.

```typescript
// After login/signup
MostlyGoodMetrics.identify('user_123', {
  email: 'user@example.com',
  name: 'Jane Doe',
});
```

The SDK automatically:
- Generates an anonymous ID on first launch
- Links the anonymous ID to the identified user ID
- Deduplicates `$identify` calls (only sends if data changed or >24h since last call)
- Persists user ID across sessions

---

## Super Properties

Super properties are attached to every subsequent event. Use them for properties that rarely change:

```typescript
MostlyGoodMetrics.setSuperProperties({
  plan: 'pro',
  team_size: 5,
  region: 'us-east',
});
```

Common super properties:
- `plan` — user's subscription tier
- `role` — user's role (admin, member)
- `team_size` — organization size
- `app_theme` — light/dark mode preference
