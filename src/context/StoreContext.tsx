import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  Coupon,
  CustomerProfile,
  ActivePage,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/products';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  currentUser: CustomerProfile | null;
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  activePage: ActivePage;
  selectedProductId: string | null;
  selectedCategory: string | null;
  searchQuery: string;
  cartDrawerOpen: boolean;
  adminUnlocked: boolean;
  notifications: Notification[];
  // Actions
  setSearchQuery: (q: string) => void;
  setSelectedCategory: (cat: string | null) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setAdminUnlocked: (unlocked: boolean) => void;
  navigateTo: (page: ActivePage, productId?: string, category?: string) => void;
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariants?: Record<string, string>,
    customPrice?: number
  ) => boolean;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, deltaOrExact: number, isAbsolute?: boolean) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingCode?: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateCustomerProfile: (profile: Partial<CustomerProfile>) => void;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  cartCount: number;
  cartSubtotal: number;
  calculatedDiscount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'tstore_products_v1',
  CART: 'tstore_cart_v1',
  WISHLIST: 'tstore_wishlist_v1',
  ORDERS: 'tstore_orders_v1',
  USER: 'tstore_user_v1',
  ADMIN: 'tstore_admin_v1',
};

const DEFAULT_USER: CustomerProfile = {
  id: 'cust-demo-01',
  name: 'Cliente TStore',
  email: 'cliente@exemplo.com.br',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  savedAddresses: [
    {
      id: 'addr-01',
      cep: '01310-100',
      street: 'Avenida Paulista',
      number: '1000',
      complement: 'Apto 101',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      isDefault: true,
    },
  ],
};

