const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seed = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Clear existing data
    await pool.query('DELETE FROM upvotes');
    await pool.query('DELETE FROM reports');
    await pool.query('DELETE FROM users');

    // Reset sequences
    await pool.query('ALTER SEQUENCE users_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE reports_id_seq RESTART WITH 1');
    await pool.query('ALTER SEQUENCE upvotes_id_seq RESTART WITH 1');

    // Create seed users
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await pool.query(`
      INSERT INTO users (name, email, password) VALUES
      ('Alex Johnson', 'alex@example.com', $1),
      ('Sarah Williams', 'sarah@example.com', $1),
      ('Mike Chen', 'mike@example.com', $1),
      ('Emily Davis', 'emily@example.com', $1),
      ('James Wilson', 'james@example.com', $1)
      RETURNING id
    `, [hashedPassword]);

    console.log('✅ Users created');

    // Create seed reports
    await pool.query(`
      INSERT INTO reports (user_id, tool_name, title, description, severity, status, created_at) VALUES
      (1, 'Vercel', 'Deployments failing with 500 error', 'All deployments are failing with a 500 internal server error. Started around 9am UTC. Affecting all regions.', 'Critical', 'Ongoing', NOW() - INTERVAL '2 hours'),
      (2, 'GitHub', 'GitHub Actions workflows not triggering', 'Push events are not triggering GitHub Actions workflows. CI/CD pipelines completely broken for our team.', 'High', 'Ongoing', NOW() - INTERVAL '3 hours'),
      (3, 'Supabase', 'Database connections timing out', 'Getting connection timeout errors when trying to connect to Supabase PostgreSQL database. Affecting production.', 'Critical', 'Resolved', NOW() - INTERVAL '5 hours'),
      (4, 'AWS', 'S3 bucket uploads failing in us-east-1', 'Unable to upload files to S3 buckets in the us-east-1 region. Getting 503 errors on all upload attempts.', 'High', 'Ongoing', NOW() - INTERVAL '1 hour'),
      (5, 'Cloudinary', 'Image transformations returning 404', 'Image transformation URLs are returning 404 errors. Existing images load fine but transformations are broken.', 'Medium', 'Resolved', NOW() - INTERVAL '6 hours'),
      (1, 'npm', 'npm install failing with ECONNRESET', 'Running npm install throws ECONNRESET errors. Cannot install packages in CI environment or locally.', 'High', 'Ongoing', NOW() - INTERVAL '30 minutes'),
      (2, 'Heroku', 'Dynos crashing on startup', 'All dynos are crashing immediately after deployment. Error logs show memory quota exceeded even for simple apps.', 'Critical', 'Resolved', NOW() - INTERVAL '8 hours'),
      (3, 'Vercel', 'Environment variables not loading in production', 'Environment variables set in Vercel dashboard are not being loaded in production deployments. Works fine locally.', 'Medium', 'Ongoing', NOW() - INTERVAL '4 hours'),
      (4, 'GitHub', 'Pull request reviews not sending notifications', 'Reviewers are not receiving email or in-app notifications when added to pull requests. Team collaboration affected.', 'Low', 'Resolved', NOW() - INTERVAL '12 hours'),
      (5, 'AWS', 'Lambda functions cold start latency spike', 'Lambda functions experiencing 10x normal cold start times. Response times jumped from 200ms to 2000ms+.', 'High', 'Ongoing', NOW() - INTERVAL '45 minutes'),
      (1, 'Supabase', 'Auth email confirmations not being sent', 'New user registration email confirmations are not being delivered. Supabase auth emails completely down.', 'Critical', 'Ongoing', NOW() - INTERVAL '20 minutes'),
      (2, 'npm', 'Package versions resolving incorrectly', 'npm is resolving wrong package versions despite package-lock.json being present. Causing build failures.', 'Medium', 'Resolved', NOW() - INTERVAL '10 hours')
    `);

    console.log('✅ Reports created');

    // Create seed upvotes
    await pool.query(`
      INSERT INTO upvotes (report_id, user_id) VALUES
      (1, 2), (1, 3), (1, 4), (1, 5),
      (2, 1), (2, 3), (2, 4),
      (3, 1), (3, 2), (3, 4), (3, 5),
      (4, 1), (4, 2), (4, 3),
      (5, 1), (5, 2),
      (6, 2), (6, 3), (6, 4), (6, 5),
      (7, 1), (7, 2), (7, 3), (7, 4),
      (8, 1), (8, 3),
      (9, 2), (9, 4),
      (10, 1), (10, 2), (10, 3), (10, 5),
      (11, 2), (11, 3), (11, 4), (11, 5),
      (12, 1), (12, 3), (12, 4)
    `);

    console.log('✅ Upvotes created');
    console.log('🎉 Database seeded successfully!');
    process.exit(0);

  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();