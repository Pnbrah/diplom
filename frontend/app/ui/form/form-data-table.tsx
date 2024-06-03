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
import { type Item, fakeData, listNames } from './makeData';
import DeleteIcon from '@mui/icons-material/Delete';

const FormDataTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});
  //keep track of rows that have been edited
  const [editedItems, setEditedItems] = useState<Record<string, Item>>({});

  const columns = useMemo<MRT_ColumnDef<Item>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Найменування ОВТ',
        editVariant: 'select',
        editSelectOptions: listNames,
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
        accessorKey: 'numberOf',
        header: '№',
        muiEditTextFieldProps: ({ cell, row }) => ({
          type: 'number',
          required: true,
          error: !!validationErrors?.[cell.id],
          helperText: validationErrors?.[cell.id],
          //store edited item in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
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
          //store edited item in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Неправильний формат'
              : undefined;
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
          //store edited item in state to be saved later
          onBlur: (event) => {
            const validationError = !validateRequired(event.currentTarget.value)
              ? 'Required'
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
            setEditedItems({ ...editedItems, [row.id]: row.original });
          },
        }),
      },
    ],
    [editedItems, validationErrors],
  );

  //call CREATE hook
  const { mutateAsync: createItem, isPending: isCreatingItem } =
    useCreateItem();
  //call READ hook
  const {
    data: fetchedItems = [],
    isError: isLoadingItemsError,
    isFetching: isFetchingItems,
    isLoading: isLoadingItems,
  } = useGetItems();
  //call UPDATE hook
  const { mutateAsync: updateItems, isPending: isUpdatingItems } =
    useUpdateItems();
  //call DELETE hook
  const { mutateAsync: deleteItem, isPending: isDeletingItem } =
    useDeleteItem();

  //CREATE action
  const handleCreateItem: MRT_TableOptions<Item>['onCreatingRowSave'] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateItem(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createItem(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //UPDATE action
  const handleSaveItems = async () => {
    if (Object.values(validationErrors).some((error) => !!error)) return;
    await updateItems(Object.values(editedItems));
    setEditedItems({});
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Item>) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteItem(row.original.id);
    }
  };

  const table = useMaterialReactTable({
    columns,
    data: fetchedItems,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'table', // ('modal', 'row', 'cell', and 'custom' are also
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
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
    renderBottomToolbarCustomActions: () => (
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Button
          color="success"
          variant="contained"
          onClick={handleSaveItems}
          disabled={
            Object.keys(editedItems).length === 0 ||
            Object.values(validationErrors).some((error) => !!error)
          }
        >
          {isUpdatingItems ? <CircularProgress size={25} /> : 'Зберегти'}
        </Button>
        {Object.values(validationErrors).some((error) => !!error) && (
          <Typography color="error">Виправте помилку перед збереженням</Typography>
        )}
      </Box>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true); //simplest way to open the create row modal with no default values
          //or you can pass in a row object to set default values with the `createRow` helper function
          // table.setCreatingRow(
          //   createRow(table, {
          //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
          //   }),
          // );
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
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
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
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }), //refetch items after mutation, disabled for demo
  });
}

//READ hook (get items from api)
function useGetItems() {
  return useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      //send api request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve(fakeData);
    },
    refetchOnWindowFocus: false,
  });
}

//UPDATE hook (put item in api)
function useUpdateItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (items: Item[]) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (newItems: Item[]) => {
      queryClient.setQueryData(['items'], (prevItems: any) =>
        prevItems?.map((item: Item) => {
          const newItem = newItems.find((u) => u.id === item.id);
          return newItem ? newItem : item;
        }),
      );
    },
    // onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }), //refetch items after mutation, disabled for demo
  });
}

//DELETE hook (delete item in api)
function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (itemId: string) => {
      //send api update request here
      await new Promise((resolve) => setTimeout(resolve, 1000)); //fake api call
      return Promise.resolve();
    },
    //client side optimistic update
    onMutate: (itemId: string) => {
      queryClient.setQueryData(['items'], (prevItems: any) =>
        prevItems?.filter((item: Item) => item.id !== itemId),
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['items'] }), //refetch items after mutation, disabled for demo
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
    name: !validateRequired(item.name)
      ? 'Виберіть назву'
      : '',
    quantity: !validateRequired(item.quantity) ? 'Необхідне поле' : '',
    price: !validateRequired(item.price) ? 'Необхідне поле' : '',
  };
}


