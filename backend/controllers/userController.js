const pool = require('../db');

// Get user profile and their reports
const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    // Get user info
    const user = await pool.query(
      'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user reports with upvote counts
    const reports = await pool.query(
      `SELECT reports.*, 
              COUNT(upvotes.id) AS upvote_count
       FROM reports
       LEFT JOIN upvotes ON reports.id = upvotes.report_id
       WHERE reports.user_id = $1
       GROUP BY reports.id
       ORDER BY reports.created_at DESC`,
      [id]
    );

    res.status(200).json({
      user: user.rows[0],
      reports: reports.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getUserProfile };