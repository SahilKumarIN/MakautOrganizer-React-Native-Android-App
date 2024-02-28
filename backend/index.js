const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialized the Express server
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to DB
mongoose.connect('mongodb+srv://makautorganizer:makautorganizer@cluster0.cfzpvhw.mongodb.net/MakautOrganizer')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Schema for Blog
const semesterSchema = new mongoose.Schema({
    semester: {
        type: Number,
        required: true,
    },
    pdfLink: {
        type: String,
        default: '',
    },
});

const branchSchema = new mongoose.Schema({
    branch: {
        type: String,
        required: true,
    },
    branchImage: {
        type: String,
        required: true,
    },
    semesterData: [semesterSchema],
});
// Create a Mongoose model based on the schema
const BranchModel = mongoose.model('Branch', branchSchema);

app.get("/get-data", (req, res) => {
    BranchModel.find()
        .then((data)=>{
            res.send({
                status: 'SUCCESS',
                data: data
            })
        }).catch(error=>{
            res.send({
                status: "FAILURE",
                msg: error.message
            })
        })
})

app.post("/add-data", (req, res) => {
    const branchData = req.body; // Assuming the data is sent in the request body

    // Create a new document based on the BranchModel
    const newBranch = new BranchModel(branchData);

    newBranch.save()
        .then(() => {
            res.send({
                status: 'SUCCESS',
                msg: 'Data added successfully'
            });
        })
        .catch(error => {
            res.send({
                status: "FAILURE",
                msg: error.message
            });
        });
});


app.listen(8080, () => {
    console.log("Server started at port 8080");
})