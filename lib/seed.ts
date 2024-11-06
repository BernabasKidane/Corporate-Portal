import { db } from './db';
import { onboardingModules, quizQuestions, users } from './schema';
import bcrypt from 'bcrypt';

async function seed() {
  try {
    // Clear existing data
    await db.delete(quizQuestions);
    await db.delete(onboardingModules);

    // Seed onboarding modules
    await db.insert(onboardingModules).values([
      {
        title: 'Welcome to Our Company',
        description: 'Learn about our company culture, values, and mission.',
        content: {
          videoUrl: 'https://example.com/welcome-video.mp4',
          readingMaterial: `
            # Welcome to Our Company!

            We're excited to have you join our team. This module will introduce you to our:
            - Company History
            - Core Values
            - Mission Statement
            - Company Culture

            Please watch the welcome video and read through the materials carefully.
          `,
        },
        order: 1,
      },
      {
        title: 'Health and Safety Guidelines',
        description: 'Essential health and safety protocols for all employees.',
        content: {
          videoUrl: 'https://example.com/safety-video.mp4',
          readingMaterial: `
            # Health and Safety Guidelines

            Your safety is our top priority. This module covers:
            - Workplace Safety Protocols
            - Emergency Procedures
            - First Aid Locations
            - Reporting Incidents
            - COVID-19 Policies
          `,
        },
        order: 2,
      },
      {
        title: 'IT Systems and Security',
        description: 'Introduction to our IT systems and security policies.',
        content: {
          videoUrl: 'https://example.com/it-security-video.mp4',
          readingMaterial: `
            # IT Systems and Security

            Learn about our:
            - Email Systems
            - Internal Software
            - Security Protocols
            - Password Policies
            - Data Protection Guidelines
          `,
        },
        order: 3,
      },
    ]);

    // Seed quiz questions
    await db.insert(quizQuestions).values([
      {
        question: "What are our company's core values?",
        options: [
          'Innovation, Integrity, Teamwork',
          'Profit, Growth, Sales',
          'Marketing, Sales, Support',
          'Products, Services, Solutions',
        ],
        correctAnswer: 'Innovation, Integrity, Teamwork',
      },
      {
        question: 'What should you do in case of a workplace emergency?',
        options: [
          'Continue working',
          'Call your manager',
          'Follow the emergency evacuation procedure',
          'Check your email',
        ],
        correctAnswer: 'Follow the emergency evacuation procedure',
      },
      {
        question: 'How often should you change your password?',
        options: [
          'Never',
          'Every 90 days',
          'Once a year',
          'When someone asks you to',
        ],
        correctAnswer: 'Every 90 days',
      },
      {
        question: 'Where should you report a security incident?',
        options: [
          'To your friends',
          'On social media',
          'To the IT security team immediately',
          'Wait until next week',
        ],
        correctAnswer: 'To the IT security team immediately',
      },
      {
        question: 'What is the proper way to handle confidential information?',
        options: [
          'Share it with everyone',
          'Store it on your personal device',
          'Follow the data protection guidelines',
          'Email it to yourself',
        ],
        correctAnswer: 'Follow the data protection guidelines',
      },
    ]);

    // Seed manager user
    await db.insert(users).values({
      email: 'manager@company.com',
      password: await bcrypt.hash('manager123', 10),
      name: 'John Manager',
      role: 'manager',
    });

    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Failed to seed database:', error);
    process.exit(1);
  });
