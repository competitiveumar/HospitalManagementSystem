import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  Button,
  Pagination,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  Archive as ArchiveIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/reduxHooks';
import { InventoryItem } from '../../types';
import placeholderImages from '../../assets/images/placeholder';
import Grid from '../common/Grid';

// Calculate stock level percentage
const calculateStockLevel = (quantity: number, reorderLevel: number) => {
  const maxLevel = reorderLevel * 3; // Assuming max stock is 3 times reorder level
  return Math.min(100, Math.max(0, (quantity / maxLevel) * 100));
};

// Get stock level color
const getStockLevelColor = (quantity: number, reorderLevel: number) => {
  if (quantity <= reorderLevel) return 'error';
  if (quantity <= reorderLevel * 1.5) return 'warning';
  return 'success';
};

// Get image based on category
const getCategoryImage = (category: string) => {
  switch (category) {
    case 'medicine':
      return placeholderImages.medicine;
    case 'equipment':
      return placeholderImages.equipment;
    case 'supplies':
      return placeholderImages.supplies;
    default:
      return placeholderImages.generic;
  }
};

const InventoryList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const inventoryItems = useAppSelector((state) => state.inventory.items);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockLevelFilter, setStockLevelFilter] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, itemId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedItemId(itemId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItemId(null);
  };

  const handleView = () => {
    if (selectedItemId) {
      navigate(`/inventory/${selectedItemId}`);
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    if (selectedItemId) {
      navigate(`/inventory/edit/${selectedItemId}`);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    // Would dispatch delete action here
    setSuccessMessage('Item successfully deleted from inventory.');
    setTimeout(() => setSuccessMessage(null), 3000);
    handleMenuClose();
  };

  const handleAddNew = () => {
    navigate('/inventory/add');
  };

  const handleCategoryFilterChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };

  const handleStockLevelFilterChange = (event: SelectChangeEvent) => {
    setStockLevelFilter(event.target.value);
    setPage(1);
  };

  // Filter inventory items based on search term, category and stock level
  const filteredItems = inventoryItems.filter((item) => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchStr) || 
      item.category.toLowerCase().includes(searchStr) ||
      item.supplier.toLowerCase().includes(searchStr);
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    let matchesStockLevel = true;
    if (stockLevelFilter === 'low') {
      matchesStockLevel = item.quantity <= item.reorderLevel;
    } else if (stockLevelFilter === 'medium') {
      matchesStockLevel = item.quantity > item.reorderLevel && item.quantity <= item.reorderLevel * 2;
    } else if (stockLevelFilter === 'high') {
      matchesStockLevel = item.quantity > item.reorderLevel * 2;
    }
    
    return matchesSearch && matchesCategory && matchesStockLevel;
  });

  // Paginate results
  const paginatedItems = filteredItems.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  // Count items that need reordering
  const reorderCount = inventoryItems.filter(item => item.quantity <= item.reorderLevel).length;

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Inventory Management
      </Typography>
      
      {successMessage && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {successMessage}
        </Alert>
      )}
      
      {reorderCount > 0 && (
        <Alert 
          severity="warning" 
          icon={<WarningIcon />}
          sx={{ mb: 4 }}
        >
          <Typography variant="body1">
            <strong>{reorderCount} items</strong> are low in stock and need to be reordered.
          </Typography>
        </Alert>
      )}

      <Card sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Box width={{ xs: '100%', md: '33.33%' }} px={1}>
            <TextField
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Box>
          <Box width={{ xs: '100%', md: '25%' }} px={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="category-filter-label">Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryFilterChange}
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="medicine">Medicines</MenuItem>
                <MenuItem value="equipment">Equipment</MenuItem>
                <MenuItem value="supplies">Supplies</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box width={{ xs: '100%', md: '25%' }} px={1}>
            <FormControl fullWidth size="small">
              <InputLabel id="stock-level-filter-label">Stock Level</InputLabel>
              <Select
                labelId="stock-level-filter-label"
                value={stockLevelFilter}
                label="Stock Level"
                onChange={handleStockLevelFilterChange}
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="low">Low Stock</MenuItem>
                <MenuItem value="medium">Medium Stock</MenuItem>
                <MenuItem value="high">High Stock</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box width={{ xs: '100%', md: '16.67%' }} px={1} display="flex" justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              fullWidth
              sx={{ height: '100%' }}
            >
              Add Item
            </Button>
          </Box>
        </Grid>

        <TableContainer component={Paper} elevation={0}>
          <Table aria-label="inventory table">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Unit Price</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedItems.map((item) => {
                const stockLevelPercentage = calculateStockLevel(item.quantity, item.reorderLevel);
                const stockLevelColor = getStockLevelColor(item.quantity, item.reorderLevel);
                
                return (
                  <TableRow key={item.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          src={item.image || getCategoryImage(item.category)} 
                          alt={item.name} 
                          variant="rounded"
                          sx={{ mr: 2, width: 40, height: 40 }}
                        />
                        <Typography variant="body2">{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.category.charAt(0).toUpperCase() + item.category.slice(1)} 
                        size="small"
                        color={
                          item.category === 'medicine' ? 'primary' :
                          item.category === 'equipment' ? 'secondary' :
                          item.category === 'supplies' ? 'info' : 'default'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: 150 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={stockLevelPercentage} 
                            color={stockLevelColor as any}
                            sx={{ height: 8, borderRadius: 5 }}
                          />
                        </Box>
                        <Box sx={{ minWidth: 35 }}>
                          <Typography variant="body2" color="text.secondary">
                            {stockLevelPercentage.toFixed(0)}%
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton 
                        onClick={(event) => handleMenuOpen(event, item.id)}
                        size="small"
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
              {paginatedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography variant="body2" sx={{ py: 2 }}>
                      No inventory items found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {paginatedItems.length} of {filteredItems.length} items
          </Typography>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            size="small"
          />
        </Box>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          View Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default InventoryList; 