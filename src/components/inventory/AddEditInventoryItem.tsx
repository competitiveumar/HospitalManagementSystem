import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Alert,
  InputAdornment,
  Slider,
  Avatar,
  useTheme,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { v4 as uuidv4 } from 'uuid';
import { addInventoryItem, updateInventoryItem } from '../../store/slices/inventorySlice';
import { InventoryItem } from '../../types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  LocalShipping as ShippingIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import placeholderImages from '../../assets/images/placeholder';

const inventoryCategories = [
  { value: 'medicine', label: 'Medicine' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'other', label: 'Other' },
];

const AddEditInventoryItem: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  
  const inventoryItems = useAppSelector((state) => state.inventory.items);
  const itemToEdit = isEditMode 
    ? inventoryItems.find(item => item.id === id) 
    : null;
  
  const [success, setSuccess] = useState(false);

  // Formik validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    category: Yup.string().required('Category is required'),
    quantity: Yup.number()
      .required('Quantity is required')
      .integer('Quantity must be a whole number')
      .min(0, 'Quantity cannot be negative'),
    unitPrice: Yup.number()
      .required('Unit price is required')
      .min(0.01, 'Unit price must be greater than 0'),
    supplier: Yup.string().required('Supplier is required'),
    reorderLevel: Yup.number()
      .required('Reorder level is required')
      .integer('Reorder level must be a whole number')
      .min(1, 'Reorder level must be at least 1'),
    expiryDate: Yup.date().nullable(),
    location: Yup.string(),
    description: Yup.string(),
  });

  // Formik form handling
  const formik = useFormik({
    initialValues: {
      name: itemToEdit?.name || '',
      category: itemToEdit?.category || '',
      quantity: itemToEdit?.quantity || 0,
      unitPrice: itemToEdit?.unitPrice || 0,
      supplier: itemToEdit?.supplier || '',
      reorderLevel: itemToEdit?.reorderLevel || 5,
      expiryDate: itemToEdit?.expiryDate || '',
      location: itemToEdit?.location || '',
      description: itemToEdit?.description || '',
      image: itemToEdit?.image || '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (isEditMode && itemToEdit) {
        // Update existing item
        const updatedItem: InventoryItem = {
          ...itemToEdit,
          ...values,
          category: values.category as "medicine" | "equipment" | "supplies" | "other"
        };
        
        dispatch(updateInventoryItem(updatedItem));
      } else {
        // Add new item
        const newItem: InventoryItem = {
          id: uuidv4(),
          ...values,
          category: values.category as "medicine" | "equipment" | "supplies" | "other"
        };
        
        dispatch(addInventoryItem(newItem));
      }
      
      setSuccess(true);
      
      // Navigate back to inventory list after short delay
      setTimeout(() => {
        navigate('/inventory');
      }, 1500);
    },
  });

  const handleCancel = () => {
    navigate('/inventory');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        {isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {isEditMode ? 'Item updated successfully!' : 'Item added successfully!'} Redirecting...
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Box width={{ xs: '100%', md: '66.67%' }} px={2}>
          <Card>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Item Details
                </Typography>
                <Divider sx={{ mb: 3 }} />
                
                <Grid container spacing={3}>
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Item Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      error={formik.touched.name && Boolean(formik.errors.name)}
                      helperText={formik.touched.name && formik.errors.name}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <InventoryIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <FormControl 
                      fullWidth 
                      error={formik.touched.category && Boolean(formik.errors.category)}
                    >
                      <InputLabel id="category-label">Category</InputLabel>
                      <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        label="Category"
                        startAdornment={
                          <InputAdornment position="start">
                            <CategoryIcon fontSize="small" />
                          </InputAdornment>
                        }
                      >
                        {inventoryCategories.map(category => (
                          <MenuItem key={category.value} value={category.value}>
                            {category.label}
                          </MenuItem>
                        ))}
                      </Select>
                      {formik.touched.category && formik.errors.category && (
                        <FormHelperText>{formik.errors.category}</FormHelperText>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="quantity"
                      name="quantity"
                      label="Quantity"
                      type="number"
                      value={formik.values.quantity}
                      onChange={formik.handleChange}
                      error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                      helperText={formik.touched.quantity && formik.errors.quantity}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                    />
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="unitPrice"
                      name="unitPrice"
                      label="Unit Price ($)"
                      type="number"
                      value={formik.values.unitPrice}
                      onChange={formik.handleChange}
                      error={formik.touched.unitPrice && Boolean(formik.errors.unitPrice)}
                      helperText={formik.touched.unitPrice && formik.errors.unitPrice}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 },
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <TextField
                      fullWidth
                      id="supplier"
                      name="supplier"
                      label="Supplier"
                      value={formik.values.supplier}
                      onChange={formik.handleChange}
                      error={formik.touched.supplier && Boolean(formik.errors.supplier)}
                      helperText={formik.touched.supplier && formik.errors.supplier}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BusinessIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <Typography gutterBottom>
                      Reorder Level: {formik.values.reorderLevel}
                    </Typography>
                    <Slider
                      id="reorderLevel"
                      name="reorderLevel"
                      value={formik.values.reorderLevel}
                      onChange={(_, value) => formik.setFieldValue('reorderLevel', value)}
                      aria-labelledby="reorder-level-slider"
                      valueLabelDisplay="auto"
                      step={1}
                      marks
                      min={1}
                      max={50}
                    />
                    {formik.touched.reorderLevel && formik.errors.reorderLevel && (
                      <FormHelperText error>{formik.errors.reorderLevel}</FormHelperText>
                    )}
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry Date"
                      type="date"
                      value={formik.values.expiryDate}
                      onChange={formik.handleChange}
                      error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                      helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  
                  <Box width={{ xs: '100%', md: '50%' }} px={1.5}>
                    <TextField
                      fullWidth
                      id="location"
                      name="location"
                      label="Storage Location"
                      value={formik.values.location}
                      onChange={formik.handleChange}
                      error={formik.touched.location && Boolean(formik.errors.location)}
                      helperText={formik.touched.location && formik.errors.location}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <ShippingIcon fontSize="small" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <TextField
                      fullWidth
                      id="description"
                      name="description"
                      label="Description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      error={formik.touched.description && Boolean(formik.errors.description)}
                      helperText={formik.touched.description && formik.errors.description}
                      multiline
                      rows={4}
                    />
                  </Box>
                  
                  <Box width="100%" px={1.5}>
                    <TextField
                      fullWidth
                      id="image"
                      name="image"
                      label="Image URL"
                      value={formik.values.image}
                      onChange={formik.handleChange}
                      error={formik.touched.image && Boolean(formik.errors.image)}
                      helperText={formik.touched.image && formik.errors.image}
                    />
                  </Box>
                </Grid>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleCancel}
                    sx={{ mr: 2 }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="contained" 
                    type="submit"
                    disabled={formik.isSubmitting || success}
                  >
                    {isEditMode ? 'Update Item' : 'Add Item'}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Box>
        
        <Box width={{ xs: '100%', md: '33.33%' }} px={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Avatar
                  src={formik.values.image || placeholderImages.inventory}
                  alt={formik.values.name || 'Inventory item'}
                  variant="rounded"
                  sx={{ 
                    width: 200, 
                    height: 200,
                    mb: 2
                  }}
                />
              </Box>
              
              {formik.values.name && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {formik.values.name}
                  </Typography>
                  {formik.values.category && (
                    <Typography variant="body2" color="text.secondary">
                      Category: {formik.values.category.charAt(0).toUpperCase() + formik.values.category.slice(1)}
                    </Typography>
                  )}
                  {formik.values.supplier && (
                    <Typography variant="body2" color="text.secondary">
                      Supplier: {formik.values.supplier}
                    </Typography>
                  )}
                </Box>
              )}
              
              {formik.values.description && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    {formik.values.description}
                  </Typography>
                </Box>
              )}
              
              {formik.values.quantity <= formik.values.reorderLevel && (
                <Alert 
                  severity="warning" 
                  icon={<WarningIcon />}
                  sx={{ mb: 2 }}
                >
                  <Typography variant="body2">
                    This item will be marked for reordering as its quantity is at or below the reorder level.
                  </Typography>
                </Alert>
              )}
              
              <Box sx={{ p: 2, bgcolor: theme.palette.primary.main, color: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Inventory Management Tips
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  • Set appropriate reorder levels to avoid stockouts<br />
                  • Regularly audit physical inventory against system records<br />
                  • Monitor expiry dates for medical supplies<br />
                  • Maintain proper storage conditions for all items
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
};

export default AddEditInventoryItem; 