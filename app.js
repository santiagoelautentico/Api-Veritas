import express from "express";
const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Api-Veritas!' });
});

const PORT = process.env.PORT || 1234;

app.listen(PORT, () => {
    console.log("Server running on port 1234");
});
