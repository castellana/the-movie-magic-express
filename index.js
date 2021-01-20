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
        // console.log("result data :" , JSON.stringify(data.data))
        res.render('index', {popularMovies: data.data.results})
        }
    )
    .catch(err => console.log('Something went wrong when getting axiosAPI')) 
})


app.get('/movie-search', (req, res, next) => {
    // console.log('prueb miercoles: ', req) //nos da gran objeto, y, dentro de query está lo que buscamos
    //localhost:4444/movie-search?inputSearch=shadow.
    // console.log('prueb miercoles req.query.inputSearch: ', req.query.inputSearch) //nos da "shadow"
    //ahora queremos incluir nuestra palabra en la búsqueda en la Base de Datos de "themovieDdb" Para ello leemos la documentación: https://developers.themoviedb.org/3/search/multi-search
    //Escribimos los parámetros con este orden: api_key (req) - language (opt) - query (req) - page 1 (opt) - include_adult (false) (opt) - region (opt)
    //https://api.themoviedb.org/3/search/multi?api_key=<<api_key>>&language=en-US&page=1&include_adult=false
    //y los substituimos con nuestros valores: 
    axios.get(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.API_KEY}&language=en-US&query=${req.query.inputSearch}&page=1&include_adult=false`)
        .then(data => {
            // console.log("data del miercoles:", data);
            // console.log("data.data del miercoles:", data.data);
            // res.end()
            const moviesResults = data.data.results
            res.render('results', {moviesResults})
            })
        .catch(err => console.log('Something went wrong when getting axiosAPI')) 
} )


app.get('/details/:id', (req, res) => {
    // console.log("req miercoles", req);
    // console.log("req.params.id:", req.params.id)
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(data => {
            // console.log('get /details/:id, data: ', data);
            // console.log('resultados de data.data: ', data.data)
            // res.end()
            const movieDetailsData = data.data;
            res.render('details', { movieDetailsData })
        })
        .catch(err => console.log(err))
})


app.get('/add-fav/:id', (req, res) => {
    // console.log("req :", req); //sólo con esto no recibimos los datos de la película. Debemos conectarnos otra vez al axios??????:
    // res.end()
    axios.get(`https://api.themoviedb.org/3/movie/${req.params.id}?api_key=${process.env.API_KEY}&language=en-US`)
        .then(data => {
            
            // console.log("data :", data);
            //console.log(data.data) //me da los datos de la película
            console.log('req.data.data :', data.data)
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
                genres_ids: data.data.genres,
                vote_average: data.data.vote_average,
                vote_count: data.data.vote_count
            })
            newFav.save()
            .then(result => {
                // res.send(result)
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
    // console.log("favitem/:id :", req); //de aquí no recibimos nada que podamos usar
    MovieItem.find({"id": req.params.id})
        .then(result => {
            // console.log("resultado :", result);
            res.render('favitem', {favDetailsData: result[0] })
        })
        .catch(err => console.log(err))
        })


app.get('/favitem/:id/delete', (req, res) => {
    // console.log("favitem/:id :", req); //de aquí no recibimos nada que podamos usar
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

