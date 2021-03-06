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
    axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}`)

    .then(data => {
        // console.log("result data :" , JSON.stringify(data.data))
        const popularMovies = data.data.results
        const page = data.data.page
        res.render('index', {popularMovies, page})
        })
    .catch(err => console.log('Something went wrong when getting axiosAPI')) 
})

// app.get('/popular/:page', (req, res) => {
//     // console.log('popular/:page req : ', req.params.page)
//     axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}?page=${req.params.page}`)

//     .then(data => {
//         const popularMovies = data.data.results
//         const page = data.data.page
//         const nextPage = req.params.page
//         res.render('popular', {popularMovies, page, nextPage})
//         })
//     .catch(err => console.log('Something went wrong when getting axiosAPI')) 
// })


app.get('/movie-search', (req, res, next) => {
    // console.log('prueb miercoles req.query.inputSearch: ', req.query.inputSearch) 
    axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${req.query.inputSearch}&page=1&include_adult=false`)
        .then(data => {
            console.log("data :", data);
            // console.log(data.data);
            // console.log("data.data.page :", data.data.page);
            
            const inputSearch = req.query.inputSearch
            const moviesResults = data.data.results
            const page = data.data.page
            const totalPages = data.data.total_pages
            res.render('results', {moviesResults, page, totalPages, inputSearch})
            })
        .catch(err => console.log('Something went wrong when getting axiosAPI')) 
} )





app.get('/details/:id', (req, res) => {
    // console.log(req.params.id)
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(data => {
            // console.log(data.data)
            // res.end()
            const movieDetailsData = data.data;
            res.render('details', { movieDetailsData })
        })
        .catch(err => console.log(err))
})


app.get('/add-fav/:id', (req, res) => {
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(data => {
            //console.log(data.data) //me da los datos de la película
            console.log('req.data.data :', data.data) //objeto con todos los datos de la pelicula
            const movieToAdd = data.data
            MovieItem.find({"id": "data.id"}).then(movie => {
                console.log("movie :", movie);
                console.log("data.id:", data.id);
            })
            const newFav = new MovieItem ({
                id: data.data.id,
                backdrop_path: data.data.backdrop_path == undefined ? data.data.poster_path : data.data.backdrop_path, 
                original_language: data.data.original_language,
                title: data.data.title,
                original_title: data.data.original_title,
                popularity: data.data.popularity,
                poster_path: data.data.poster_path,
                release_date: data.data.release_date,
                overview: data.data.overview,
                genres: data.data.genres,
                vote_average: data.data.vote_average,
                vote_count: data.data.vote_count
            })
            newFav.save()
            .then(result => {
                res.redirect('/mymovies')
            })
        })
        .catch(err => console.log(err))
})

app.get('/mymovies', (req, res) => {
    MovieItem.find()
        .then(result => res.render('mymovies', {favouritesData: result}))
        .catch(err => console.log(err))
})


app.get('/favitem/:id', (req, res) => {
    MovieItem.find({"id": req.params.id})
        .then(result => {
            console.log("resultado :", result);
            console.log("json.stringigly de result.genre_ids: ", JSON.stringify(result[0].genre_ids));
            
            res.render('favitem', {favDetailsData: result[0]})
        })
        .catch(err => console.log(err))
        })


app.get('/favitem/:id/delete', (req, res) => {
    MovieItem.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log('movie has been removed from your favourite list');
            res.redirect('/mymovies')
        })
            .catch(err => console.log(err))
        
});


app.use((req, res) => {
    res.status(404).render('404')
})

