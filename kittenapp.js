// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import 'dotenv/config';
var uri = "mongodb+srv://sabanoman5:n0NpNfgYRPFyNccX@cluster0.f7eta.mongodb.net/myKittens";

main().then(console.log('Connection true')).catch(err => console.log(err));

async function main() {
  await mongoose.connect(uri);
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const kittySchema = new mongoose.Schema({
    name: String,
    age: Number
  });

kittySchema.methods.speak = function speak() {
    const greeting = this.name
      ? 'Meow name is ' + this.name
      : 'I don\'t have a name';
    console.log(greeting);
  };
const Kitten = mongoose.model('Kitten', kittySchema);

const silence = new Kitten({ name: 'Silence', age:2 });
console.log(silence.name); // 'Silence'
  

const fluffy = new Kitten({ name: 'Fluffs', age:5 });
fluffy.speak(); // "Meow name is fluffy"

await fluffy.save();


const kittens = await Kitten.find();
console.log(kittens);
console.log('here');

// Kitten.findOne({name: 'fluffy'}).updateOne({name: 'notFluffy'});
console.log(Kitten.findOne({name: 'fluffy'}))
// // await Kitten.find({ name: /^fluff/ });
console.log(kittens);

// export { main };