export const fetchInventoryItems = async () => {
  const response = await fetch('/api/get-all-inventory');
  if (!response.ok) {
    throw new Error('Failed to fetch inventory items');
  }
  return response.json();
};

export const addInventoryItem = async (item: { name: string; quantity: number; price: number }) => {
  const response = await fetch('/api/add-inventory', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error('Failed to add inventory item');
  }
  return response.json();
};

export const updateInventoryItem = async (id: string, updatedItem: { name: string; quantity: number; price: number }) => {
  const response = await fetch(`/api/update-inventory/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedItem),
  });
  if (!response.ok) {
    throw new Error('Failed to update inventory item');
  }
  return response.json();
};

export const deleteInventoryItem = async (id: string) => {
  const response = await fetch(`/api/delete-inventory/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete inventory item');
  }
  return response.json();
};

export const fetchSignUp = async (name: string, email: string, password: string) => {
  const response = await fetch('/api/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    throw new Error('Failed to sign up');
  }
  return response.json();
};

