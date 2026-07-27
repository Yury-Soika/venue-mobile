# Venue Mobile

A fictional staff-operations mobile concept in the Venue product family. It demonstrates mobile-first access to bookings, events, guests, and operational context.

## Supported development targets

- Android and iOS through Expo development builds
- Web as a portfolio preview target

Expo 56 requires the project’s React packages to stay aligned. The manifest intentionally pins `react` and `react-dom` to `19.2.3` and uses `react-native-web ~0.21.0`.

## Install

```bash
npm ci --legacy-peer-deps
```

## Type check

```bash
npx tsc --noEmit
```

## Run one target at a time

```bash
npm run android
```

or:

```bash
npm run ios
```

or:

```bash
npm run web
```

The demo uses fictional sample data and mock authentication. “Try Demo” fills credentials; it does not represent production identity, security, notifications, biometrics, offline behavior, or deployment readiness.

## Release evidence

Native claims require a recorded test on named physical devices and OS versions. Before presenting the app as implemented, capture a short walkthrough and document which flows, APIs, notification states, and offline behaviors were actually tested.
