import { readDB, writeDB } from '../utils/db.js';
import { logger } from '../utils/logger.js';

/**
 * Get personalized speech history for the logged-in user
 * GET /api/user/history
 */
export async function getUserHistory(req, res) {
  try {
    const userId = req.user.id;
    const db = await readDB();

    const userHistory = db.history
      .filter((h) => h.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({
      success: true,
      count: userHistory.length,
      history: userHistory
    });
  } catch (err) {
    logger.error('Failed to get user history:', err.message);
    res.status(500).json({ success: false, error: 'Could not fetch speech history.' });
  }
}

/**
 * Toggle favorite status for a speech history item
 * PATCH /api/user/history/:id/favorite
 */
export async function toggleFavorite(req, res) {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const db = await readDB();
    const item = db.history.find((h) => h.id === itemId && h.userId === userId);

    if (!item) {
      return res.status(404).json({ success: false, error: 'History item not found.' });
    }

    item.isFavorite = !item.isFavorite;
    await writeDB(db);

    res.status(200).json({
      success: true,
      isFavorite: item.isFavorite,
      item
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to toggle favorite.' });
  }
}

/**
 * Delete a speech history item
 * DELETE /api/user/history/:id
 */
export async function deleteHistoryItem(req, res) {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const db = await readDB();
    const initialLen = db.history.length;
    db.history = db.history.filter((h) => !(h.id === itemId && h.userId === userId));

    if (db.history.length === initialLen) {
      return res.status(404).json({ success: false, error: 'History item not found.' });
    }

    await writeDB(db);
    res.status(200).json({ success: true, message: 'Item removed from history.' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete history item.' });
  }
}
