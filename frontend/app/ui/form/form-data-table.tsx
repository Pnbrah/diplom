import { useMemo, useState } from 'react';
import {
  MaterialReactTable,
  // createRow,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMaterialReactTable,
} from 'material-react-table';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import DeleteIcon from '@mui/icons-material/Delete';
import { type Item, listNames, fakeData } from '@/app/api/data/api';
import axios from 'axios';
import { API_URL, API_TOKEN } from '@/app/api/data/constants';


const useListNames = () => {
  return useQuery({
    queryKey: ['listNames'],
    queryFn: listNames,
    staleTime: Infinity,
  });
};


const FormDataTable = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});
  const [editedItems, setEditedItems] = useState<Record<string, Item>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);

  const { data: itemNames = [] } = useListNames();

  const columns = useMemo<MRT_ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: 'itemList',
        header: 'Найменування ОВТ',
        editVariant: 'select',
        editSelectOptions: itemNames,
        muiEditTextFieldProps: ({ row }) => ({
          select: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          onChange: (event) =>
            setEditedItems({
              ...editedItems,
              [row.id]: { ...row.original, price: event.target.value },
            }),
        }),
      },
      {
        accessorKey: 'itemNumber',
        header: '№',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value) ? 'Required' : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedItems({ ...editedItems, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'quantity',
        header: 'Кількість',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value) ? 'Неправильний формат' : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedItems({ ...editedItems, [row.id]: row.original });
          },
        }),
      },
      {
        accessorKey: 'price',
        header: 'Ціна',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value) ? 'Required' : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedItems({ ...editedItems, [row.id]: row.original });
          },
        }),
      },
    ],
    [editedItems, validationErrors, itemNames]
  );

  const { mutateAsync: createItem, isPending: isCreatingItem } = useCreateItem();
  const { data: fetchedItems = [], isError: isLoadingItemsError, isFetching: isFetchingItems, isLoading: isLoadingItems } = useGetItems();
  const { mutateAsync: updateItems, isPending: isUpdatingItems } = useUpdateItems();
  const { mutateAsync: deleteItem, isPending: isDeletingItem } = useDeleteItem();

  const handleCreateItem: MRT_TableOptions<Item>['onCreatingRowSave'] = async ({ values, table }) => {
    const newValidationErrors = validateItem(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createItem(values);
    table.setCreatingRow(null);
  };

  const handleSaveItems = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateItems(Object.values(editedItems));
    setEditedItems({});
  };

  const openDeleteConfirmModal = (row: MRT_Row<Item>) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedItems,
    createDisplayMode: 'row',
    editDisplayMode: 'table',
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: 'last',
    getRowId: (row) => row.id,
    muiToolbarAlertBannerProps: isLoadingItemsError
      ? {
        color: 'error',
        children: 'Помилка завантаження даних',
      }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: '500px',
      },
    },
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateItem,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Видалити">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Виправте помилку перед збереженням</Typography>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        Додати позицію
      </Button>
    ),
    state: {
      isLoading: isLoadingItems,
      isSaving: isCreatingItem || isUpdatingItems || isDeletingItem,
      showAlertBanner: isLoadingItemsError,
      showProgressBars: isFetchingItems,
    },
  });

  return <MaterialReactTable table={table} />;
};

//CREATE hook (post new item to api)
function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: Item) => {
      const response = await axios.post(`${API_URL}/api/items`, {
        data: {
          itemList: item.itemList,
          itemNumber: item.itemNumber,
          quantity: item.quantity,
          price: item.price,
        },
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      if (response.status !== 200) {
        throw new Error('Failed to create item');
      }
      return response.data; // Return the created item data
    },
    //client side optimistic update
    onMutate: (newItemInfo: Item) => {
      queryClient.setQueryData(
        ['items'],
        (prevItems: any) =>
          [
            ...prevItems,
            {
              ...newItemInfo,
              id: (Math.random() + 1).toString(36).substring(7),
            },
          ] as Item[],
      );
    },
  });
}

//READ hook (get items from api)
function useGetItems() {
  return useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      //send api request here

      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put item in api)
function useUpdateItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updatedItems: Item[]) => {
      const updatePromises = updatedItems.map(async (item) => {
        const response = await axios.put(`${API_URL}/api/items/${item.id}`, {
          data: {
            itemList: item.itemList,
            itemNumber: item.itemNumber,
            quantity: item.quantity,
            price: item.price,
          },
        }, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });

        if (response.status !== 200) {
          throw new Error(`Failed to update item with ID ${item.id}`);
        }
      });

      await Promise.all(updatePromises);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

//DELETE hook (delete item in api)
function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      //send api update request here
      await axios.delete(`${API_URL}/api/items/${itemId}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

const queryClient = new QueryClient();

const FormDataTableWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <FormDataTable />
  </QueryClientProvider>
);

export default FormDataTableWithProviders;

const validateRequired = (value: string) => !!value.length;

function validateItem(item: Item) {
  return {
    itemList: !validateRequired(item.itemList)
      ? 'Виберіть назву'
      : '',
    quantity: !validateRequired(item.quantity) ? 'Необхідне поле' : '',
    price: !validateRequired(item.price) ? 'Необхідне поле' : '',
  };
}