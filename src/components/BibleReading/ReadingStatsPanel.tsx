import React, { useState, useEffect } from "react";
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
  IconButton,
  Chip,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useSubscription } from "../../contexts/SubscriptionContext";
import SubscriptionCheck from "../Subscription/SubscriptionCheck";
import { getAuthHeaders } from "../../services/readingService";

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

interface ReadingProgress {
  reading_progress: {
    [book: string]: number[];
  };
}

// Helper function to generate dates for calendar
const generateCalendarDays = (days: ReadingDay[]) => {
  // Create an indexed map of completed days for easy lookup
  const completedDaysMap = days.reduce(
    (acc: Record<string, ReadingDay>, day) => {
      acc[day.date] = day;
      return acc;
    },
    {}
  );

  // Generate a 30-day calendar (including empty days)
  const calendar: (ReadingDay | null)[] = [];
  const today = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    const dateStr = date.toISOString().split("T")[0];

    if (completedDaysMap[dateStr]) {
      calendar.unshift(completedDaysMap[dateStr]);
    } else {
      calendar.unshift({
        date: dateStr,
        completed: false,
        chapters_read: 0,
      });
    }
  }

  return calendar;
};

const ReadingStatsPanel: React.FC<{ user: any; wpToken: string }> = ({
  user,
  wpToken,
}) => {
  const [stats, setStats] = useState<ReadingStats | null>(null);
  const [readingProgress, setReadingProgress] =
    useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subscription } = useSubscription();

  useEffect(() => {
    // console.log(subscription);
    const fetchReadingStats = async () => {
      try {
        setLoading(true);

        // Get the WordPress token
        const wpToken = localStorage.getItem("wpToken") || "";

        // Fetch reading streak data from WordPress REST API
        const [statsResponse, progressResponse] = await Promise.all([
          fetch(
            `https://revelationary.org/wp-json/revelationary/v1/reading-streak`,
            {
              headers: getAuthHeaders(user, wpToken),
            }
          ),
          fetch(
            `https://revelationary.org/wp-json/revelationary/v1/reading-progress`,
            {
              headers: getAuthHeaders(user, wpToken),
            }
          ),
        ]);

        if (!statsResponse.ok || !progressResponse.ok) {
          throw new Error("Failed to fetch reading stats");
        }

        const [statsData, progressData] = await Promise.all([
          statsResponse.json(),
          progressResponse.json(),
        ]);

        // console.log(statsData, progressData);

        setStats(statsData);
        setReadingProgress(progressData);
      } catch (err) {
        console.error("Error fetching reading stats:", err);
        setError("Failed to load reading statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReadingStats();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 2 }}>
        <Typography color="error" variant="body1">
          {error}
        </Typography>
      </Box>
    );
  }

  const calendarDays = stats ? generateCalendarDays(stats.last_30_days) : [];

  const getBookStats = () => {
    if (!readingProgress?.reading_progress) return null;

    const totalBooks = Object.keys(readingProgress.reading_progress).length;
    const totalChapters = Object.values(
      readingProgress.reading_progress
    ).reduce((sum, chapters) => sum + chapters.length, 0);

    const booksWithChapters = Object.entries(readingProgress.reading_progress)
      .map(([book, chapters]) => ({
        book,
        chaptersRead: chapters.length,
        chapters: Array.isArray(chapters) ? chapters.sort((a, b) => a - b) : [],
      }))
      .sort((a, b) => b.chaptersRead - a.chaptersRead);

    return {
      totalBooks,
      totalChapters,
      booksWithChapters,
    };
  };

  return (
    <SubscriptionCheck feature="all">
      <Paper elevation={0} sx={{ p: 3, borderRadius: 2, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <CalendarMonthIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" component="h2" sx={{ fontSize: 17 }}>
            Reading Stats & Streak
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {stats && (
          <>
            {/* Summary Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      <WhatshotIcon color="error" sx={{ mr: 1, height: 38, width: 38 }} />
                      <Typography variant="h4" color="primary">
                        {stats.current_streak}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="textSecondary">
                      Current Streak (Days)
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      sx={{ display: "block", mt: 1 }}
                    >
                      Longest Streak: {stats.longest_streak} days
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={6}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.total_days_read}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Total Days Read
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ height: "100%" }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary">
                      {stats.average_chapters_per_day.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Avg. Chapters Per Day
                    </Typography>
                  </CardContent>
                </Card>
              </Grid> */}
            </Grid>

            {/* Calendar Visualization */}
            <Typography variant="h6" gutterBottom>
              Last 30 Days Activity
            </Typography>

            <Box sx={{ mt: 2, mb: 4 }}>
              <Grid container spacing={1}>
                {calendarDays.map((day, index) => (
                  <Grid item key={index}>
                    <Tooltip
                      title={
                        day
                          ? `${new Date(day.date).toLocaleDateString()}: ${
                              day.completed
                                ? `${day.chapters_read} chapters read`
                                : "No reading activity"
                            }`
                          : ""
                      }
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          backgroundColor: day?.completed
                            ? "primary.main"
                            : "background.paper",
                          border: day?.completed ? "none" : "1px solid #ddd",
                          opacity: day?.completed ? 1 : 0.6,
                          "&:hover": {
                            opacity: 1,
                          },
                        }}
                      >
                        {day?.completed && (
                          <CheckCircleIcon
                            sx={{
                              fontSize: 16,
                              color: (theme) =>
                                theme.palette.mode === "light"
                                  ? "#212121"
                                  : "primary.dark",
                            }}
                          />
                        )}
                      </Box>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Book and Chapter Stats */}
            <Typography variant="h6" gutterBottom>
              Books & Chapters Read
            </Typography>

            <Box sx={{ mb: 4 }}>
              {readingProgress && (
                <>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Total Books Read: {getBookStats()?.totalBooks || 0}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="textSecondary"
                    sx={{ display: "block", mb: 2 }}
                  >
                    Total Chapters Read: {getBookStats()?.totalChapters || 0}
                  </Typography>

                  <Grid container spacing={2}>
                    {getBookStats()?.booksWithChapters?.map((book, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ height: "100%" }}>
                          <CardContent sx={{ flex: 1 }}>
                            <Typography
                              variant="h6"
                              component="div"
                              textAlign={"left"}
                              mb={1}
                              sx={{
                                color: (theme) =>
                                  theme.palette.mode === "light"
                                    ? "#999"
                                    : "#FFFFFF",
                                fontSize: "20px",
                              }}
                            >
                              •&nbsp;{book.book}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                width: "max-content",
                                px: "5px",
                                ml: 0,
                                mt: 1,
                                mb: 1,
                                fontSize: "12px",
                                border: "1px solid #999",
                              }}
                              color="#999"
                            >
                              Chapters Read: {book.chaptersRead}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                                mt: 2,
                              }}
                            >
                              {book.chapters.map((chapter, cIndex) => (
                                <Chip
                                  key={cIndex}
                                  label={chapter.toString()}
                                  size="small"
                                  sx={{
                                    bgcolor: "primary.light",
                                    color: "primary.contrastText",
                                    fontWeight: "bold",
                                    "&:hover": {
                                      bgcolor: "primary.main",
                                      cursor: "default",
                                    },
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </>
              )}
            </Box>

            {/* Reading Recommendation */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                backgroundColor: "background.default",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Today's Reading Suggestion
              </Typography>
              <Typography variant="body2">
                Continue your streak today! Read at least one chapter to
                maintain your momentum.
              </Typography>
            </Box>
          </>
        )}
      </Paper>
    </SubscriptionCheck>
  );
};

export default ReadingStatsPanel;
