const mongoose = require('mongoose');
const slugify = require('slugify');

const RecipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    ingredients: {
        type: [String],
        required: [true, 'Please add the ingredients'],
        maxlength: [500, 'Ingredients cannot be more than 500 characters']
    },
    instructions: {
        type: String,
        required: [true, 'Please add the instructions'],
        maxlength: [900, 'Instructions cannot be more than 900 characters']
    },
    time: {
        type: Number,
        required: true
    },
    servings: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'Appetizer',
            'Main-course',
            'Dessert'
        ]
    }, 
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating must cannot be more than 10']
    }, 
    photo: {
        type: String,
        default: 'no-photo.jpg'
    }
});

// Create Recipe sluf from the name
RecipeSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);