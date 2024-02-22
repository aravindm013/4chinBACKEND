const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const mongoose = require('mongoose')
const mongodb = require('mongodb')
const Catalog = require('./Catalog')
const path = require('path')
const cors = require('cors')
const Thread = require('./Thread')

require('colors')
require('dotenv').config()

mongoose.connect(process.env.MONGO_URL,
    {useNewUrlParser:true, useUnifiedTopology:true},err=>{
        if(err) return console.error(err)
        console.log('Connected to DB'.underline.blue)
    })
const app = express()
app.use(cors())
app.use(fileUpload());
app.use(express.json())
// app.use(express.urlencoded())
// app.post('/upload', (req,res)=> {
//     sampleFile = req.files.sampleFile
//     res.sendFile((path.join(__dirname,'/temp/',sampleFile.name)))
// })
app.get('/api/v1/popularthreads', async (req,res) => {
    try{
        const data = await Catalog.find().sort({'replies':-1}).limit(6)
        res.json(data)
    }catch(err){
        res.status(500).json({error: err.message})
    }    

})
app.get('/api/v1/catalogs/:board', async (req,res)=>{
    const data = (Catalog.find({"board":'/'+req.params.board+'/'}).sort({'updatedAt':-1}).exec((err,books)=>{
        if(!err){
            console.log(books)
            res.json(books)
        }else{
            console.log('some error',err)
        }
    }))
})
app.get('/api/v1/findCatalog/:id', async (req,res)=>{
    const data = (Catalog.find({_id:req.params.id}).exec((err,books)=>{
        if(!err){
            console.log(books)
            res.json(books)
        }else{
            console.log('some error',err)
        }
    }))
})

app.get('/api/v1/threads/:id', async  (req,res)=> {
    
    const id = req.params.id
    const data = (Thread.find({'thread_id':id}).exec((err,books)=>{
        if(!err){
            console.log(books)
            res.json(books)
        }else{
            console.log('some error',err)
        }
    }))
})
app.post('/api/v1/threads/:id', async (req,res)=> {
    const id = req.params.id
    let sampleFile
    let entry
    if(req.files){
        sampleFile = req.files.sampleFile;
        entry = {
            name:sampleFile.name,
            comment:req.body.comment,
            board:req.body.board,
            thread_id:id,
            img:{
                data:req.files.sampleFile.data,
                contentType:'image/jpg'
            }
        }
    }else{
        entry = {
            comment:req.body.comment,
            board:req.body.board,
            thread_id:id
        }
    }
    Thread.create(entry, err =>{
        if(err){
            res.status(500).json({
                success:false,
                msg: err
            })
        }else{
            console.log('Database updated'.yellow)
            res.status(200).json({
                success:true,
                msg: 'File uploaded to database...'
            })
        }
    } )
    try {
        if(sampleFile)await Catalog.findOneAndUpdate({_id:id},{updatedAt:Date.now(), $inc: {replies: 1, imageReplies: 1} })
        else await Catalog.findOneAndUpdate({_id:id},{updatedAt:Date.now(), $inc: {replies: 1} })
        console.log('updated date and stuff'.rainbow)
    }catch(err){
        console.error(err)
    }
})



app.post('/api/v1/catalogs', async function(req, res) {
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    
    console.log(req.files,'body:',req.body)
    if(!req.files)return console.log('NOthing in req'.red)
  let sampleFile = req.files.sampleFile;
  
  let entry = {
      name:sampleFile.name,
      title:req.body.title,
      opComment:req.body.opComment,
      board:req.body.board,
      img:{
        data:req.files.sampleFile.data,
        contentType:'image/jpg'
      }
  }
  console.log(entry)
//   res.json(req.body)
  Catalog.create(entry, err =>{
      if(err){
          res.status(500).json({
              success:false,
              msg: err
          })
      }else{
          console.log('Database updated'.yellow)
          res.status(200).json({
              success:true,
              msg: 'File uploaded to database...'
          })
      }
  } )


});

PORT = process.env.PORT
app.listen(PORT,()=>console.log('running on port ',PORT))