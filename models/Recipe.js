const mongoose = require('mongoose');
const slugify = require('slugify');
const mongoose_fuzzy_searching = require('mongoose-fuzzy-searching');

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
    likes: {
        type: Number,
        default: 0
    },   
    likedBy: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }], 
    createdAt: {
        type: Date,
        default: Date.now,
    }, 
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    photo: {
        type: String,
        default: 'no-photo.jpg'
    }
});

// Enable fuzzy searching on the 'name' field
RecipeSchema.plugin(mongoose_fuzzy_searching, { fields: ['name', 'ingredients', 'category'] });

// Create Recipe slug from the name
RecipeSchema.pre('save', function(next){
    this.slug = slugify(this.name, { lower: true });
    next();
});

module.exports = mongoose.model('Recipe', RecipeSchema);
