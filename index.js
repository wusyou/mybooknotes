import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import env from "dotenv";

env.config();

const app = express();
const port = process.env.PORT || 3000;

const db = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const sort = req.query.sort || "recency";
    let orderBy = "date_read DESC";
    if (sort === "rating") orderBy = "rating DESC";
    if (sort === "title") orderBy = "title ASC";

    const result = await db.query(`SELECT * FROM books ORDER BY ${orderBy}`);
    res.render("index.ejs", { books: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).send("There is a problem.");
  }
});

app.get("/add", (req, res) => {
  res.render("add.ejs");
});

app.post("/add", async (req, res) => {
  const { title, rating, notes, date_read } = req.body;

  try {
    const response = await axios.get("https://openlibrary.org/search.json", {
      params: { title: title, fields: "title,author_name,cover_i", limit: 1 },
    });

    if (response.data.docs.length === 0) {
      return res
        .status(404)
        .send("No book found with that title. Please try again.");
    }

    const book = response.data.docs[0];

    const bookTitle = book.title;
    const author = book.author_name ? book.author_name[0] : "Unknown";
    const coverId = book.cover_i || null;

    await db.query(
      "INSERT INTO books (title, author, cover_id, rating, notes, date_read) VALUES ($1, $2, $3, $4, $5, $6)",
      [bookTitle, author, coverId, rating, notes, date_read],
    );

    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("There is a problem adding the book.");
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM books WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).send("Book not found.");
    }

    res.render("edit.ejs", { book: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send("There is a problem loading the book.");
  }
});

app.post("/edit", async (req, res) => {
  const { id, rating, notes, date_read } = req.body;
  try {
    await db.query(
      "UPDATE books SET rating = $1, notes = $2, date_read = $3 WHERE id = $4",
      [rating, notes, date_read, id],
    );
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("There is a problem updating the book.");
  }
});

app.post("/delete", async (req, res) => {
  try {
    await db.query("DELETE FROM books WHERE id = $1", [req.body.id]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("There is a problem deleting the book.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
