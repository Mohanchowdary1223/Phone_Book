import express from "express"
import mongoose from 'mongoose'
import PhoneBook from "./model/Phonebook.cjs"
import ViteExpress from 'vite-express'
const app = express()
const port = process.env.PORT || 3000

app.use(express.json());
const mongoUri = "mongodb://localhost:27017/phonebook";
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB.");
  })
  .catch((err) => {
    console.error("Error Connecting to MongoDB.", err);
  });


app.post('/addPhone', async (req, res) => {
  const formData = await req.body
  console.log(formData)
  const newData = new PhoneBook({
    name : formData.name,
    phone : formData.phone,
  })
  newData.save().then(savedUser => {
    console.log('User saved Successfully', savedUser)
    res.status(201).json({success : true})
  }).catch((err) => {
    console.error('Error Saving User.', err)
    res.status(500).json({success : false, message : 'Internal Server Error.'})
  })
})

app.post('/update/:id', async (req, res) => {
  const objectId = req.params.id;
  const details = req.body;
  try {
      const updatedPhone = await PhoneBook.findByIdAndUpdate(objectId, details, {
          new: true,
          runValidators: true
      });
      res.status(200).json(updatedPhone);
  } catch (err) {
      console.log(err);
      res.status(500).json({ status: "failure" });
  }
});


app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  try {
    await PhoneBook.findByIdAndDelete(id)
    res.status(200).json({status : 'status'})
  } catch (err) {
    res.status(500).jsno({status : err})
  }
})


app.get('/fetchData', async (req, res) => {
  const results = await PhoneBook.find().sort({name : 1}).collation({locale : 'en', caseLevel : true})
  res.status(200).json(results)
})

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`> Ready on http://localhost:${port}`)
})

ViteExpress.bind(app, server)