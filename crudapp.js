import mongoose from 'mongoose';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const app = express();
const port = 3000;

app.use(express.urlencoded());
app.use(express.static('public'));
app.use(express.json());
app.set('view engine', 'ejs');

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
console.log(__dirname)

app.use('/static', express.static(path.join(__dirname, 'public')))

var uri = "mongodb+srv://sabanoman5:n0NpNfgYRPFyNccX@cluster0.f7eta.mongodb.net/UserInfo";

main().then(console.log('Connection true')).catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
}

const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

const userModel = mongoose.model('User', userSchema)

app.get('/', async (req, res) => {   
    res.render('index')
});

app.get('/viewUsers', async (req, res) => {       
    try {
        let userData = await userModel.find({});
        console.log(userData);
        res.render('view', {userData});
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/addUser', async (req, res) => {
    try {      
        res.render('add');   
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/addUser', async (req, res) => {
    try {           
        const newUser = new userModel({ name: req.body.name, email: req.body.email });
        await newUser.save();
        res.redirect('/addUser?success=true');
        console.log("User added successfully!")
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/editUser', async (req, res) => {
    try {   
        res.render('edit');    
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/editUser', async (req, res) => {
    try {
        const result = await userModel.findOne({ email: req.body.email }).updateOne({$set: { name: req.body.name, email: req.body.email}});

        if (result.modifiedCount > 0) {
            res.redirect('/editUser?success=true');
            // console.log(`${result.modifiedCount} document updated successfully!`);
        } else {
            res.redirect('/editUser?failure=true');
            console.log('No document was updated (perhaps it did not exist).');
        }
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.get('/deleteUser', async (req, res) => {
    try {   
        res.render('delete');    
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/deleteUser', async (req, res) => {
    try {           
        const result = await userModel.deleteOne({ email:req.body.email });
        // Checking  if the document was deleted
        if (result.deletedCount > 0) {
            res.redirect('/deleteUser?success=true');
            // res.json({ success: true, message: "User deleted successfully!" });
        } else {
            res.redirect('/deleteUser?failure=true');
            // res.status(404).json({ success: false, message: "User not found." });
        }        
        console.log("User deleted successfully!")
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


app.listen(port)