//Creating a mongodb database using Mongoose to create Schemas with references
//Users and BlogPosts

import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express'
const app = express();
const port = 3000;

app.use(express.json())
var uri = "mongodb+srv://sabanoman5:n0NpNfgYRPFyNccX@cluster0.f7eta.mongodb.net/myBlog";
//myBlog is my database name

main().then(console.log('Connection true')).catch(err => console.log(err));

async function main() {
    await mongoose.connect(uri);
}

//User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

//Blog Schema
const blogSchema = new mongoose.Schema({
    postName: String,
    authorName: String,
    publishedDate: String,
    usersId: [
        { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "BlogUser"
         }
    ]
});

//Create Models
const User = mongoose.model('BlogUser', userSchema); 
//The actual collection name will be 'BlogUsers'
const BlogInfo = mongoose.model('BlogDetails', blogSchema);

app.post("/addUserData", async (req, res) => {
    const { name, email } = req.body
    if (!name && !email) {
        console.log("Fields are required");
        res.status(400).json({ error: "Fields are required" })
    }
    const myuser = new User({ name, email });
    await myuser.save();
    res.status(200).json(
        {
            message: "Form successfully submitted",
            recieved: {
                name, email
            }
        }
    )
})

app.post("/addBlog", async (req, res) => {
    const { postName, authorName, publishedDate, usersId } = req.body
    if (!postName || !authorName || !publishedDate) {
        console.log("Fields are required");
        res.status(400).json({ error: "Fields are required" })
    }
    const myNewBlog = new BlogInfo({ postName, authorName, publishedDate, usersId });
    await myNewBlog.save();
    res.status(200).json(
        {
            message: "Form successfully submitted",
            recieved: {
                postName, authorName, publishedDate, usersId
            }
        }
    )
})

//Check the details of the users of the 'Third post'
const result = await BlogInfo.findOne({postName:"My Third Post"})
console.log(result)


app.listen(port)

// export { main };