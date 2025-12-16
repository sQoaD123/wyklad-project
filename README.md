## wyklad-projekt

Kompletna aplikacja webowa typu Full-Stack, stworzona jako projekt zaliczeniowy. Umożliwia użytkownikom publikowanie artykułów, komentowanie, prowadzenie dyskusji (wątki komentarzy) oraz ocenianie treści.

**Zespół**

- Bohdan Demydiuk
- Mikchail Kocherov
- Grupa: 2

**Linki do projektu**

- Działająca aplikacja (Render): https://wyklad-project.onrender.com/
- Strona opisowa (GitHub Pages): [LINK DO GITHUB PAGES]
- Prezentacja: https://docs.google.com/presentation/d/1jb0qFEKusreA-7DXLjRAw_XEyVszGrNs82tEsFGMy_U/edit?usp=sharing

**Funkcjonalności**

- Artykuły: Przeglądanie listy artykułów oraz widok szczegółowy.
- Zagnieżdżone komentarze: Możliwość odpowiadania na komentarze (tworzenie drzewa dyskusji: Komentarz -> Odpowiedź).
- System oceniania: Funkcja Like / Dislike dla artykułów i komentarzy.
- Trwałość głosów: Zabezpieczenie przed wielokrotnym głosowaniem (LocalStorage) + możliwość zmiany głosu.
- Responsive Design: Aplikacja dostosowana do urządzeń mobilnych i desktopowych.

**Stack technologiczny**

- Frontend: HTML, SCSS/CSS, JavaScript.
- Backend: Node.js, Express.js.
- Baza danych: PostgreSQL (hostowana na Render).
- Deployment: Render Web Services.

**Uruchomienie lokalne**

1.  **Sklonuj repozytorium:**

    ```bash
    git clone [LINK DO TWOJEGO REPO]
    cd wyklad-projekt
    ```

2.  **Zainstaluj zależności:**

    ```bash
    npm install
    ```

3.  **Skonfiguruj środowisko:**
    Utwórz plik `.env` w głównym katalogu:

    ```env
    PORT=3000
    DATABASE_URL=postgres://user:pass@localhost:5432/wyklad_projekt_db
    ```

4.  **Zainicjalizuj bazę danych:**

    ```bash
    npm run init-db
    ```

    _(Uwaga: Skrypt tworzy tabele articles i comments wraz z kolumnami do głosowania)_

5.  **Uruchom serwer:**

    ```bash
    npm run dev
    ```

6.  **Otwórz w przeglądarce:**
    Wejdź na `http://localhost:3000`

**Architektura**

- Wzorzec MVC: Logika podzielona na Kontrolery, Trasy (Routes) i Modele (zapytania SQL).
- REST API: Backend udostępnia endpointy takie jak `/api/articles` oraz `/api/comments`.
- Self-Referencing Table: Tabela `comments` wykorzystuje klucz `parent_id` do obsługi zagnieżdżonych odpowiedzi.
