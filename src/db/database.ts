import * as SQLite from 'expo-sqlite';
import { Platform, Alert, Animated, Dimensions } from 'react-native';
import { CHAPTERS_SEED, EXERCISES_SEED } from './seeds';

const DB_NAME = 'smartlearn.db';

// Use openDatabase as the primary legacy entry, or openDatabaseSync if strictly needed
const getDb = () => {
  // @ts-ignore
  if (SQLite.openDatabaseSync) return SQLite.openDatabaseSync(DB_NAME);
  // @ts-ignore
  return SQLite.openDatabase(DB_NAME);
};

export const db = getDb();

export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    // @ts-ignore
    db.transaction((tx: any) => {
      // Students table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          class TEXT NOT NULL,
          school TEXT NOT NULL,
          language TEXT DEFAULT 'fr',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );`
      );
      
      // ... same for others, adding : any to avoid lint errors in tx
      // Chapters table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS chapters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT
        );`
      );

      // Skills / Competencies table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          chapter_id INTEGER,
          name TEXT NOT NULL,
          FOREIGN KEY (chapter_id) REFERENCES chapters (id)
        );`
      );

      // Student Knowledge (BKT) table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS student_knowledge (
          student_id INTEGER,
          skill_id INTEGER,
          pL REAL DEFAULT 0.2,
          last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (student_id, skill_id),
          FOREIGN KEY (student_id) REFERENCES students (id),
          FOREIGN KEY (skill_id) REFERENCES skills (id)
        );`
      );

      // Exercises table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS exercises (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          skill_id INTEGER,
          chapter_id INTEGER, -- Added for easier filtering
          question TEXT NOT NULL,
          options TEXT NOT NULL, -- JSON string
          answer TEXT NOT NULL,
          explanation_peulh TEXT,
          audio_path TEXT,
          difficulty REAL DEFAULT 0.5,
          FOREIGN KEY (skill_id) REFERENCES skills (id)
        );`
      );

      // Attempts table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS attempts (
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

      // Migrations: Add synced column if it doesn't exist (safety for existing DBs)
      tx.executeSql('PRAGMA table_info(attempts);', [], (_: any, { rows }: any) => {
        let hasSynced = false;
        for (let i = 0; i < rows.length; i++) {
          if (rows.item(i).name === 'synced') hasSynced = true;
        }
        if (!hasSynced) {
          tx.executeSql('ALTER TABLE attempts ADD COLUMN synced INTEGER DEFAULT 0;');
        }
      });

      // Seed Chapters
      tx.executeSql('SELECT COUNT(*) as count FROM chapters', [], (_: any, { rows }: any) => {
        if (rows.item(0).count === 0) {
          CHAPTERS_SEED.forEach(ch => {
            tx.executeSql('INSERT INTO chapters (title, description) VALUES (?, ?)', [ch.title, ch.description]);
          });
          
          // Seed Exercises
          EXERCISES_SEED.forEach(ex => {
            tx.executeSql(
              'INSERT INTO exercises (chapter_id, question, options, answer, explanation_peulh, difficulty) VALUES (?, ?, ?, ?, ?, ?)',
              [ex.chapter_id, ex.question, ex.options, ex.answer, ex.explanation_peulh, ex.difficulty]
            );
          });
        }
      });

    }, (err: any) => {
      console.error('Error initializing database:', err);
      reject(err);
    }, () => {
      console.log('Database initialized successfully with seeds');
      resolve();
    });
  });
};
