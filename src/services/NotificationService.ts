import { Notification } from '../contexts/NotificationContext';

// Study guide daily content type
export interface StudyGuideDay {
  day: number;
  title: string;
  verse: string;
  content: string;
  reflection: string;
  prayer: string;
}

// Example 7-day Bible study content
export const studyGuideContent: StudyGuideDay[] = [
  {
    day: 1,
    title: 'Beginning with Genesis',
    verse: 'Genesis, 1:1-5',
    content: 'In the beginning, God created the heavens and the earth. This foundational text establishes God as the creator of all things, setting the stage for understanding our relationship with Him and His creation.',
    reflection: 'How does recognizing God as creator change your perspective on the world around you?',
    prayer: 'Creator God, help me to see Your hand in all of creation and to honor You as the source of all life.'
  },
  {
    day: 2,
    title: 'Understanding God\'s Love',
    verse: 'John 3:16-17',
    content: 'God\'s love for humanity is demonstrated through the gift of His son. This passage reveals the depth of God\'s love and His desire for reconciliation with humanity.',
    reflection: 'In what ways have you experienced God\'s love in your life?',
    prayer: 'Loving Father, help me to fully comprehend the depth of Your love and to share that love with others.'
  },
  {
    day: 3,
    title: 'Faith and Trust',
    verse: 'Hebrews 11:1-6',
    content: 'Faith is the assurance of things hoped for, the conviction of things not seen. This chapter highlights the importance of faith in our relationship with God.',
    reflection: 'What areas of your life require more faith and trust in God?',
    prayer: 'Lord, increase my faith. Help me to trust in Your promises even when I cannot see the path ahead.'
  },
  {
    day: 4,
    title: 'Living in Grace',
    verse: 'Ephesians 2:8-10',
    content: 'Salvation is a gift from God, received through faith, not earned through works. This passage emphasizes God\'s grace and our response to it.',
    reflection: 'How does understanding grace impact your daily actions?',
    prayer: 'God of grace, thank You for the gift of salvation. Help me to live as a testament to Your grace and love.'
  },
  {
    day: 5,
    title: 'Overcoming Challenges',
    verse: 'James 1:2-8',
    content: 'Trials develop perseverance and maturity in our faith. This passage encourages believers to view challenges as opportunities for growth.',
    reflection: 'What current challenge could be viewed as an opportunity for spiritual growth?',
    prayer: 'Father, give me strength in times of trial. Help me to grow through challenges rather than be defeated by them.'
  },
  {
    day: 6,
    title: 'Living in Community',
    verse: 'Acts 2:42-47',
    content: 'The early church demonstrated the power of Christian community through fellowship, worship, and mutual care. This passage models how believers can support one another.',
    reflection: 'How can you better engage with your faith community?',
    prayer: 'Lord, help me to be an active, supportive member of my faith community, both giving and receiving as needed.'
  },
  {
    day: 7,
    title: 'The Great Commission',
    verse: 'Matthew 28:16-20',
    content: 'Jesus commands His followers to make disciples of all nations. This passage reminds us of our mission to share the Gospel with others.',
    reflection: 'What opportunities do you have to share your faith with others?',
    prayer: 'Jesus, give me courage to share Your message of love and redemption with those around me.'
  }
];

// Function to generate system notifications
export const generateSystemNotifications = (): Omit<Notification, 'id' | 'date' | 'read'>[] => {
  return [
    {
      title: 'Welcome to the Bible Study Tool',
      message: 'Thank you for joining! Your 7-day study guide is now available.',
      type: 'system',
      link: '/dashboard'
    },
    {
      title: 'New Feature Available',
      message: 'You can now bookmark your favorite passages for easy reference.',
      type: 'system'
    }
  ];
};

// Function to generate study guide notifications based on the day
export const generateStudyNotification = (day: number): Omit<Notification, 'id' | 'date' | 'read'> => {
  const studyDay = studyGuideContent[day - 1];
  return {
    title: `Day ${day}: ${studyDay.title}`,
    message: `Today's study focuses on ${studyDay.verse}. Open to start your devotional.`,
    type: 'study',
    link: `/study/day/${day}`
  };
};

// Function to generate reminder notifications
export const generateReminderNotification = (): Omit<Notification, 'id' | 'date' | 'read'> => {
  return {
    title: 'Daily Bible Study Reminder',
    message: 'Don\'t forget to complete today\'s study guide and reflection.',
    type: 'reminder',
    link: '/dashboard'
  };
};

// Function to send weekly email digest
export const sendWeeklyEmailDigest = async (email: string, name: string) => {
  // This would normally connect to your email service provider (Mailchimp, SendGrid, etc.)
  // For now, we'll just log the action
  console.log(`Sending weekly digest to ${name} (${email})`);
  
  // Mock successful API call
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Function to schedule notifications
export const scheduleNotifications = (
  addNotification: (notification: Omit<Notification, 'id' | 'date' | 'read'>) => void
) => {
  // Add initial system notifications
  generateSystemNotifications().forEach(notification => {
    addNotification(notification);
  });

  // Schedule daily study guide notification - in a real app, this would use proper scheduling
  const today = new Date();
  const dayOfStudy = (today.getDate() % 7) + 1; // Get day 1-7 based on date
  
  addNotification(generateStudyNotification(dayOfStudy));
  
  // Mock scheduling future notifications - normally would use a proper scheduler
  setTimeout(() => {
    addNotification(generateReminderNotification());
  }, 4 * 60 * 60 * 1000); // 4 hours later
  
  // In a real implementation, you would use a proper scheduling system
  return () => {
    // Cleanup function
  };
};

// Function to process new email signups
export const processSignup = async (email: string, name: string) => {
  // This would typically:
  // 1. Add the user to your email marketing platform
  // 2. Store the lead in your WordPress backend
  // 3. Schedule initial welcome emails
  // 4. Record the conversion event for analytics
  
  // For now, just simulate an API call
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return success information
  return {
    success: true,
    message: 'Successfully subscribed to the Bible study guide',
    studyGuideUrl: '/assets/bible-study-guide.pdf' // URL to the downloadable guide
  };
};

export default {
  studyGuideContent,
  generateSystemNotifications,
  generateStudyNotification,
  generateReminderNotification,
  sendWeeklyEmailDigest,
  scheduleNotifications,
  processSignup
};
