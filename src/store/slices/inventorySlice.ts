import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { InventoryItem } from '../../types';
import { mockInventoryItems } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface InventoryState {
  items: InventoryItem[];
  selectedItem: InventoryItem | null;
  filteredItems: InventoryItem[];
  lowStockItems: InventoryItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: mockInventoryItems,
  selectedItem: null,
  filteredItems: mockInventoryItems,
  lowStockItems: mockInventoryItems.filter(item => item.quantity <= item.reorderLevel),
  isLoading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    fetchInventoryStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchInventorySuccess: (state, action: PayloadAction<InventoryItem[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.lowStockItems = action.payload.filter(item => item.quantity <= item.reorderLevel);
      state.isLoading = false;
      state.error = null;
    },
    fetchInventoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectInventoryItem: (state, action: PayloadAction<string>) => {
      state.selectedItem = state.items.find(item => item.id === action.payload) || null;
    },
    clearSelectedInventoryItem: (state) => {
      state.selectedItem = null;
    },
    addInventoryItem: (state, action: PayloadAction<Omit<InventoryItem, 'id'>>) => {
      const newItem: InventoryItem = {
        ...action.payload,
        id: uuidv4(),
      };
      state.items.push(newItem);
      state.filteredItems = state.items;
      state.lowStockItems = state.items.filter(item => item.quantity <= item.reorderLevel);
    },
    updateInventoryItem: (state, action: PayloadAction<InventoryItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        state.filteredItems = state.items;
        state.lowStockItems = state.items.filter(item => item.quantity <= item.reorderLevel);
        if (state.selectedItem && state.selectedItem.id === action.payload.id) {
          state.selectedItem = action.payload;
        }
      }
    },
    deleteInventoryItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.filteredItems = state.items;
      state.lowStockItems = state.items.filter(item => item.quantity <= item.reorderLevel);
      if (state.selectedItem && state.selectedItem.id === action.payload) {
        state.selectedItem = null;
      }
    },
    updateInventoryQuantity: (state, action: PayloadAction<{ itemId: string; quantity: number }>) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(i => i.id === itemId);
      
      if (item) {
        item.quantity = quantity;
        state.filteredItems = state.items;
        state.lowStockItems = state.items.filter(item => item.quantity <= item.reorderLevel);
        
        if (state.selectedItem && state.selectedItem.id === itemId) {
          state.selectedItem = item;
        }
      }
    },
    filterInventoryByCategory: (state, action: PayloadAction<InventoryItem['category']>) => {
      const category = action.payload;
      state.filteredItems = state.items.filter(item => item.category === category);
    },
    filterInventoryByLowStock: (state) => {
      state.filteredItems = state.lowStockItems;
    },
    filterInventoryBySearch: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      state.filteredItems = state.items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.supplier.toLowerCase().includes(searchTerm) ||
        (item.description && item.description.toLowerCase().includes(searchTerm))
      );
    },
    resetInventoryFilters: (state) => {
      state.filteredItems = state.items;
    },
  },
});

export const {
  fetchInventoryStart,
  fetchInventorySuccess,
  fetchInventoryFailure,
  selectInventoryItem,
  clearSelectedInventoryItem,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateInventoryQuantity,
  filterInventoryByCategory,
  filterInventoryByLowStock,
  filterInventoryBySearch,
  resetInventoryFilters,
} = inventorySlice.actions;

export default inventorySlice.reducer; 