const INITIAL_DEMO_ORDER: Order = {
  id: 'TST-2026-8941',
  date: '2026-10-10T14:32:00Z',
  customer: DEFAULT_USER,
  shippingAddress: DEFAULT_USER.savedAddresses[0],
  items: [
    {
      id: 'tst-headphones-studio-anc_preto',
      product: INITIAL_PRODUCTS[2],
      quantity: 1,
      unitPrice: 1399.00,
      selectedVariants: { 'Cor': 'Preto Grafite Matte' },
    },
  ],
  subtotal: 1399.00,
  discount: 139.90,
  shippingCost: 0,
  shippingOption: {
    id: 'sedex-expresso',
    name: 'Sedex Expresso',
    carrier: 'Correios',
    price: 0,
    deliveryDays: '1 a 2 dias úteis',
  },
  total: 1259.10,
  paymentMethod: 'pix',
  status: 'shipped',
  trackingCode: 'BR984120365SP',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CART);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return stored ? JSON.parse(stored) : ['tst-headphones-studio-anc'];
    } catch {
      return ['tst-headphones-studio-anc'];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return stored ? JSON.parse(stored) : [INITIAL_DEMO_ORDER];
    } catch {
      return [INITIAL_DEMO_ORDER];
    }
  });

  // Customer Profile
  const [currentUser, setCurrentUser] = useState<CustomerProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER);
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  // Navigation & UI state
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [adminUnlocked, setAdminUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN) === 'true';
    } catch {
      return false;
    }
  });

  // Coupons
  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Toast notifications
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Persist state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER);
      }
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN, String(adminUnlocked));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [adminUnlocked]);

  // Notifications helper
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3500);
  };

  // Navigation helper
  const navigateTo = (page: ActivePage, productId?: string, category?: string) => {
    setActivePage(page);
    if (productId !== undefined) setSelectedProductId(productId);
    if (category !== undefined) setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariants?: Record<string, string>,
    customPrice?: number
  ): boolean => {
    // Check real stock
    if (product.stock <= 0) {
      showNotification('Produto temporariamente esgotado.', 'error');
      return false;
    }

    const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : 'default';
    const itemId = `${product.id}_${variantKey}`;

    const existingIndex = cart.findIndex((item) => item.id === itemId);
    const effectivePrice = customPrice !== undefined ? customPrice : product.price;

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity;
      if (currentQty + quantity > product.stock) {
        showNotification(`Estoque limitado: você já possui ${currentQty} de ${product.stock} unidades disponíveis.`, 'error');
        return false;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += quantity;
      setCart(updated);
    } else {
      if (quantity > product.stock) {
        showNotification(`Quantidade excede o estoque disponível (${product.stock} un).`, 'error');
        return false;
      }
      setCart((prev) => [
        ...prev,
        {
          id: itemId,
          product,
          quantity,
          selectedVariants,
          unitPrice: effectivePrice,
        },
      ]);
    }

    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
    return true;
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showNotification('Item removido do carrinho.', 'info');
  };

  const updateQuantity = (cartItemId: string, deltaOrExact: number, isAbsolute = false) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = isAbsolute ? deltaOrExact : item.quantity + deltaOrExact;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) {
              showNotification(`Limite de estoque atingido (${item.product.stock} unidades).`, 'error');
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist toggle
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showNotification('Item removido dos favoritos.', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showNotification('Item salvo nos seus favoritos!', 'success');
        return [...prev, productId];
      }
    });
  };

  // Coupon handling
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code === trimmed && c.active);
    if (!coupon) {
      return { success: false, message: 'Cupom inválido ou expirado.' };
    }
    const currentSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    if (coupon.minSpend && currentSubtotal < coupon.minSpend) {
      return {
        success: false,
        message: `Este cupom requer pedido mínimo de R$ ${coupon.minSpend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}.`,
      };
    }
    setAppliedCoupon(coupon);
    showNotification(`Cupom ${coupon.code} aplicado com sucesso!`, 'success');
    return { success: true, message: 'Cupom aplicado com sucesso!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Cupom removido.', 'info');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `TST-2026-${randomSuffix}`,
      date: new Date().toISOString(),
      status: orderData.paymentMethod === 'pix' ? 'payment_approved' : 'payment_approved',
      trackingCode: `BR${randomSuffix}${Date.now().toString().slice(-4)}SP`,
    };

    // Deduct stock safely
    setProducts((prev) =>
      prev.map((prod) => {
        const cartMatch = orderData.items.find((item) => item.product.id === prod.id);
        if (cartMatch) {
          const updatedStock = Math.max(0, prod.stock - cartMatch.quantity);
          return { ...prod, stock: updatedStock };
        }
        return prod;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingCode?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            status,
            trackingCode: trackingCode || ord.trackingCode,
          };
        }
        return ord;
      })
    );
    showNotification(`Status do pedido ${orderId} atualizado para ${status}.`, 'info');
  };

  // Product management (Admin)
  const addProduct = (productData: Omit<Product, 'id'>): Product => {
    const newId = `tst-custom-${Date.now()}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showNotification(`Produto "${newProduct.name}" cadastrado com sucesso!`, 'success');
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showNotification('Produto atualizado com sucesso.', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showNotification('Produto excluído do catálogo.', 'info');
  };

  // Customer Management
  const updateCustomerProfile = (profile: Partial<CustomerProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...profile } : null));
    showNotification('Dados de cadastro atualizados.', 'success');
  };

  const loginUser = (email: string, name = 'Cliente TStore') => {
    const user: CustomerProfile = {
      id: `cust-${Date.now()}`,
      name,
      email,
      cpf: '123.456.789-00',
      phone: '(11) 98765-4321',
      savedAddresses: [
        {
          id: 'addr-default',
          cep: '01310-100',
          street: 'Avenida Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          isDefault: true,
        },
      ],
    };
    setCurrentUser(user);
    showNotification(`Bem-vindo(a), ${name}!`, 'success');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    showNotification('Sessão encerrada com segurança.', 'info');
  };

  // Calculations
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  let calculatedDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      calculatedDiscount = (cartSubtotal * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixed) {
      calculatedDiscount = Math.min(appliedCoupon.discountFixed, cartSubtotal);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - calculatedDiscount);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        currentUser,
        coupons,
        appliedCoupon,
        activePage,
        selectedProductId,
        selectedCategory,
        searchQuery,
        cartDrawerOpen,
        adminUnlocked,
        notifications,
        setSearchQuery,
        setSelectedCategory,
        setCartDrawerOpen,
        setAdminUnlocked,
        navigateTo,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        updateCustomerProfile,
        loginUser,
        logoutUser,
        showNotification,
        cartCount,
        cartSubtotal,
        calculatedDiscount,
        cartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
