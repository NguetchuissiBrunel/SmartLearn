import * as SQLite from 'expo-sqlite';
import { CHAPTERS_SEED, EXERCISES_SEED } from './seeds';

const DB_NAME = 'smartlearn.db';

export const db = SQLite.openDatabaseSync(DB_NAME);

export const initDatabase = async () => {
  try {
    db.execSync(
      `CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        class TEXT NOT NULL,
        school TEXT NOT NULL,
        language TEXT DEFAULT 'fr',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS chapters (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        chapter_id INTEGER,
        name TEXT NOT NULL,
        FOREIGN KEY (chapter_id) REFERENCES chapters (id)
      );

      CREATE TABLE IF NOT EXISTS student_knowledge (
        student_id INTEGER,
        skill_id INTEGER,
        pL REAL DEFAULT 0.2,
        last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (student_id, skill_id),
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (skill_id) REFERENCES skills (id)
      );

      CREATE TABLE IF NOT EXISTS exercises (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        skill_id INTEGER,
        chapter_id INTEGER,
        question TEXT NOT NULL,
        options TEXT NOT NULL,
        answer TEXT NOT NULL,
        explanation_peulh TEXT,
        audio_path TEXT,
        difficulty REAL DEFAULT 0.5,
        FOREIGN KEY (skill_id) REFERENCES skills (id)
      );

      CREATE TABLE IF NOT EXISTS attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        exercise_id INTEGER,
        is_correct INTEGER,
        synced INTEGER DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students (id),
        FOREIGN KEY (exercise_id) REFERENCES exercises (id)
      );`
    );

    // Migrations
    const tableInfo = db.getAllSync<{name: string}>('PRAGMA table_info(attempts);');
    const hasSynced = tableInfo.some(row => row.name === 'synced');
    if (!hasSynced) {
      db.execSync('ALTER TABLE attempts ADD COLUMN synced INTEGER DEFAULT 0;');
    }

    // Seed Chapters
    const chaptersCount = db.getFirstSync<{count: number}>('SELECT COUNT(*) as count FROM chapters');
    if (chaptersCount?.count === 0) {
      for (const ch of CHAPTERS_SEED) {
        db.runSync('INSERT INTO chapters (title, description) VALUES (?, ?)', ch.title, ch.description);
      }
      
      // Seed Exercises
      for (const ex of EXERCISES_SEED) {
        db.runSync(
          'INSERT INTO exercises (chapter_id, question, options, answer, explanation_peulh, difficulty) VALUES (?, ?, ?, ?, ?, ?)',
          ex.chapter_id, ex.question, ex.options, ex.answer, ex.explanation_peulh, ex.difficulty
        );
      }
    }
    console.log('Database initialized successfully with seeds');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};
