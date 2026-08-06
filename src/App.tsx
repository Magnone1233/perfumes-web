import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { CartSummary } from "./components/CartSummary/CartSummary";
import { PageLayout, PageSection } from "./components/Layout/Layout";
import { ProductGrid } from "./components/ProductGrid/ProductGrid";
import { StateBox } from "./components/StateBox/StateBox";
import { Typography } from "./components/Typography/Typography";
import {
  clearAdminToken,
  getAdminToken,
  saveAdminToken,
} from "./services/admin-auth.service";
import type { CartItem } from "./types/cart";
import type { Fragrance } from "./types/fragrance";
import { getFragrances } from "./services/fragrances.service";
import {
  buildCartWhatsAppUrl,
  getFragranceFinalPrice,
} from "./utils/fragrance";

const CatalogLayout = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(320px, 360px);
  gap: 24px;
  align-items: start;

  @media (max-width: ${({ theme }) => `${theme.breakpoints.tablet}px`}) {
    grid-template-columns: 1fr;
  }
`;

const CatalogMain = styled.div`
  display: grid;
  gap: 20px;
`;

const AdminTopLink = styled.a`
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 0.9rem;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

function App() {
  const isAdminRoute = window.location.pathname.startsWith("/admin");
  const [fragrances, setFragrances] = useState<Fragrance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [adminToken, setAdminToken] = useState<string | null>(() =>
    getAdminToken(),
  );

  const loadFragrances = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFragrances(signal);

      if (signal?.aborted) {
        return;
      }

      setFragrances(data);
    } catch (err) {
      if (signal?.aborted) {
        return;
      }

      const message =
        err instanceof Error ? err.message : "No se pudo cargar el catalogo.";
      setError(message);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const loadInitialFragrances = async () => {
      try {
        const data = await getFragrances(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setFragrances(data);
      } catch (err) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "No se pudo cargar el catalogo.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialFragrances();

    return () => {
      controller.abort();
    };
  }, []);

  const whatsappPhone = import.meta.env.VITE_WHATSAPP_PHONE;

  const subtitle = useMemo(
    () =>
      "Fragancias elegidas para una experiencia premium. Descubri notas exclusivas y pedi asesoramiento por WhatsApp en un click.",
    [],
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cartItems],
  );

  const handleAddToCart = (fragrance: Fragrance) => {
    setCartItems((previous) => {
      const existingItem = previous.find(
        (item) => item.fragrance.id === fragrance.id,
      );

      if (existingItem) {
        return previous.map((item) =>
          item.fragrance.id === fragrance.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...previous,
        {
          fragrance,
          quantity: 1,
          unitPrice: getFragranceFinalPrice(fragrance),
        },
      ];
    });
  };

  const handleIncreaseQuantity = (fragranceId: number) => {
    setCartItems((previous) =>
      previous.map((item) =>
        item.fragrance.id === fragranceId
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  };

  const handleDecreaseQuantity = (fragranceId: number) => {
    setCartItems((previous) =>
      previous.flatMap((item) => {
        if (item.fragrance.id !== fragranceId) {
          return [item];
        }

        if (item.quantity <= 1) {
          return [];
        }

        return [{ ...item, quantity: item.quantity - 1 }];
      }),
    );
  };

  const handleRemoveItem = (fragranceId: number) => {
    setCartItems((previous) =>
      previous.filter((item) => item.fragrance.id !== fragranceId),
    );
  };

  const handleCheckoutWhatsApp = () => {
    if (cartItems.length === 0) {
      return;
    }

    const url = buildCartWhatsAppUrl(
      cartItems.map((item) => ({
        name: item.fragrance.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      whatsappPhone,
    );

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    saveAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    clearAdminToken();
  };

  if (isAdminRoute) {
    return (
      <PageLayout maxWidth={980} horizontalPadding={30} mobilePadding={18}>
        <PageSection gap={10}>
          <AdminTopLink href="/">Volver al catalogo</AdminTopLink>
        </PageSection>

        <PageSection>
          <AdminPanel
            fragrances={fragrances}
            productsLoading={isLoading}
            adminToken={adminToken}
            onLoginSuccess={handleAdminLoginSuccess}
            onLogout={handleAdminLogout}
            onRefresh={() => loadFragrances()}
          />
        </PageSection>
      </PageLayout>
    );
  }

  return (
    <PageLayout maxWidth={1240} horizontalPadding={36} mobilePadding={20}>
      <PageSection gap={20}>
        <Typography as="h1" variant="display" color="textPrimary">
          Tienda de Perfumes
        </Typography>
        <Typography as="p" variant="body" color="textSecondary" maxWidth={760}>
          {subtitle}
        </Typography>
      </PageSection>

      <PageSection gap={20}>
        <Typography as="h2" variant="sectionTitle" color="textPrimary">
          Catalogo de Fragancias
        </Typography>

        <CatalogLayout>
          <CatalogMain>
            {isLoading && (
              <StateBox
                title="Cargando perfumes"
                description="Estamos buscando los productos disponibles."
              />
            )}

            {!isLoading && error && (
              <StateBox
                title="No se pudo cargar el catalogo"
                description={error}
                isError
              />
            )}

            {!isLoading && !error && fragrances.length === 0 && (
              <StateBox
                title="No hay perfumes cargados"
                description="Cuando agregues productos en el backend, van a aparecer aca automaticamente."
              />
            )}

            {!isLoading && !error && fragrances.length > 0 && (
              <ProductGrid
                fragrances={fragrances}
                onAddToCart={handleAddToCart}
                minCardWidth={272}
              />
            )}
          </CatalogMain>

          <CartSummary
            items={cartItems}
            totalItems={totalItems}
            totalAmount={totalAmount}
            onIncrease={handleIncreaseQuantity}
            onDecrease={handleDecreaseQuantity}
            onRemove={handleRemoveItem}
            onCheckoutWhatsApp={handleCheckoutWhatsApp}
          />
        </CatalogLayout>
      </PageSection>
    </PageLayout>
  );
}

export default App;
