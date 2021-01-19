const mongoose = require('mongoose');
const Schema = mongoose.Schema

const movieSchema = new Schema({
    id: { 
        type: 'Number', 
        required: true
    }, 
    backdrop_path: { 
        type: 'String', 
        required: true
    },
    original_language: { 
        type: 'String', 
        required: true
    }, 
    title: { 
        type: 'String', 
        required: true
    },
    original_title: { 
        type: 'String', 
        required: true
    },
    overview: { 
        type: 'String', 
        required: true
    }, 
    popularity: { 
        type: 'Number', 
        required: true
    },
    poster_path: { 
        type: 'String', 
        required: true
    }, 
    release_date: { 
        type: 'Date', 
        required: true
    },
    vote_average: { 
        type: 'Number', 
        required: true
    },
    vote_count: { 
        type: 'Number', 
        required: true
    },
    genre_ids: { 
        type: 'Array',
        required: true
    }
})




//wir müssen nun das Model in einem Schema verwandeln:
const MovieItem = mongoose.model('movieDb', movieSchema)
module.exports = MovieItem