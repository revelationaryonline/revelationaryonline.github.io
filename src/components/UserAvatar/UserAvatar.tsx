import React, { useState, useEffect } from 'react';
import { Avatar, Skeleton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { User } from 'firebase/auth';
import Cookies from 'js-cookie';

interface UserAvatarProps {
  user: User | null;
  size?: number;
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  user, 
  size = 40,
  className 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  
  // Reset states when user or photoURL changes
  useEffect(() => {
    const c = Cookies.get('userId')
    setUserId(c ? parseInt(c) : null);
    if (user && user.photoURL) {
      setLoading(false);
      setError(false);
    }
  }, [user, user?.photoURL]);

  if (!user) {
    return (
      <Avatar 
        sx={{ 
          width: size, 
          height: size,
          bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
        }}
        className={className}
      >
        <PersonIcon sx={{ width: size/2, height: size/2 }} />
      </Avatar>
    );
  }

  if (!user.photoURL) {
    return (
      <Avatar 
        sx={{ 
          width: size, 
          height: size,
          bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
        }}
        className={className}
      >
        <PersonIcon sx={{ width: size/2, height: size/2 }} />
      </Avatar>
    );
  }

  if (loading && !error) {
    return (
      <Skeleton
        variant="circular"
        width={size}
        height={size}
        sx={{
          bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
        }}
        className={className}
      />
    );
  }

  return (
    <Avatar
      sx={{ 
        width: size, 
        height: size,
        borderRadius: 1,
        bgcolor: theme => theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200',
        display: error ? 'flex' : 'block'
      }}
      className={className}
    >
      {!error ? (
        <img
          src={user?.photoURL}
          alt={user?.displayName || 'User'}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            borderRadius: 0,
          }}
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      ) : (
        <PersonIcon sx={{ width: size/2, height: size/2 }} />
      )}
    </Avatar>
  );
};
