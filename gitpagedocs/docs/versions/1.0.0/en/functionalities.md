# Functionalities

## Authentication

- Sign-up and login with email and password (Firebase Authentication).
- Password policy: at least 8 characters with uppercase, lowercase, number, and symbol.
- Password change with reauthentication.
- Each registered user is a **client**; their `uid` is the `clientId` of all their data.
- Routes protected by `RequireAuth` and `RequireGuest`.

## Connections

- Create, list (real time), rename, and delete.
- When a connection is deleted, the `cleanupDeletedConnection` Cloud Function removes its contacts and messages.

## Contacts

- Name and phone per connection; the phone is normalized (e.g. `+55 (11) 99999-8888` → `+5511999998888`) and validated.
- When a contact is deleted, the `detachDeletedContact` Cloud Function removes it from message recipients.

## Broadcast

- Select one or more contacts (search and "select all").
- **Send now**: the message is saved as `sent` with the server time (simulated delivery).
- **Schedule**: the message stays `scheduled` until the chosen time, which must be in the future.
- **Automatic dispatch**: the `dispatchScheduledMessages` Cloud Function runs every minute and switches to `sent` every message whose time has come, even with the app closed. The update shows up on screen in real time.
- **All / Sent / Scheduled** filters with counters.
- Editing: scheduled messages can change text, contacts, and time (or be sent now); sent messages can only change text and contacts.
- Deletion with confirmation.

## Experience

- Interface in Portuguese, English, and Spanish (`?lang=en` also works).
- Light and dark theme.
- Responsive layout (full-screen dialogs on mobile).
- Feedback through notifications and loading, error, and empty states.
