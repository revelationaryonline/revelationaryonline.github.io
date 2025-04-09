import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Tooltip,
  CircularProgress,
  Badge
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import StarIcon from '@mui/icons-material/Star';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import { useSubscription } from '../../contexts/SubscriptionContext';
import SubscriptionCheck from '../Subscription/SubscriptionCheck';
import { getAuthHeaders } from '../../services/readingService';

// Types for our achievements data
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  date_earned: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

interface ReadingProgress {
  total_chapters_read: number;
  total_books_completed: number;
  old_testament_progress: number;
  new_testament_progress: number;
  current_streak: number;
  longest_streak: number;
  level: number;
  points: number;
  points_to_next_level: number;
}

// Helper function to render appropriate icon
const getIconForAchievement = (iconName: string) => {
  switch (iconName) {
    case 'book':
      return <MenuBookIcon />;
    case 'star':
      return <StarIcon />;
    case 'fire':
      return <LocalFireDepartmentIcon />;
    case 'trophy':
      return <EmojiEventsIcon />;
    default:
      return <LightbulbIcon />;
  }
};

// Helper to get color based on rarity
const getRarityColor = (rarity: string) => {
  switch (rarity) {
    case 'common':
      return '#90caf9'; // Light blue
    case 'uncommon':
      return '#81c784'; // Light green
    case 'rare':
      return '#ba68c8'; // Purple
    case 'epic':
      return '#ff9800'; // Orange
    case 'legendary':
      return '#ffd700'; // Gold
    default:
      return '#90caf9';
  }
};

const AchievementsPanel: React.FC<{ user: any; wpToken: string }> = ({ user, wpToken }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscription } = useSubscription();
  
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        
        // Fetch achievements from the WordPress REST API
        const response = await fetch(
          `https://revelationary.org/wp-json/revelationary/v1/reading-progress`, 
          {
            headers: getAuthHeaders(user, wpToken)}
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        const data = await response.json();
        
        // Update state with the fetched data
        setAchievements(data.achievements || []);
        setProgress(data.progress || null);
        
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setError('Failed to load achievements. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAchievements();
  }, [user, wpToken]);
  
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
  
  return (
    <SubscriptionCheck feature="all">
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" sx={{ fontSize: 16 }}>
            Achievements
          </Typography>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        {/* Reading Progress Summary */}
        {progress && (
          <Box sx={{ mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h3" align="center" color="primary">
                      {progress.total_chapters_read}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Chapters Read
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h3" align="center" color="primary">
                      {progress.total_books_completed}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Books Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h3" align="center" color="primary">
                      {progress.current_streak}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Day Streak
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h3" align="center" color="primary">
                      {progress.level}
                    </Typography>
                    <Typography variant="body2" align="center" color="textSecondary">
                      Reader Level
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            {/* Testament Progress */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Old Testament Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress.old_testament_progress} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }} 
              />
              <Typography variant="body2" color="textSecondary">
                {progress.old_testament_progress}% Complete
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                New Testament Progress
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={progress.new_testament_progress} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }} 
              />
              <Typography variant="body2" color="textSecondary">
                {progress.new_testament_progress}% Complete
              </Typography>
            </Box>
            
            {/* Level Progress */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Progress to Level {progress.level + 1}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={(progress.points / (progress.points + progress.points_to_next_level)) * 100} 
                sx={{ height: 10, borderRadius: 5, mb: 1 }} 
              />
              <Typography variant="body2" color="textSecondary">
                {progress.points} / {progress.points + progress.points_to_next_level} Points
              </Typography>
            </Box>
          </Box>
        )}
        
        {/* Achievements Showcase */}
        <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
          Your Achievements
        </Typography>
        
        {achievements.length > 0 ? (
          <Grid container spacing={2}>
            {achievements.map((achievement) => (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card sx={{ 
                  display: 'flex', 
                  height: '100%',
                  border: `1px solid ${getRarityColor(achievement.rarity)}`,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    width: '100%' 
                  }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ 
                          backgroundColor: getRarityColor(achievement.rarity),
                          borderRadius: '50%',
                          p: 1,
                          mr: 1,
                          color: 'white'
                        }}>
                          {getIconForAchievement(achievement.icon)}
                        </Box>
                        <Typography variant="h6" component="div">
                          {achievement.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {achievement.description}
                      </Typography>
                    </CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', p: 1, pt: 0 }}>
                      <Chip 
                        label={achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)} 
                        size="small"
                        sx={{ 
                          backgroundColor: getRarityColor(achievement.rarity),
                          color: 'white',
                          mr: 1
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        Earned on {new Date(achievement.date_earned).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="textSecondary">
              You haven't earned any achievements yet. Start reading the Bible to unlock them!
            </Typography>
          </Box>
        )}
      </Paper>
    </SubscriptionCheck>
  );
};

export default AchievementsPanel;
