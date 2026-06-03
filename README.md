# GameHub Forum

Autor: Andrii K.  
Klasa: 4cT, grupa 1  
Szkoła: CKZiU Nr 2 w Raciborzu "Mechanik"  
Projekt edukacyjny wykonany przy wsparciu Yuki S.A.

## 1. Opis projektu

GameHub Forum to nowoczesny portal społecznościowy dla graczy, stworzony jako kompletna aplikacja Full Stack w technologii React 19 + Vite oraz Node.js + Express.js. System umożliwia rejestrację użytkowników, logowanie, publikowanie tematów, komentowanie, polubienia, wyszukiwanie treści oraz administrację.

## 2. Cele projektu

Celem projektu jest demonstracja umiejętności tworzenia aplikacji Full Stack, wykorzystania REST API, bazy danych MongoDB, autoryzacji JWT, bezpiecznego haszowania haseł bcrypt oraz responsywnego interfejsu w języku polskim.

## 3. Technologie

- Frontend: React 19, Vite, React Router, Axios, Bootstrap, react-icons, react-toastify.
- Backend: Node.js, Express.js.
- Baza danych: MongoDB + Mongoose.
- Bezpieczeństwo: JWT, bcrypt, CORS, walidacja podstawowa, ochrona tras.
- Dodatkowo: dotenv, multer, concurrently, nodemon.

## 4. Funkcjonalności

### Użytkownik

- Rejestracja i logowanie.
- Symulacja odzyskiwania hasła przez endpoint REST API.
- Profil użytkownika z edycją nazwy, opisu i avatara.
- Tworzenie, przeglądanie oraz usuwanie własnych tematów.
- Komentarze do tematów.
- System polubień tematów i komentarzy.
- Wyszukiwarka tematów.
- Ranking użytkowników na podstawie punktów.

### Forum

- Kategorie forum z ikonami i kolorami.
- Widok najnowszych tematów.
- Filtrowanie tematów po kategorii.
- Liczniki wyświetleń, komentarzy i polubień.

### Administrator

- Panel administratora pod ścieżką `/admin`.
- Statystyki liczby użytkowników, tematów, komentarzy i kategorii.
- Lista użytkowników.
- Blokowanie/odblokowywanie kont.
- Zmiana roli użytkownika.
- Zarządzanie kategoriami przez REST API.

### UI/UX

- Polski interfejs.
- Responsywny układ Bootstrap.
- Dark mode przechowywany w `localStorage`.
- Nowoczesne karty, hero section, sticky navbar i stopka.

## 5. Struktura katalogów

```txt
.
├── backend
│   ├── src
│   │   ├── config       # konfiguracja MongoDB
│   │   ├── controllers  # logika endpointów
│   │   ├── middleware   # JWT, admin, upload
│   │   ├── models       # User, Topic, Comment, Category, Like, Notification
│   │   ├── routes       # REST API
│   │   ├── scripts      # dane demonstracyjne
│   │   └── utils        # narzędzia JWT
│   └── package.json
├── frontend
│   ├── src
│   │   ├── api          # klient Axios
│   │   ├── components   # navbar, footer, karty, protected route
│   │   ├── context      # auth i dark mode
│   │   └── pages        # widoki aplikacji
│   └── package.json
├── package.json
└── README.md
```

## 6. Instalacja

Wymagania lokalne:

- Node.js 20 lub nowszy.
- MongoDB uruchomione lokalnie albo adres do bazy MongoDB Atlas.

Kroki:

```bash
git clone <adres-repozytorium>
cd yukisa-gamehub-forum
npm install
npm run install:all
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Jeśli używasz MongoDB Atlas, zmień `MONGO_URI` w pliku `backend/.env`.

## 7. Dane demonstracyjne

Po skonfigurowaniu `.env` uruchom:

```bash
npm run seed
```

Seeder tworzy przykładowe kategorie, tematy, komentarze, polubienia, powiadomienie oraz konta:

| Rola | E-mail | Hasło |
| --- | --- | --- |
| Administrator | `admin@gamehub.pl` | `admin123` |
| Użytkownik | `lis@gamehub.pl` | `test1234` |
| Użytkownik | `retro@gamehub.pl` | `test1234` |

## 8. Uruchomienie aplikacji

Uruchom frontend i backend jednocześnie:

```bash
npm run dev
```

Adresy:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health check: `http://localhost:5000/api/health`

