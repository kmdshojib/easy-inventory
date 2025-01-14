import { create } from 'zustand';
import { fetchInventoryItems, addInventoryItem, updateInventoryItem, deleteInventoryItem } from '../utils/api';
import { useUserStore } from './useUserStore';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface InventoryState {
  inventoryItems: InventoryItem[];
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateItem: (id: string, updatedItem: Omit<InventoryItem, 'id'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set) => ({
  inventoryItems: [],
  fetchItems: async () => {
    const items = await fetchInventoryItems();
    set({ inventoryItems: items });
  },
  addItem: async (item) => {
    const newItem = await addInventoryItem(item);
    set((state) => ({ inventoryItems: [...state.inventoryItems, newItem] }));
  },
  updateItem: async (id, updatedItem) => {
    await updateInventoryItem(id, updatedItem);
    set((state) => ({
      inventoryItems: state.inventoryItems.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      ),
    }));
  },
  deleteItem: async (id) => {
    const user = useUserStore.getState().user;
    if (!user) {
      throw new Error("User must be logged in to delete an item.");
    }
    const strId = id.toString();
    console.log(`Deleting item with ID: ${strId}`);
    await deleteInventoryItem(strId);
    set((state) => ({
      inventoryItems: state.inventoryItems.filter((item) => item.id !== strId),
    }));
  },
})); 