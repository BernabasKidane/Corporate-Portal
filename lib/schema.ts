import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  json,
  integer,
} from 'drizzle-orm/pg-core';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  password: varchar('password', { length: 256 }).notNull(),
  name: varchar('name', { length: 256 }).notNull(),
  role: varchar('role', { length: 50 }).default('pending').notNull(), // pending, employee, manager, admin
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Onboarding Progress table
export const onboardingProgress = pgTable('onboarding_progress', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  moduleId: integer('module_id').references(() => onboardingModules.id),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
});

// Onboarding Modules table
export const onboardingModules = pgTable('onboarding_modules', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 1000 }),
  content: json('content').notNull(), // Will store video URLs, reading materials
  order: integer('order').notNull(),
});

// Quiz Questions table
export const quizQuestions = pgTable('quiz_questions', {
  id: serial('id').primaryKey(),
  question: varchar('question', { length: 1000 }).notNull(),
  options: json('options').notNull(), // Array of possible answers
  correctAnswer: varchar('correct_answer', { length: 256 }).notNull(),
});

// Quiz Results table
export const quizResults = pgTable('quiz_results', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  completedAt: timestamp('completed_at').defaultNow(),
});