Możesz też uruchomić części oddzielnie:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

## 9. Najważniejsze endpointy REST API

| Metoda | Endpoint | Opis |
| --- | --- | --- |
| POST | `/api/auth/register` | Rejestracja |
| POST | `/api/auth/login` | Logowanie |
| GET | `/api/auth/me` | Dane aktualnego użytkownika |
| POST | `/api/auth/forgot-password` | Symulacja resetu hasła |
| GET | `/api/categories` | Lista kategorii |
| GET | `/api/topics?q=fraza` | Lista i wyszukiwanie tematów |
| POST | `/api/topics` | Tworzenie tematu, wymagany JWT |
| GET | `/api/topics/:id` | Szczegóły tematu z komentarzami |
| PUT | `/api/topics/:id` | Edycja tematu autora lub admina |
| DELETE | `/api/topics/:id` | Usunięcie tematu autora lub admina |
| POST | `/api/topics/:id/like` | Przełącz polubienie tematu |
| POST | `/api/comments/topic/:topicId` | Dodaj komentarz |
| POST | `/api/comments/:id/like` | Przełącz polubienie komentarza |
| GET | `/api/admin/stats` | Statystyki admina |
| GET | `/api/admin/users` | Lista użytkowników admina |

## 10. Sprawdzanie projektu

```bash
npm run check
npm run check --prefix backend
npm run build --prefix frontend
```

## 11. Stopka wymagana w projekcie

Aplikacja zawiera stopkę:

> Autor: Andrii K., 4cT gr.1, CKZiU Nr 2 w Raciborzu Mechanik.  
> Projekt edukacyjny wykonany przy wsparciu Yuki S.A.

## 12. Publikacja na GitHub Pages i GitHub Actions

GitHub Pages może opublikować **tylko frontend statyczny** z katalogu `frontend/dist`. Backend Express i baza MongoDB nie działają na GitHub Pages, dlatego pełna wersja Full Stack wymaga dodatkowego hostingu API, np. Render, Railway, Fly.io, VPS albo innej usługi Node.js, oraz bazy MongoDB Atlas.

W repozytorium dodano dwa workflow GitHub Actions:

- `.github/workflows/ci.yml` — instaluje zależności, buduje frontend i sprawdza składnię backendu.
- `.github/workflows/frontend-pages.yml` — buduje frontend Vite i publikuje go na GitHub Pages.

### Kroki dla GitHub Pages

1. Wypchnij projekt na GitHub.
2. Wejdź w `Settings → Pages`.
3. W sekcji `Build and deployment` ustaw `Source: GitHub Actions`.
4. Jeśli backend jest już wdrożony, wejdź w `Settings → Secrets and variables → Actions → Variables` i dodaj zmienną:

```txt
VITE_API_URL=https://twoj-backend.example.com/api
```

5. Wykonaj push na gałąź `main` albo uruchom ręcznie workflow `Deploy frontend to GitHub Pages` przez zakładkę `Actions`.
6. Po udanym workflow GitHub pokaże adres strony w sekcji `Deploy to GitHub Pages`.

### Kroki dla backendu

Na hostingu Node.js ustaw:

```txt
Root directory: backend
Build command: npm install
Start command: npm start
```

Zmienne środowiskowe backendu:

```txt
PORT=5000
MONGO_URI=<adres MongoDB Atlas lub innej bazy MongoDB>
JWT_SECRET=<dlugie-bezpieczne-haslo>
CLIENT_URLS=<adres GitHub Pages frontendu>
```

Po wdrożeniu backendu wpisz jego adres jako `VITE_API_URL` w zmiennych GitHub Actions frontendu, np. `https://gamehub-api.onrender.com/api`.
