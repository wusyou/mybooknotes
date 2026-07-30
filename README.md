# Book Notes

A full-stack web app for keeping track of the books you have read, along with your notes, ratings, and the dates you finished them. Book covers and author details are pulled automatically from the Open Library API, and everything is stored in a PostgreSQL database.

Inspired by [Derek Sivers' book notes page](https://sive.rs/book) and built as the capstone project for *The Complete Web Development Bootcamp*.

**Live demo:** https://mybooknotes.onrender.com/



## Features

- Add books by title, with the cover and author fetched automatically from the Open Library API
- Full CRUD: create, read, update, and delete your book reviews
- Sort your library by recency, rating, or title
- Persistent storage in a PostgreSQL database
- Server-rendered pages using EJS
- Graceful cover fallbacks and basic error handling

## Tech Stack

| Layer      | Tools                          |
| ---------- | ------------------------------ |
| Backend    | Node.js, Express               |
| Database   | PostgreSQL (Neon in production)|
| Templating | EJS                            |
| HTTP calls | Axios                          |
| Frontend   | HTML, CSS, vanilla JavaScript  |
| Hosting    | Render                         |

## API Used

[Open Library](https://openlibrary.org/developers/api) provides the book data. The app calls the Search API to find a book by title, then uses the returned `cover_i` value to build the cover image URL from the Covers API. No API key is required.

## Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js installed
- PostgreSQL installed and running

### 1. Clone the repository

```bash
git clone https://github.com/your-username/book-notes.git
cd book-notes
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Create a database, then run the schema below in your PostgreSQL client:

```sql
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  cover_id INTEGER,
  rating INTEGER,
  notes TEXT,
  date_read DATE
);
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```
DATABASE_URL=postgresql://user:password@localhost:5432/book_notes
```

For production on Neon, use the connection string from your Neon dashboard and make sure SSL is enabled in your database client config.

Make sure this file is never pushed to GitHub. Create a `.gitignore` file in the project root with the following, so your credentials and dependencies stay out of the repository:

```
node_modules
.env
```

### 5. Start the server

```bash
node index.js
```

Or, if you have nodemon installed for auto-restart during development:

```bash
nodemon index.js
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
book-notes/
├── index.js            # Express server and routes
├── views/              # EJS templates
│   ├── index.ejs       # Book list with sorting
│   ├── add.ejs         # Add-book form
│   └── edit.ejs        # Edit-review form
├── public/             # Static assets
│   ├── styles/
│   │   └── main.css
│   └── scripts/
│       └── main.js
├── .env                # Environment variables (not committed)
└── README.md
```

## Deployment

The app is deployed on [Render](https://render.com) with a [Neon](https://neon.tech) PostgreSQL database.

Key points for deploying your own copy:

- Add your Neon connection string as a `DATABASE_URL` environment variable in Render
- Set the build command to `npm install`
- Set the start command to `node index.js`
- Run the `CREATE TABLE` statement above in the Neon SQL editor so the live database has the schema

## Acknowledgements

- Project brief from *The Complete Web Development Bootcamp* by Angela Yu
- Concept inspired by [Derek Sivers](https://sive.rs/book)
- Book data from [Open Library](https://openlibrary.org)
