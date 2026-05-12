const pool = require('../db');

// Get all reports ordered by upvotes
const getReports = async (req, res) => {
  const { q, tool, status, sort } = req.query;

  try {
    const result = await pool.query(
      `SELECT reports.*, 
              COUNT(upvotes.id) AS upvote_count,
              users.name AS author_name
       FROM reports
       LEFT JOIN upvotes ON reports.id = upvotes.report_id
       JOIN users ON reports.user_id = users.id
       WHERE ($1::text IS NULL OR reports.tool_name ILIKE '%' || $1 || '%')
       AND ($2::text IS NULL OR reports.status = $2)
       AND ($3::text IS NULL OR 
            to_tsvector('english', 
              reports.tool_name || ' ' || 
              reports.title || ' ' || 
              reports.description
            ) @@ plainto_tsquery('english', $3))
       GROUP BY reports.id, users.name
       ORDER BY ${sort === 'recent' ? 'reports.created_at' : 'upvote_count'} DESC`,
      [tool || null, status || null, q || null]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single report
const getReport = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT reports.*, 
              COUNT(upvotes.id) AS upvote_count,
              users.name AS author_name
       FROM reports
       LEFT JOIN upvotes ON reports.id = upvotes.report_id
       JOIN users ON reports.user_id = users.id
       WHERE reports.id = $1
       GROUP BY reports.id, users.name`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create a report
const createReport = async (req, res) => {
  const { tool_name, title, description, severity, status } = req.body;
  const user_id = req.user.id;
  const screenshot_url = req.file ? req.file.path : null;

  try {
    const result = await pool.query(
      `INSERT INTO reports (user_id, tool_name, title, description, severity, status, screenshot_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [user_id, tool_name, title, description, severity, status || 'Ongoing', screenshot_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a report
const updateReport = async (req, res) => {
  const { id } = req.params;
  const { tool_name, title, description, severity, status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE reports 
       SET tool_name = $1, title = $2, description = $3, 
           severity = $4, status = $5, updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [tool_name, title, description, severity, status, id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a report
const deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM reports WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }

    res.status(200).json({ message: 'Report deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getReports, getReport, createReport, updateReport, deleteReport };