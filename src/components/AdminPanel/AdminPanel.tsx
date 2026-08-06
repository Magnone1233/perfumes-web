import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import styled from "styled-components";
import { Button } from "../Button/Button";
import { Container } from "../Container/Container";
import { StateBox } from "../StateBox/StateBox";
import { Typography } from "../Typography/Typography";
import { loginAdmin } from "../../services/admin-auth.service";
import {
  createFragrance,
  deleteFragrance,
  updateFragrance,
} from "../../services/fragrances.service";
import type { FragranceFormValues } from "../../services/fragrances.service";
import type { Fragrance } from "../../types/fragrance";
import { formatCurrency, resolveFragranceImage } from "../../utils/fragrance";

interface AdminPanelProps {
  fragrances: Fragrance[];
  productsLoading: boolean;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
  onRefresh: () => Promise<void>;
}

type EditorMode = "create" | "edit";

interface ProductEditorState {
  mode: EditorMode;
  targetId: number | null;
  values: FragranceFormValues;
}

const AdminLayout = styled(Container)`
  display: grid;
  gap: 16px;
`;

const AuthCard = styled(AdminLayout)`
  width: 100%;
  max-width: 440px;
  margin: 0 auto;
`;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const HeaderCopy = styled.div`
  display: grid;
  gap: 6px;
`;

const DataRegion = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 14px;
  overflow: auto;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
`;

const HeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DataCell = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.9rem;
`;

const Thumb = styled.img`
  width: 52px;
  height: 52px;
  border-radius: 10px;
  object-fit: cover;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyThumb = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 10px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ActionsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const IconAction = styled.button<{ actionType: "edit" | "delete" }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid
    ${({ theme, actionType }) =>
      actionType === "delete" ? theme.colors.error : theme.colors.warning};
  background: ${({ actionType }) =>
    actionType === "delete"
      ? "rgba(224, 82, 82, 0.16)"
      : "rgba(224, 176, 75, 0.16)"};
  color: ${({ theme, actionType }) =>
    actionType === "delete" ? theme.colors.error : theme.colors.warning};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${({ actionType }) =>
      actionType === "delete"
        ? "rgba(224, 82, 82, 0.24)"
        : "rgba(224, 176, 75, 0.24)"};
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

const TopIconButton = styled(IconAction)`
  width: 40px;
  height: 40px;
`;

const LoginForm = styled.form`
  display: grid;
  gap: 12px;
`;

const LoginFieldStack = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;
  width: 100%;
`;

const FieldGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const Field = styled.label`
  display: grid;
  gap: 6px;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TextInput = styled.input`
  width: 100%;
  height: 42px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 0 12px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 86px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgSecondary};
  color: ${({ theme }) => theme.colors.textPrimary};
  padding: 10px 12px;
  resize: vertical;
`;

const EditorCard = styled(Container)`
  display: grid;
  gap: 12px;
`;

const EditorForm = styled.form`
  display: grid;
  gap: 12px;
`;

const FooterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const LoginActions = styled(FooterActions)`
  justify-content: center;
