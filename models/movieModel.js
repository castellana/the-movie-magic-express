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
        required: false
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
        required: false
    },
    vote_count: { 
        type: 'Number', 
        required: true
    },
    genre_ids: { 
        type: 'Array',
        required: false
    }
}, {timestamps: true})




//wir müssen nun das Model in einem Schema verwandeln:
const MovieItem = mongoose.model('movieDb', movieSchema)
module.exports = MovieItem