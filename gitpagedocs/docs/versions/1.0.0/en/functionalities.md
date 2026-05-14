# Functionalities

## Authentication

- **Login** with email and password via Firebase Auth
- **Registration** with strong password validation (min 8 chars, uppercase, lowercase, number, special)
- **Password change** dialog inside the dashboard
- **Route guards**: `PrivateRoute` blocks unauthenticated access, `GuestRoute` redirects logged-in users away from public pages

## Connections Management

- **Create** named connections (isolated workspaces)
- **Edit** connection name
- **Delete** with confirmation dialog
- Each connection is a multi-tenant data silo — users only see their own data

## Contacts Management

- **Add contacts** with name and phone per connection
- **Edit** and **delete** contacts
- Paginated listing with real-time Firestore listeners

## Messages & Broadcast

- **Send messages** to multiple contacts simultaneously
- **Schedule messages** for future delivery
- **Tabs**: All, Sent, Scheduled
- Real-time status tracking per message

## Internationalization (i18n)

- **3 languages**: Portuguese (PT), English (EN), Spanish (ES)
- JSON-based translation system in `src/shared/langs/`
- `LangProvider` with URL parameter sync (`?lang=pt`)
- `localStorage` persistence with fallback to `VITE_START_LANG`
- `LangSelector` component for runtime switching

## Theming

- **Dark** and **Light** mode support
- `ThemeToggleButton` component
- Persistence via `localStorage` with fallback to `VITE_START_THEME`
- URL parameter sync (`?theme=dark`)

## Security

- **Firestore Rules** enforce multi-tenant isolation via `clientId` validation
- Each user can only read/write their own connections, contacts, and messages
- Strong password policy enforced at registration

## Reusable Components

| Component | Purpose |
|---|---|
| `LangSelector` | Language dropdown selector |
| `ThemeToggleButton` | Dark/Light mode toggle |
| `LangThemeBar` | Combined lang + theme grid layout |
| `ActionButtonGroup` | Configurable button grid |
| `ConfirmDialog` | Reusable deletion confirmation |
| `PageHeader` | Standardized page header with icon and subtitle |
| `BrandLogo` | App logo with configurable sizes |
