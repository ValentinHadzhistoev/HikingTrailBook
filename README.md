# TrailBook

A community web app for sharing hiking trails, built with React as a Single Page Application.

- **Live app (frontend):** https://hiking-trail-book.vercel.app/
- **Live API (backend):** https://trailbook-server.onrender.com
- **Repository:** https://github.com/ValentinHadzhistoev/HikingTrailBook

> **Note on first load:** the backend runs on a free Render instance that goes to sleep when idle. The first request after a while can take up to a minute while the server wakes up. If the page shows an error or loads slowly at first, wait a moment and refresh.
>
> **Note on data:** the backend is the SoftUni practice server (approved by the course training team by email for this project). It keeps its data in memory and starts with a few seeded demo trails, so user accounts and trails created by visitors are reset whenever the server restarts.

## Installation and running locally

Requirements: Node.js 20 or newer and npm.

```
git clone https://github.com/ValentinHadzhistoev/HikingTrailBook.git
cd HikingTrailBook
```

**1. Start the backend** (runs on http://localhost:3030)

```
cd server
npm install
npm run client
npm run build
npm start
```

**2. Start the frontend** (in a second terminal, runs on http://localhost:5173)

```
cd client
npm install
npm run dev
```

Open http://localhost:5173 in the browser. The frontend uses `http://localhost:3030` as the API by default. To point it at another API, set `VITE_API_URL` in `client/.env`.

Production build of the frontend: `cd client && npm run build`.

## Project structure

```
HikingTrailBook/
  client/               React app (Vite)
    src/
      api/              fetch helper and API modules (auth, trails, likes, comments)
      components/       reusable components (Navbar, Footer, Hero, TrailCard, TrailForm, LikeButton, Comments)
        guards/         route guards (AuthGuard, GuestGuard)
      context/          AuthContext and AuthProvider
      hooks/            custom hooks (useAuth, useForm)
      utils/            validation helpers
      views/            route-level pages (Home, Catalog, Details, CreateTrail, EditTrail, MyTrails, Login, Register, NotFound)
  server/               SoftUni practice server (REST API) with seeded demo data
```

Architecture in short: `views/` are the pages matched by routes in `App.jsx`. They use reusable `components/`, talk to the server only through the `api/` modules, and read the logged-in user from the Context API through the `useAuth` hook. Styling is plain CSS, with one CSS file per component plus a global `index.css`.

## Functional Guide

### 1. Project Overview

- **Application name:** TrailBook
- **Category / topic:** Community catalog (hiking trails)
- **Main purpose:** TrailBook lets hikers share trails and discover new ones. Users publish trails with a location, difficulty, length, photo and description, and other users can like them and leave comments.

### 2. User Access & Permissions

**Guest (not authenticated)**
- Available pages: Home, Catalog (`/trails`), Details (`/trails/:trailId`), Login, Register.
- Public data: the list of trails, the full trail details, like counts and comments.

**Authenticated user**
- Main sections: Home, Catalog, Create Trail, My Trails (`/profile`).
- Details pages: everything a guest sees, plus the option to like a trail (once, and not their own) and to post comments.
- Create / Edit / Delete: any logged-in user can create trails. Only the author of a trail sees the Edit and Delete buttons and can use them.

### 3. Authentication & Session Handling

**Flow**
- When the app loads, `AuthProvider` reads the saved session from `localStorage` and sets the initial state. A user counts as authenticated when an access token is present.
- On login or registration, the form is validated, then the API returns the user and an access token. The result is saved in the Context state and in `localStorage`, and the user is redirected to the Catalog.
- On logout, the app calls the logout endpoint, clears the Context state and `localStorage`, and redirects to Home.

**Session persistence**
- The session is stored in Context (for the running app) and `localStorage` (so it survives a refresh). After a refresh the provider restores the user automatically.
- If the server restarts and the saved token becomes invalid, the request helper clears the session and the app continues as a guest.

### 4. Routing Structure

**Route guards**
- `AuthGuard` wraps the private routes and redirects unauthenticated users to `/login`.
- `GuestGuard` wraps Login and Register and redirects logged-in users to Home.
- Catalog and Details are public.

**Main routes (9)**
`/` Home, `/trails` Catalog, `/trails/:trailId` Details, `/trails/create` Create, `/trails/:trailId/edit` Edit, `/profile` My Trails, `/login`, `/register`, and `*` for the 404 page.

**Nested and parameterized routes**
- The guards are layout routes (parent routes without a path that render their child routes through `<Outlet />`).
- Routes with URL parameters: `/trails/:trailId` and `/trails/:trailId/edit`.

### 5. List → Details Flow

**Catalog**
- Shows every trail as a card with image, name, location, difficulty and length, newest first.
- The user can search by name and filter by difficulty.

**Details**
- Each card links to `/trails/<id>` with a React Router `Link`.
- The page reads `trailId` with `useParams` and fetches that trail from the API.

### 6. Data Source & Backend

- **Backend type:** custom REST API, the SoftUni practice server (Node.js), deployed on Render.
- Endpoints used: `/users/register`, `/users/login`, `/users/logout`, `/data/trails`, `/data/likes`, `/data/comments`.
- Authenticated requests send the access token in the `X-Authorization` header.

### 7. Data Operations (CRUD)

The collection is `trails`.

- **Create:** the Create Trail page uses the shared `TrailForm` and sends a POST request, then redirects to the new trail's Details page.
- **Read:** Home, Catalog and My Trails fetch lists of trails (My Trails filters by the author's id). Details fetches a single trail by id.
- **Update:** the Edit page loads the trail into the same `TrailForm`, sends a PUT request, and redirects to Details, which fetches the updated data.
- **Delete:** the author clicks Delete on the Details page, confirms, and the app sends a DELETE request and redirects to the Catalog, which no longer lists the trail.
- Only the author can edit or delete: the Edit and Delete buttons are shown only when the trail's `_ownerId` matches the logged-in user's id, and the Edit page redirects any other user back to the Details page.

### 8. Forms & Validation

**Forms:** Login, Register, Create/Edit Trail (one shared form), the comment form, and the search and filter inputs on the Catalog. All inputs are controlled.

**Validation rules**
- Email (Login, Register): must be a valid email address.
- Password (Login, Register): at least 6 characters. Register also requires the repeated password to match.
- Trail form: name at least 3 characters; location required; difficulty must be Easy, Medium or Hard; length must be a number greater than 0; image URL must start with `http://` or `https://`; description at least 10 characters.
- Comment: at least 2 characters.

### 9. React-Specific Techniques

**Hooks and lifecycle**
- Hooks used: `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate`, `useLocation`, and the custom hooks `useAuth` and `useForm`.
- Mount: the Catalog fetches the trails in a `useEffect` when the page appears.
- Update: the Details effect re-runs when the `trailId` in the URL changes.
- Unmount: the effects return cleanup functions. The data-fetching effects set an `ignore` flag so a finished request doesn't update an unmounted page, and `AuthProvider` removes its `window` event listener.

**Context API**
- `AuthContext` shares the user id, email, `isAuthenticated`, and the login, register and logout handlers. It is used by the Navbar, the route guards, the forms, Details, My Trails, and the like and comment components.

**Styling**
- Plain CSS: one CSS file per component (for example `Navbar.css`, `Hero.css`, `TrailCard.css`) and a global `index.css`.

### 10. Typical User Flow

1. A visitor opens the site and browses the Home page and the Catalog, searching or filtering by difficulty.
2. They open a trail to read its details, likes and comments.
3. They register an account and are taken to the Catalog.
4. They create a new trail with the Create form and see its Details page.
5. They like another user's trail and post a comment.
6. They edit or delete their own trail, then log out.

### 11. Error & Edge Case Handling

- **Authentication errors:** invalid input shows a validation message under the form title, and errors from the server (such as wrong credentials or an email that is already registered) are shown the same way. Buttons are disabled while a request is running.
- **Network or data errors:** Home, Catalog, Details, My Trails, likes and comments show loading and error messages instead of a blank page. A trail that doesn't exist shows an error with a link back to the Catalog.
- **Empty states:** "No trails found.", "No comments yet." and a "You haven't added any trails yet" message with a button on My Trails.
- **Unknown routes:** a 404 page with a link home.

## Credits

- Design inspired by the free Travelluv template by [TemplatesJungle](https://templatesjungle.com/).
- Backend based on the [SoftUni practice server](https://github.com/softuni-practice-server/softuni-practice-server) (MIT license).