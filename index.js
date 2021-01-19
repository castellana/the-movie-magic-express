require('dotenv').config()
const { default: axios } = require('axios')
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const MovieItem = require('./models/movieModel')

mongoose.connect(process.env.dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => {
        app.listen(process.env.PORT, () => console.log(`http://localhost:${process.env.PORT}`))
    })
    .catch(err => console.log(err))



app.use(express.static('public'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))    

app.get('/', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&page=1`)
    .then(data => {
            console.log("result data :" , JSON.stringify(data.data))
            
            res.render('index', {popularMovies: data.data.results})
        }
    )
    .catch(err => console.log('Something went wrong when getting axiosAPI'))
    
})



app.use((req, res) => {
    res.status(404).render('404')
})