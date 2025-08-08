import express from 'express';
import { ENV } from './config/env.js';
import { db } from './config/db.js'; // Assuming you have an index.js to initialize your database connection
import { favoritesTable } from './db/schema.js';

const app = express();
const PORT = ENV.PORT || 8001;

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running' });
});

app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res
        .status(400)
        .json({ success: false, message: 'Missing required fields' });
    }

    const newFavorite = await db
      .insert(favoritesTable)
      .values({
        userId,
        recipeId,
        title,
        image: image || '',
        cookTime: cookTime || 0,
        servings: servings || '',
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Favorite added successfully',
      data: newFavorite[0],
    });
  } catch (error) {
    console.error('Error inserting favorite:', error);
    return res
      .status(500)
      .json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
