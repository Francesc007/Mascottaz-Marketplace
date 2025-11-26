import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          // Verificar si el producto ya existe en el carrito
          const existingItemIndex = state.items.findIndex(
            (item) => item.id === (product.id || product.id)
          );

          if (existingItemIndex >= 0) {
            // Si existe, incrementar la cantidad
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += 1;
            return { items: newItems };
          } else {
            // Si no existe, agregar nuevo item con cantidad 1
            return {
              items: [...state.items, {
                id: product.id || Date.now(),
                name: product.nombre || product.name,
                description: product.descripcion || product.description,
                price: product.precio || product.price,
                image: product.imagen || product.image,
                quantity: 1
              }]
            };
          }
        });
      },
      updateQuantity: (index, newQuantity) => {
        if (newQuantity <= 0) {
          // Si la cantidad es 0 o menor, eliminar el item
          set((state) => ({
            items: state.items.filter((_, i) => i !== index)
          }));
        } else {
          set((state) => {
            const newItems = [...state.items];
            newItems[index].quantity = newQuantity;
            return { items: newItems };
          });
        }
      },
      incrementQuantity: (index) => {
        set((state) => {
          const newItems = [...state.items];
          newItems[index].quantity += 1;
          return { items: newItems };
        });
      },
      decrementQuantity: (index) => {
        set((state) => {
          const newItems = [...state.items];
          if (newItems[index].quantity > 1) {
            newItems[index].quantity -= 1;
          } else {
            // Si la cantidad es 1, eliminar el item
            return { items: state.items.filter((_, i) => i !== index) };
          }
          return { items: newItems };
        });
      },
      removeItem: (index) => {
        set((state) => ({
          items: state.items.filter((_, i) => i !== index)
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },
      getTotal: () => {
        return useCartStore.getState().items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 1), 
          0
        );
      },
      getItemCount: () => {
        return useCartStore.getState().items.reduce(
          (sum, item) => sum + (item.quantity || 1), 
          0
        );
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;

