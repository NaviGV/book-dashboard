#  Book Dashboard 

A responsive React.js dashboard for browsing, managing, and performing CRUD operations on books. It features a JSON-based mock backend, clean UI, and dynamic functionality.

---

##  Features

- View books in a grid/table with pagination.
- Search by title or author
- Filter by genre and status
- Add, edit, and delete books (with form validation and toast alerts)
- Modal-based form using `react-hook-form`
- Confirmation dialogs before deleting books
- Responsive UI built with Tailwind CSS
- Toast notifications for actions


---

##  Tech Stack

- **React.js** + **Vite**
- **TypeScript**
- **Tailwind CSS** 
- **React Hook Form** 
- **react-toastify**
- **json-server** 
- **dotenv (.env)** 
- **concurrently** 
- **Postman** 

 **Note**: This project does not have a Node.js backend, but it **requires Node.js (v18 or above)** to run tools like `vite`, `json-server`, and `npm` scripts.


---

## 📂 Project Structure

```
📁 book-dashbord
├── 📁 public
├── 📁 src
│   ├── 📁 components
│   │   ├── 📁 ui             # ShadCN-based custom UI components
│   │   ├── BookForm.tsx      # Add/Edit form
│   │   ├── BookTable.tsx      # Table/grid of books
│   │   ├── Pagination.tsx      # Pagination UI
│   │   └── LoadSkeleton.tsx    # skeleton
│   ├── 📁 pages
│   │   └── BookDashboard.tsx
│   ├── 📁 services
│   │   └── bookApi.ts
│   ├── 📁 types
│   │   └── book.ts
│   ├── App.tsx
│   └── main.tsx
├── index.css
├── db.json                   # JSON-server mock database
├── .env                      # API base URL
├── tailwind.config.js
├── vite.config.ts
├── package.json
└── README.md
```
---

## Installation Guide

###  Prerequisites

- Node.js v18+ and npm
- Git installed

###  Setup Steps

## 1. Clone the repository
```bash
git clone https://github.com/NaviGV/book-dashboard.git
cd book-dashboard
```

## 2. Install dependencies
```bash
npm install
```
Make sure `concurrently` and `json-server` are installed as dev dependencies:
```bash
npm install --save-dev concurrently json-server
```
> If they're already in `package.json`, you're good to go.

## 3. Create a `.env` 
```env
# .env
VITE_API_BASE_URL=http://localhost:4000
```

## 4. Start frontend + backend together

```bash
npm run dev
```

This will start:
- `json-server` on `http://localhost:4000`
- `Vite` frontend on `http://localhost:5173`


###  Your `scripts` section in `package.json` should include:

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "json-server --watch db.json --port 4000",
  "client": "vite"
}
```

---
## 📡 API Endpoints

These are handled by `json-server`, using `db.json` as a mock database:


### 📘 Endpoints

| Method | Endpoint     | Description            |
|--------|--------------|------------------------|
| GET    | `/books`     | Fetch all books        |
| POST   | `/books`     | Add a new book         |
| PUT    | `/books/:id` | Update a specific book |
| DELETE | `/books/:id` | Delete a specific book |

---
## 📬 Testing API Endpoints with Postman

1. Ensure `npm run dev` is running.
2. Open [Postman](https://www.postman.com/) and test using the endpoints below.


###  1. GET All Books

- **Method**: GET  
- **URL**: `http://localhost:4000/books`

---

###  2. POST Create New Book

- **Method**: `POST`  
- **URL**: `http://localhost:4000/books`  
- **Headers**:  
  - `Content-Type`: `application/json`
- **Body** (raw JSON):
```json
{
  "title": "Atomic Habits",
  "author": "James Clear",
  "genre": "Self-help",
  "publishedYear": 2018,
  "status": "Available",
  "isbn": "9780735211292",
  "description": "A book about building good habits and breaking bad ones."
}
```
---


###  3. PUT Update a Book

- **Method**: `PUT`  
- **URL**: `http://localhost:4000/books/:id`  
  Replace `:id` with the actual book ID (e.g., `http://localhost:4000/books/1`)
- **Headers**:
  - `Content-Type`: `application/json`
- **Body** (raw JSON):
```json
{
  "title": "Atomic Habits - Updated",
  "author": "James Clear",
  "genre": "Self-help",
  "publishedYear": 2018,
  "status": "Issued",
  "isbn": "9780735211292",
  "description": "Updated description for the book."
}
```


---

###  4. DELETE a Book

- **Method**: `DELETE`  
- **URL**: `http://localhost:4000/books/:id`  
  Replace `:id` with the actual book ID (e.g., `http://localhost:4000/books/1`)


---




