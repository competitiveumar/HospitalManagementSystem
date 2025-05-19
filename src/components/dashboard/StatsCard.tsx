import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  linkTo?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, linkTo }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (linkTo) {
      navigate(linkTo);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        },
      }}
    >
      {/* Colored background accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '8px',
          backgroundColor: color,
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: `${color}15`, // Semi-transparent version of the color
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>

      <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontWeight: 500 }}>
        {value}
      </Typography>

      {linkTo && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton
            size="small"
            onClick={handleNavigate}
            sx={{
              color: color,
              '&:hover': {
                backgroundColor: `${color}15`,
              },
            }}
          >
            <ArrowForward />
          </IconButton>
        </Box>
      )}
    </Paper>
  );
};

export default StatsCard; 