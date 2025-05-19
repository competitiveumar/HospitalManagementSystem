import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Divider,
  LinearProgress,
  useTheme,
} from '@mui/material';
import { Medication, Biotech, Healing } from '@mui/icons-material';
import { useAppSelector } from '../../hooks/reduxHooks';

const InventoryStatus: React.FC = () => {
  const theme = useTheme();
  const { items } = useAppSelector((state) => state.inventory);
  
  // Filter and sort items by stock level (lowest stock first)
  const sortedItems = [...items]
    .sort((a, b) => {
      const percentA = (a.quantity / a.reorderLevel) * 100;
      const percentB = (b.quantity / b.reorderLevel) * 100;
      return percentA - percentB;
    })
    .slice(0, 5); // Take only 5 items

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medicine':
        return <Medication />;
      case 'equipment':
        return <Biotech />;
      case 'supplies':
        return <Healing />;
      default:
        return <Medication />;
    }
  };

  // Get color based on stock level
  const getStockLevelColor = (quantity: number, reorderLevel: number) => {
    const percentage = (quantity / reorderLevel) * 100;
    
    if (percentage <= 100) {
      return theme.palette.error.main; // Below or at reorder level
    } else if (percentage <= 150) {
      return theme.palette.warning.main; // Slightly above reorder level
    } else {
      return theme.palette.success.main; // Well-stocked
    }
  };

  // Get stock level text
  const getStockLevelText = (quantity: number, reorderLevel: number) => {
    const percentage = (quantity / reorderLevel) * 100;
    
    if (quantity <= reorderLevel) {
      return 'Low Stock';
    } else if (percentage <= 150) {
      return 'Moderate';
    } else {
      return 'Well-stocked';
    }
  };

  return (
    <Box>
      {sortedItems.length === 0 ? (
        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          No inventory items available
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
          {sortedItems.map((item, index) => {
            const stockColor = getStockLevelColor(item.quantity, item.reorderLevel);
            const stockText = getStockLevelText(item.quantity, item.reorderLevel);
            const stockPercentage = Math.min(100, Math.round((item.quantity / item.reorderLevel) * 100));
            
            return (
              <React.Fragment key={item.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar
                      alt={item.name}
                      src={item.image}
                      variant="rounded"
                      sx={{ 
                        bgcolor: item.image ? 'transparent' : `${theme.palette.primary.main}20`,
                        color: theme.palette.primary.main
                      }}
                    >
                      {!item.image && getCategoryIcon(item.category)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" component="span" fontWeight={500}>
                          {item.name}
                        </Typography>
                        <Chip
                          label={stockText}
                          size="small"
                          sx={{
                            backgroundColor: `${stockColor}20`,
                            color: stockColor,
                            fontWeight: 500,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography variant="body2" color="text.secondary" component="span">
                          {`${item.quantity} units available`}
                        </Typography>
                        <Box sx={{ width: '100%', mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={stockPercentage}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: theme.palette.grey[200],
                              '& .MuiLinearProgress-bar': {
                                borderRadius: 3,
                                backgroundColor: stockColor,
                              },
                            }}
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < sortedItems.length - 1 && (
                  <Divider component="li" sx={{ my: 1 }} />
                )}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default InventoryStatus; 