`;

const statusColorByTone = {
  neutral: "textSecondary",
  success: "success",
  error: "error",
} as const;

const iconStyle = { width: 14, height: 14 };

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={iconStyle} aria-hidden>
    <path
      d="M12 5v14M5 12h14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={iconStyle} aria-hidden>
    <path
      d="M4 20h4l10-10a2 2 0 1 0-4-4L4 16v4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" style={iconStyle} aria-hidden>
    <path
      d="M5 7h14M10 11v6M14 11v6M8 7l1-2h6l1 2M7 7l1 12h8l1-12"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const defaultValues: FragranceFormValues = {
  name: "",
  description: "",
  price: "",
  promotionalPrice: "",
  stock: "",
  imageFile: null,
};

const getEditValuesFromFragrance = (
  fragrance: Fragrance,
): FragranceFormValues => ({
  name: fragrance.name,
  description: fragrance.description ?? "",
  price: String(fragrance.price),
  promotionalPrice:
    fragrance.promotionalPrice !== null
      ? String(fragrance.promotionalPrice)
      : "",
  stock: String(fragrance.stock),
  imageFile: null,
});

interface ProductEditorProps {
  state: ProductEditorState;
  busy: boolean;
  onCancel: () => void;
  onChange: (
    key: keyof FragranceFormValues,
    value: string | File | null,
  ) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const ProductEditor = ({
  state,
  busy,
  onCancel,
  onChange,
  onSubmit,
}: ProductEditorProps) => {
  const isCreate = state.mode === "create";

  return (
    <EditorCard surface="card" padding={16} radius={14}>
      <Typography as="h3" variant="productName">
        {isCreate ? "Nuevo producto" : "Editar producto"}
      </Typography>

      <EditorForm onSubmit={onSubmit}>
        <FieldGrid>
          <Field>
            Nombre
            <TextInput
              value={state.values.name}
              onChange={(event) => onChange("name", event.target.value)}
            />
          </Field>
          <Field>
            Precio
            <TextInput
              value={state.values.price}
              onChange={(event) => onChange("price", event.target.value)}
            />
          </Field>
          <Field>
            Stock
            <TextInput
              value={state.values.stock}
              onChange={(event) => onChange("stock", event.target.value)}
            />
          </Field>
          <Field>
            Precio promocional
            <TextInput
              value={state.values.promotionalPrice}
              onChange={(event) =>
                onChange("promotionalPrice", event.target.value)
              }
            />
          </Field>
          <Field>
            Imagen
            <TextInput
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChange("imageFile", event.target.files?.[0] ?? null)
              }
            />
          </Field>
        </FieldGrid>

        <Field>
          Descripcion
          <TextArea
            value={state.values.description}
            onChange={(event) => onChange("description", event.target.value)}
          />
        </Field>

        <FooterActions>
          <Button
            title={
              busy
                ? "Guardando..."
                : isCreate
                  ? "Crear producto"
                  : "Guardar cambios"
            }
            type="submit"
          />
          <Button
            title="Cancelar"
            variant="secondary"
            type="button"
            onClick={onCancel}
          />
        </FooterActions>
      </EditorForm>
    </EditorCard>
  );
};

export const AdminPanel = ({
  fragrances,
  productsLoading,
  adminToken,
  onLoginSuccess,
  onLogout,
  onRefresh,
}: AdminPanelProps) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [editor, setEditor] = useState<ProductEditorState | null>(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    tone: keyof typeof statusColorByTone;
  } | null>(null);

  const columnTitles = useMemo(
    () => ["NOMBRE", "PRECIO", "STOCK", "IMAGEN", "ACCIONES"],
    [],
  );

  const setErrorMessage = (error: unknown) => {
    const text = error instanceof Error ? error.message : "Error inesperado.";
    setMessage({ text, tone: "error" });
    if (text.toLowerCase().includes("token")) {
      onLogout();
      setEditor(null);
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setIsLoginLoading(true);

    try {
      const response = await loginAdmin(username, password);
      onLoginSuccess(response.token);
      setPassword("");
      await onRefresh();
      setMessage({ text: "Sesion iniciada correctamente.", tone: "success" });
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setIsLoginLoading(false);
    }
  };

  const openCreateEditor = () => {
    setEditor({
      mode: "create",
      targetId: null,
      values: { ...defaultValues },
    });
    setMessage(null);
  };

  const openEditEditor = (fragrance: Fragrance) => {
    setEditor({
      mode: "edit",
      targetId: fragrance.id,
      values: getEditValuesFromFragrance(fragrance),
    });
    setMessage(null);
  };

  const handleEditorChange = (
    key: keyof FragranceFormValues,
    value: string | File | null,
  ) => {
    setEditor((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        values: {
          ...current.values,
          [key]: value,
        },
      };
    });
  };

  const handleEditorSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!adminToken || !editor) {
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      if (editor.mode === "create") {
        await createFragrance(editor.values, adminToken);
        setMessage({ text: "Producto creado.", tone: "success" });
      } else if (editor.targetId !== null) {
        await updateFragrance(editor.targetId, editor.values, adminToken);
        setMessage({ text: "Producto actualizado.", tone: "success" });
      }

      setEditor(null);
      await onRefresh();
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (fragrance: Fragrance) => {
    if (!adminToken) {
      return;
    }

    const shouldDelete = window.confirm(
      `Eliminar ${fragrance.name}? Esta accion no se puede deshacer.`,
    );
    if (!shouldDelete) {
      return;
    }

    setIsDeletingId(fragrance.id);
    setMessage(null);

    try {
      await deleteFragrance(fragrance.id, adminToken);
      if (editor?.mode === "edit" && editor.targetId === fragrance.id) {
        setEditor(null);
      }
      await onRefresh();
      setMessage({ text: "Producto eliminado.", tone: "success" });
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setIsDeletingId(null);
    }
  };

  if (!adminToken) {
    return (
      <AuthCard surface="elevated" padding={20} radius={18}>
        <Typography as="h2" variant="sectionTitle" align="center">
          Acceso administrador
        </Typography>
        <Typography variant="secondary" color="textSecondary" align="center">
          Inicia sesion para ver y administrar el inventario.
        </Typography>

        <LoginForm onSubmit={handleLogin}>
          <LoginFieldStack>
            <Field>
              Usuario
              <TextInput
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
              />
            </Field>
            <Field>
              Contrasena
              <TextInput
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>
          </LoginFieldStack>

          <LoginActions>
            <Button
              title={isLoginLoading ? "Ingresando..." : "Ingresar"}
              type="submit"
              disabled={isLoginLoading}
            />
          </LoginActions>
        </LoginForm>

        {message && (
          <Typography
            variant="secondary"
            color={statusColorByTone[message.tone]}
          >
            {message.text}
          </Typography>
        )}
      </AuthCard>
    );
  }

  return (
    <AdminLayout surface="elevated" padding={20} radius={18}>
      <HeaderBar>
        <HeaderCopy>
          <Typography as="h2" variant="sectionTitle">
            Inventario de productos
          </Typography>
          <Typography variant="secondary" color="textSecondary">
            Tabla de control con acciones de alta, edicion y baja.
          </Typography>
        </HeaderCopy>

        <FooterActions>
          <TopIconButton
            actionType="edit"
            type="button"
            aria-label="Agregar producto"
            title="Agregar producto"
            onClick={openCreateEditor}
          >
            <PlusIcon />
          </TopIconButton>
          <Button
            title="Cerrar sesion"
            variant="secondary"
            onClick={onLogout}
          />
        </FooterActions>
      </HeaderBar>

      {productsLoading ? (
        <StateBox
          title="Cargando productos"
          description="Estamos obteniendo el inventario para el panel administrador."
        />
      ) : (
        <DataRegion>
          <DataTable>
            <thead>
              <tr>
                {columnTitles.map((title) => (
                  <HeaderCell key={title}>{title}</HeaderCell>
                ))}
              </tr>
            </thead>
            <tbody>
              {fragrances.length === 0 && (
                <tr>
                  <DataCell colSpan={5}>No hay productos cargados.</DataCell>
                </tr>
              )}
              {fragrances.map((fragrance) => {
                const imageUrl = resolveFragranceImage(fragrance.image);
                const deletingCurrent = isDeletingId === fragrance.id;

                return (
                  <tr key={fragrance.id}>
                    <DataCell>{fragrance.name}</DataCell>
                    <DataCell>{formatCurrency(fragrance.price)}</DataCell>
                    <DataCell>{fragrance.stock}</DataCell>
                    <DataCell>
                      {imageUrl ? (
                        <Thumb
                          src={imageUrl}
                          alt={fragrance.name}
                          loading="lazy"
                        />
                      ) : (
                        <EmptyThumb>Sin img</EmptyThumb>
                      )}
                    </DataCell>
                    <DataCell>
                      <ActionsBar>
                        <IconAction
                          actionType="edit"
                          type="button"
                          aria-label={`Editar ${fragrance.name}`}
                          onClick={() => openEditEditor(fragrance)}
                        >
                          <EditIcon />
                        </IconAction>
                        <IconAction
                          actionType="delete"
                          type="button"
                          aria-label={`Eliminar ${fragrance.name}`}
                          onClick={() => void handleDelete(fragrance)}
                          disabled={deletingCurrent}
                          title={deletingCurrent ? "Eliminando..." : "Eliminar"}
                        >
                          <TrashIcon />
                        </IconAction>
                      </ActionsBar>
                    </DataCell>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </DataRegion>
      )}

      {editor && (
        <ProductEditor
          state={editor}
          busy={isSaving}
          onCancel={() => setEditor(null)}
          onChange={handleEditorChange}
          onSubmit={(event) => void handleEditorSubmit(event)}
        />
      )}

      {message && (
        <Typography variant="secondary" color={statusColorByTone[message.tone]}>
          {message.text}
        </Typography>
      )}
    </AdminLayout>
  );
};
