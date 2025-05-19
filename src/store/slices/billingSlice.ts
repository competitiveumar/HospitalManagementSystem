import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill, BillItem } from '../../types';
import { mockBills } from '../../utils/mockData';
import { v4 as uuidv4 } from 'uuid';

interface BillingState {
  bills: Bill[];
  selectedBill: Bill | null;
  filteredBills: Bill[];
  pendingBills: Bill[];
  totalRevenue: number;
  monthlyRevenue: Record<string, number>;
  isLoading: boolean;
  error: string | null;
}

// Calculate total revenue
const totalRevenue = mockBills.reduce((sum, bill) => sum + bill.totalAmount, 0);

// Calculate monthly revenue
const calculateMonthlyRevenue = (bills: Bill[]) => {
  const monthlyRev: Record<string, number> = {};
  
  bills.forEach(bill => {
    const month = bill.date.substring(0, 7); // Format: YYYY-MM
    if (!monthlyRev[month]) {
      monthlyRev[month] = 0;
    }
    monthlyRev[month] += bill.totalAmount;
  });
  
  return monthlyRev;
};

const initialState: BillingState = {
  bills: mockBills,
  selectedBill: null,
  filteredBills: mockBills,
  pendingBills: mockBills.filter(bill => bill.paymentStatus !== 'paid'),
  totalRevenue,
  monthlyRevenue: calculateMonthlyRevenue(mockBills),
  isLoading: false,
  error: null,
};

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    fetchBillsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchBillsSuccess: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload;
      state.filteredBills = action.payload;
      state.pendingBills = action.payload.filter(bill => bill.paymentStatus !== 'paid');
      state.totalRevenue = action.payload.reduce((sum, bill) => sum + bill.totalAmount, 0);
      state.monthlyRevenue = calculateMonthlyRevenue(action.payload);
      state.isLoading = false;
      state.error = null;
    },
    fetchBillsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    selectBill: (state, action: PayloadAction<string>) => {
      state.selectedBill = state.bills.find(bill => bill.id === action.payload) || null;
    },
    clearSelectedBill: (state) => {
      state.selectedBill = null;
    },
    addBill: (state, action: PayloadAction<Omit<Bill, 'id'>>) => {
      const newBill: Bill = {
        ...action.payload,
        id: uuidv4(),
      };
      state.bills.push(newBill);
      state.filteredBills = state.bills;
      state.pendingBills = state.bills.filter(bill => bill.paymentStatus !== 'paid');
      state.totalRevenue += newBill.totalAmount;
      
      // Update monthly revenue
      const month = newBill.date.substring(0, 7);
      if (!state.monthlyRevenue[month]) {
        state.monthlyRevenue[month] = 0;
      }
      state.monthlyRevenue[month] += newBill.totalAmount;
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        // Adjust total and monthly revenue before updating
        const oldBill = state.bills[index];
        state.totalRevenue = state.totalRevenue - oldBill.totalAmount + action.payload.totalAmount;
        
        // Adjust monthly revenue
        const oldMonth = oldBill.date.substring(0, 7);
        const newMonth = action.payload.date.substring(0, 7);
        
        state.monthlyRevenue[oldMonth] -= oldBill.totalAmount;
        if (!state.monthlyRevenue[newMonth]) {
          state.monthlyRevenue[newMonth] = 0;
        }
        state.monthlyRevenue[newMonth] += action.payload.totalAmount;
        
        // Update the bill
        state.bills[index] = action.payload;
        state.filteredBills = state.bills;
        state.pendingBills = state.bills.filter(bill => bill.paymentStatus !== 'paid');
        
        if (state.selectedBill && state.selectedBill.id === action.payload.id) {
          state.selectedBill = action.payload;
        }
      }
    },
    deleteBill: (state, action: PayloadAction<string>) => {
      const billToDelete = state.bills.find(bill => bill.id === action.payload);
      
      if (billToDelete) {
        // Adjust total and monthly revenue
        state.totalRevenue -= billToDelete.totalAmount;
        const month = billToDelete.date.substring(0, 7);
        state.monthlyRevenue[month] -= billToDelete.totalAmount;
        
        // Remove the bill
        state.bills = state.bills.filter(bill => bill.id !== action.payload);
        state.filteredBills = state.bills;
        state.pendingBills = state.bills.filter(bill => bill.paymentStatus !== 'paid');
        
        if (state.selectedBill && state.selectedBill.id === action.payload) {
          state.selectedBill = null;
        }
      }
    },
    updateBillStatus: (state, action: PayloadAction<{ billId: string; status: Bill['paymentStatus'] }>) => {
      const { billId, status } = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      
      if (bill) {
        bill.paymentStatus = status;
        state.filteredBills = state.bills;
        state.pendingBills = state.bills.filter(bill => bill.paymentStatus !== 'paid');
        
        if (state.selectedBill && state.selectedBill.id === billId) {
          state.selectedBill = bill;
        }
      }
    },
    addBillItem: (state, action: PayloadAction<{ billId: string; item: Omit<BillItem, 'id'> }>) => {
      const { billId, item } = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      
      if (bill) {
        const newItem: BillItem = {
          ...item,
          id: uuidv4(),
        };
        
        bill.items.push(newItem);
        bill.totalAmount += newItem.amount;
        
        // Update total and monthly revenue
        state.totalRevenue += newItem.amount;
        const month = bill.date.substring(0, 7);
        if (!state.monthlyRevenue[month]) {
          state.monthlyRevenue[month] = 0;
        }
        state.monthlyRevenue[month] += newItem.amount;
        
        if (state.selectedBill && state.selectedBill.id === billId) {
          state.selectedBill = bill;
        }
      }
    },
    removeBillItem: (state, action: PayloadAction<{ billId: string; itemId: string }>) => {
      const { billId, itemId } = action.payload;
      const bill = state.bills.find(b => b.id === billId);
      
      if (bill) {
        const item = bill.items.find(i => i.id === itemId);
        
        if (item) {
          // Adjust bill total and revenue totals
          bill.totalAmount -= item.amount;
          state.totalRevenue -= item.amount;
          
          const month = bill.date.substring(0, 7);
          state.monthlyRevenue[month] -= item.amount;
          
          // Remove the item
          bill.items = bill.items.filter(i => i.id !== itemId);
          
          if (state.selectedBill && state.selectedBill.id === billId) {
            state.selectedBill = bill;
          }
        }
      }
    },
    filterBillsByPatient: (state, action: PayloadAction<string>) => {
      const patientId = action.payload;
      state.filteredBills = state.bills.filter(bill => bill.patientId === patientId);
    },
    filterBillsByStatus: (state, action: PayloadAction<Bill['paymentStatus']>) => {
      const status = action.payload;
      state.filteredBills = state.bills.filter(bill => bill.paymentStatus === status);
    },
    filterBillsByDateRange: (state, action: PayloadAction<{ startDate: string; endDate: string }>) => {
      const { startDate, endDate } = action.payload;
      state.filteredBills = state.bills.filter(bill => bill.date >= startDate && bill.date <= endDate);
    },
    resetBillFilters: (state) => {
      state.filteredBills = state.bills;
    },
  },
});

export const {
  fetchBillsStart,
  fetchBillsSuccess,
  fetchBillsFailure,
  selectBill,
  clearSelectedBill,
  addBill,
  updateBill,
  deleteBill,
  updateBillStatus,
  addBillItem,
  removeBillItem,
  filterBillsByPatient,
  filterBillsByStatus,
  filterBillsByDateRange,
  resetBillFilters,
} = billingSlice.actions;

export default billingSlice.reducer; 