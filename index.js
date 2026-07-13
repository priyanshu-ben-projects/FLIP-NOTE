import express from 'express';
import mongoose, { model } from 'mongoose';
import dotenv from 'dotenv';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database Connection 
const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
};


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

// View Route
app.get('/show', async (req, res) => {
    const notes = await Note.find();
    res.render('show.ejs', { notes });
});

// Create Form Route
app.get('/show/create', async (req, res) => {
    res.render('addNote.ejs');
});


// Update Request
app.patch('/show/:id', async (req, res) => {

    const { title, content, tags, isPinned } = req.body;

    await Note.findByIdAndUpdate(
        req.params.id,
        {
            title,
            content,

            tags: tags
                ? tags.split(",").map(tag => tag.trim())
                : [],

            isPinned: isPinned === "on"
        },
        {
            runValidators: true
        }
    );


    res.redirect('/show');

});

// Get Update form
app.get('/edit/:id', async (req, res) => {

    const note = await Note.findById(req.params.id);

    res.render('update.ejs', { note });

});

// Post to Create form
app.post('/show', async (req, res) => {
    console.log(req.body);
    const { title, content, tags, isPinned } = req.body;
    await Note.create({

        title,

        content,

        tags: tags
            ? tags.split(",").map(tag => tag.trim())
            : [],

        isPinned: isPinned === "on"

    });
    res.redirect('/show');
});



// Delete Route
app.delete('/show/delete:id', async (req, res) => {
    const { id } = req.params;
    await Note.findByIdAndDelete(id);

    res.redirect('/show');
});



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


const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: "Untitled Note"
    },

    content: {
        type: String,
        default: "",
        trim: true
    },

    tags: [{
        type: String,
        trim: true
    }],

    isPinned: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});


const Note = mongoose.model('Note', noteSchema);


// const notes = await Note.insertMany([
//     {
//         title: "MongoDB Basics",
//         content: "Learn CRUD operations using Mongoose.",
//         tags: ["mongodb", "backend"],
//         isPinned: true
//     },
//     {
//         title: "Express Routing",
//         content: "Understand routes, middleware, and routers.",
//         tags: ["express", "nodejs"]
//     },
//     {
//         title: "EJS Templates",
//         content: "Practice loops, conditionals, and partials.",
//         tags: ["ejs", "frontend"]
//     },
//     {
//         title: "Method Override",
//         content: "Use PATCH and DELETE requests in HTML forms.",
//         tags: ["express", "method-override"]
//     },
//     {
//         title: "Project Ideas",
//         content: "Build a Notes App, Expense Tracker, and Blog.",
//         tags: ["projects"]
//     },
//     {
//         title: "Shopping List",
//         content: "Milk, Bread, Coffee, Eggs.",
//         tags: ["personal"]
//     },
//     {
//         title: "Meeting Notes",
//         content: "Discuss project milestones and deadlines.",
//         tags: ["work", "meeting"],
//         isPinned: true
//     },
//     {
//         title: "Books to Read",
//         content: "Atomic Habits, Clean Code, Deep Work.",
//         tags: ["books"]
//     }
// ]);


