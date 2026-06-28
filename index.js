import express from 'express';
import mongoose, { model } from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import createRoute from './routes/create.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
};

// const bookSchema = new mongoose.Schema({
//     title: String,
//     author: String,
//     price: Number,
//     date: { type: Date, default: Date.now },
// })

// const Book = model("Book", bookSchema);


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Index Route
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// Other Routes
app.use("/create", createRoute);



// Start Server
connectDB()
    .then(async () => {
        console.log(' MongoDB Connected');

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error(' MongoDB Connection Failed');
        console.error(err);
        process.exit(1);
    });