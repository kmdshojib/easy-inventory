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
  isLoading: boolean;
  isMutating: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateItem: (id: string, updatedItem: Omit<InventoryItem, 'id'>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  fetchItemById: (id: string) => Promise<InventoryItem>;
  currentItem: InventoryItem | null;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  inventoryItems: [],
  isLoading: false,
  isMutating: false,
  error: null,
  currentItem: null,

  fetchItems: async () => {
    if (get().isLoading) return;
    
    try {
      set({ isLoading: true, error: null });
      const items = await fetchInventoryItems();
      set({ inventoryItems: items });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch inventory items';
      set({ error: errorMessage });
      console.error('Failed to fetch inventory items:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addItem: async (item) => {
    if (get().isMutating) return;

    try {
      set({ isMutating: true, error: null });
      const newItem = await addInventoryItem(item);
      
      // Optimistic update
      set((state) => ({
        inventoryItems: [...state.inventoryItems, { ...item, id: newItem.id }]
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item';
      set({ error: errorMessage });
      console.error('Failed to add inventory item:', error);
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  updateItem: async (id, updatedItem) => {
    const user = useUserStore.getState().user;
    if (!user) {
        throw new Error('User must be logged in to update an item.');
    }

    if (get().isMutating) return;
    const previousItems = get().inventoryItems;

    try {
      set({ isMutating: true, error: null });
      
      // Optimistic update
      set((state) => ({
        inventoryItems: state.inventoryItems.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        )
      }));

      // Perform the actual update
      await updateInventoryItem(id, updatedItem);
    } catch (error) {
      // Rollback on error
      set({ inventoryItems: previousItems });
      const errorMessage = error instanceof Error ? error.message : 'Failed to update item';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  deleteItem: async (id) => {
    const user = useUserStore.getState().user;
    if (!user) {
      throw new Error("User must be logged in to delete an item.");
    }

    if (get().isMutating) return;
    const previousItems = get().inventoryItems;

    try {
      set({ isMutating: true, error: null });
      const strId = id.toString();

      // Optimistic update
      set((state) => ({
        inventoryItems: state.inventoryItems.filter((item) => item.id !== id)
      }));

      // Perform the actual delete
      await deleteInventoryItem(strId);
    } catch (error) {
      // Rollback on error
      set({ inventoryItems: previousItems });
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete item';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isMutating: false });
    }
  },

  fetchItemById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`/api/get-inventory/${id}`);
      if (!response.ok) throw new Error('Failed to fetch item');
      const data = await response.json();
      set({ currentItem: data });
      return data;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch item';
      set({ error: message });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));