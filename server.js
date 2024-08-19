const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });

// Review schema and model
const reviewSchema = new mongoose.Schema({
  name: String,
  title: String,
  content: String,
});

const ReviewApp = mongoose.model('ReviewApp', reviewSchema);

// Routes
app.get('/reviews', async (req, res) => {
  try {
    const reviews = await ReviewApp.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/reviews', async (req, res) => {
  const newReview = new ReviewApp(req.body);
  try {
    const savedReview = await newReview.save();
    res.json(savedReview);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a review by title
app.delete('/reviews', async (req, res) => {
  const { title } = req.body;
  
  try {
    const deletedReview = await ReviewApp.findOneAndDelete({ title });
    
    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
