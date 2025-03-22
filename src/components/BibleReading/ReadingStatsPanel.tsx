import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SubscriptionCheck from '../Subscription/SubscriptionCheck';

// Types
interface ReadingDay {
  date: string;
  completed: boolean;
  chapters_read: number;
}

interface ReadingStats {
  current_streak: number;
  longest_streak: number;
  last_30_days: ReadingDay[];
  total_days_read: number;
  average_chapters_per_day: number;
}

// Helper function to generate dates for calendar
const generateCalendarDays = (days: ReadingDay[]) => {
  // Create an indexed map of completed days for easy lookup
  const completedDaysMap = days.reduce((acc: Record<string, ReadingDay>, day) => {
    acc[day.date] = day;
    return acc;
  }, {});
  
  // Generate a 30-day calendar (including empty days)
  const calendar: (ReadingDay | null)[] = [];
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const dateStr = date.toISOString().split('T')[0];
    
    if (completedDaysMap[dateStr]) {
      calendar.unshift(completedDaysMap[dateStr]);
    } else {
      calendar.unshift({
        date: dateStr,
        completed: false,
        chapters_read: 0
      });
    }
  }
  
  return calendar;
};

const ReadingStatsPanel: React.FC = () => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscription } = useSubscription();
  
  useEffect(() => {
    const fetchReadingStats = async () => {
      try {
        setLoading(true);
        
        // Get the WordPress token
        const wpToken = localStorage.getItem('wpToken') || '';
        
        // Fetch reading streak data from WordPress REST API
        const response = await fetch(
          `${process.env.REACT_APP_WP_API_URL}/wp-json/revelationary/v1/reading-streak`, 
          {
            headers: {
              'Authorization': `Basic ${wpToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch reading stats');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error('Error fetching reading stats:', err);
        setError('Failed to load reading statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReadingStats();
  }, []);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error" variant="body1">{error}</Typography>
      </Box>
    );
  }
  
  const calendarDays = stats ? generateCalendarDays(stats.last_30_days) : [];
  
  return (
    <SubscriptionCheck feature="all">
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2">
            Reading Stats & Streak
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {stats && (
          <>
            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                      <WhatshotIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="h3" color="primary">
                        {stats.current_streak}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Current Streak (Days)
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                      Longest Streak: {stats.longest_streak} days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                      {stats.total_days_read}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Days Read
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color="primary">
                      {stats.average_chapters_per_day.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Chapters Per Day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Calendar Visualization */}
            <Typography variant="h6" gutterBottom>
              Last 30 Days Activity
            </Typography>
            
            <Box sx={{ mt: 2, mb: 4 }}>
              <Grid container spacing={1}>
                {calendarDays.map((day, index) => (
                  <Grid item key={index}>
                    <Tooltip title={
                      day ? 
                      `${new Date(day.date).toLocaleDateString()}: ${day.completed ? 
                        `${day.chapters_read} chapters read` : 
                        'No reading activity'}`
                      : ''
                    }>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '4px',
                          backgroundColor: day?.completed ? 'primary.main' : 'background.paper',
                          border: day?.completed ? 'none' : '1px solid #ddd',
                          opacity: day?.completed ? 1 : 0.6,
                          '&:hover': {
                            opacity: 1,
                          },
                        }}
                      >
                        {day?.completed && (
                          <CheckCircleIcon sx={{ fontSize: 16, color: 'white' }} />
                        )}
                      </Box>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
            
            {/* Reading Recommendation */}
            <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Today's Reading Suggestion
              </Typography>
              <Typography variant="body2">
                Continue your streak today! Read at least one chapter to maintain your momentum.
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </SubscriptionCheck>
  );
};

export default ReadingStatsPanel;
