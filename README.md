# GameStopDev — Forum Gamingowe

**Właściciel / Autor / Twórca:** Andrii Kondratiuk  
**Szkoła:** CKZiU NR.2 "Mechanik" w Raciborzu  
**Klasa:** 4cT, gr.1 — kierunek: technik informatyk  
**Zespół:** Dev S.A. | A.K.

## Opis projektu

GameStopDev to nowoczesne forum gamingowe stworzone jako kompletna aplikacja Full Stack. System umożliwia rejestrację użytkowników, logowanie, tworzenie wątków i odpowiedzi, system polubień, wyszukiwanie, ranking użytkowników oraz panel administratora.

## Technologie

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React 19, Vite, Tailwind CSS, React Router, Axios, Lucide Icons |
| Backend | Node.js, Express.js |
| Baza danych | SQLite + Sequelize ORM |
| Bezpieczeństwo | JWT, bcrypt, CORS |
| Dodatkowe | multer, react-hot-toast, concurrently, nodemon |

## Funkcjonalności

### Użytkownik
- Rejestracja i logowanie (JWT)
- Profil z edycją nazwy, opisu i avatara
- Tworzenie, przeglądanie i usuwanie wątków
- Odpowiedzi (komentarze) do wątków
- System polubień wątków i postów
- Wyszukiwarka wątków
- Ranking użytkowników

### Forum
- 9 kategorii gier (FPS, RPG, MMO, Strategiczne, Sportowe, Indie, Mobile, Retro, Ogólne)
- Przypinanie i zamykanie wątków
- Liczniki wyświetleń, komentarzy i polubień
- Paginacja

### Administrator
- Panel administratora (`/admin`)
- Statystyki forum
- Zarządzanie użytkownikami (role, blokowanie)
- Zarządzanie kategoriami (CRUD)

### UI/UX
- Polski interfejs
- Ciemny motyw gamingowy z neonowymi akcentami
- Responsywny layout (Tailwind CSS)
- Toast notifications

## Instalacja

### Wymagania
- Node.js 20+
- npm

### Kroki

```bash
git clone <adres-repozytorium>
cd GameStopDev
npm install
npm run install:all
cp server/.env.example server/.env
```

### Dane demonstracyjne

```bash
npm run seed
```

| Rola | E-mail | Hasło |
|------|--------|-------|
| Administrator | `admin@gamestopdev.pl` | `admin123` |
| Moderator | `mod@gamestopdev.pl` | `mod12345` |
| Użytkownik | `gamer@gamestopdev.pl` | `test1234` |
| Użytkownik | `retro@gamestopdev.pl` | `test1234` |

### Uruchomienie

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

## Wdrożenie na Windows 11 Pro VDS/VPS

1. Zainstalować Node.js (LTS) na Windows
2. Sklonować repo
3. `npm install && npm run install:all`
4. `cp server/.env.example server/.env`
5. `npm run seed` (opcjonalnie — dane demo)
6. `npm run build` (budowa frontendu)
7. `npm start` (uruchomienie serwera produkcyjnego)
8. Opcjonalnie: PM2 do zarządzania procesem

## Struktura projektu

```
GameStopDev/
├── client/          # Frontend React + Vite + Tailwind CSS
│   └── src/
│       ├── components/   # Header, Footer
│       ├── context/      # AuthContext
│       ├── pages/        # Home, Forum, Thread, Login, Register, Profile, Admin, Search, Ranking
│       └── services/     # API client (axios)
├── server/          # Backend Node.js + Express
│   ├── config/      # Konfiguracja bazy danych
│   ├── controllers/ # Logika biznesowa
│   ├── middleware/   # JWT auth, upload
│   ├── models/      # User, Category, Thread, Post, Like
│   ├── routes/      # REST API
│   └── server.js    # Entry point
├── package.json     # Root package (scripts)
└── README.md
```

## Stopka

> Autor: Andrii Kondratiuk, 4cT gr.1, CKZiU NR.2 "Mechanik" w Raciborzu.  
> Zespół: Dev S.A. | A.K.  
> © 2026 GameStopDev — Wszelkie prawa zastrzeżone.
