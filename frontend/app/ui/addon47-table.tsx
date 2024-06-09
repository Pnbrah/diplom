'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState, type MRT_SortingState, type MRT_Virtualizer } from 'mantine-react-table';
import { Text, Button } from '@mantine/core';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { generateDocument } from './generate-document';

const API_TOKEN = '3edea083405efad219925296cf692dc64cd4528687c306764b679043e92a8eaddb344c09ef178f9cb816fe5b83682af5656c214302199ed080567f917027533df38ad95ee85a057a4de033f6f9f3091c9c5214aa213b898b99d4e2133dc9a0968f6b69ae65a575fdc9159cf29a1d6fb2a202cc40f445c861d5e1bba4738e6abf';

interface InvoiceItem {
  id: number;
  attributes: {
    operation: string,
    number: string,
    date: Date | null,
    headquarterSender: string,
    warehouseSender: string,
    headquarterReceiver: string,
    warehouseReceiver: string,
    basis: string,
    basisHeadquarter: string,
    basisDate: Date | null,
    basisNumber: string,
    headRAO: string,
    headRAORank: string,
    headRAOName: string,
    headFES: string,
    headFESRank: string,
    headFESName: string,
    clerk: string,
    clerkRank: string,
    clerkName: string,
    warehouseHead: string,
    warehouseHeadRank: string,
    warehouseHeadName: string,
    warehouseStatus: string,
    recipient: string,
    recipientStatus: string,
    recipientRank: string,
    recipientName: string,
    items: { // Масив об'єктів Item
      data: {
        id: number;
        attributes: {
          itemList: string;
          itemNumber: number ;
          quantity: number;
          price: number;
        };
      }[];
    };
  };
}

type InvoiceApiResponse = {
  data: Array<InvoiceItem>;
  meta: {
    pagination: {
      total: number;
      page: number;
      pageSize: number;
      pageCount: number;
    };
  };
};


const columns: MRT_ColumnDef<InvoiceItem>[] = [
  // {
  //   accessorKey: 'attributes.items',
  //   header: 'Товари',
  //   id: 'items',
  //   columns: [
  //     { accessorKey: 'attributes.items.data.itemList', header: 'Найменування' },
  //     { accessorKey: 'attributes.items.data.itemNumber', header: 'Номер' },
  //     { accessorKey: 'attributes.items.data.quantity', header: 'Кількість' },
  //     { accessorKey: 'attributes.items.data.price', header: 'Ціна' },
  //   ],
  // },
  {
    accessorKey: 'attributes.number',
    header: 'Номер',
    id: 'invoiceNumber'
  },
  {
    accessorKey: 'attributes.date',
    header: 'Дата',
    id: 'invoiceDate'
  },
  {
    header: 'Відправник',
    id: 'shipper',
    columns: [
      {
        accessorKey: 'attributes.headquarterSender',
        header: 'Штаб',
        id: 'headquarterSender',
      },
      {
        accessorKey: 'attributes.warehouseSender',
        header: 'Склад',
        id: 'warehouseSender',
      },
    ],
  },
  {
    header: 'Одержувач',
    id: 'recipient',
    columns: [
      {
        accessorKey: 'attributes.headquarterReceiver',
        header: 'Штаб',
        id: 'headquarterReceiver',
      },
      {
        accessorKey: 'attributes.warehouseReceiver',
        header: 'Склад',
        id: 'warehouseReceiver',
      },
      {
        accessorKey: 'attributes.recipientStatus',
        header: 'Статус',
        id: 'recipientStatus',
      },
      {
        accessorKey: 'attributes.recipientRank',
        header: 'Звання',
        id: 'recipientRank',
      },
      {
        accessorKey: 'attributes.recipientName',
        header: "ПІБ",
        id: 'recipientName',
      },
    ],
  },
  {
    header: 'Підстава',
    id: 'basis',
    columns: [
      {
        accessorKey: 'attributes.basis',
        header: 'Тип',
        id: 'basisType',
      },
      {
        accessorKey: 'attributes.basisHeadquarter',
        header: 'Штаб',
        id: 'basisHeadquarter',
      },
      {
        accessorKey: 'attributes.basisDate',
        header: 'Дата',
        id: 'basisDate',
      },
      {
        accessorKey: 'attributes.basisNumber',
        header: 'Номер',
        id: 'basisNumber',
      },
    ],
  },
  {
    header: 'Нач. РАО',
    id: 'headRAO',
    columns: [
      {
        accessorKey: 'attributes.headRAORank',
        header: 'Звання',
        id: 'headRAORank',
      },
      {
        accessorKey: 'attributes.headRAOName',
        header: 'ПІБ',
        id: 'headRAOName',
      },
    ],
  },
  {
    header: 'Нач. ФЕС',
    id: 'headFES',
    columns: [
      {
        accessorKey: 'attributes.headFESRank',
        header: 'Звання',
        id: 'headFESRank',
      },
      {
        accessorKey: 'attributes.headFESName',
        header: 'ПІБ',
        id: 'headFESName',
      },
    ],
  },
  {
    header: 'Діловод РАО',
    id: 'clerk',
    columns: [
      {
        accessorKey: 'attributes.clerkRank',
        header: 'Звання',
        id: 'clerkRank',
      },
      {
        accessorKey: 'attributes.clerkName',
        header: 'ПІБ',
        id: 'clerkName',
      },
    ],
  },
  {
    header: 'Нач. Складу',
    id: 'warehouseHead',
    columns: [
      {
        accessorKey: 'attributes.warehouseHeadRank',
        header: 'Звання',
        id: 'warehouseHeadRank',
      },
      {
        accessorKey: 'attributes.warehouseHeadName',
        header: 'ПІБ',
        id: 'warehouseHeadName',
      },
      {
        accessorKey: 'attributes.warehouseStatus',
        header: 'Статус',
        id: 'warehouseStatus',
      },
    ],
  },
];

const FETCH_SIZE = 50;
const SCROLL_THRESHOLD = 400;

const Addon47Table = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } = useInfiniteQuery<InvoiceApiResponse>({
    queryKey: ['table-data', columnFilters, globalFilter, sorting],
    queryFn: async ({ pageParam = 1 }) => { // Start from page 1
      const url = `http://localhost:1337/api/invoices?populate=items&pagination[page]=${pageParam}&pagination[pageSize]=${FETCH_SIZE}`; // Додали populate=items
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.pagination.page < lastPage.meta.pagination.pageCount) {
        return lastPage.meta.pagination.page + 1; 
      }
      return undefined; // No more pages
    },
    refetchOnWindowFocus: false,
    initialPageParam: 1,
  });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => 
      page.data.map(item => ({
        id: item.id, 
        attributes: item.attributes 
      }))
    ) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.pagination?.total ?? 0;

  const totalFetched = flatData.length;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (
        containerRefElement &&
        containerRefElement.scrollHeight - containerRefElement.scrollTop - containerRefElement.clientHeight < SCROLL_THRESHOLD &&
        !isFetching &&
        totalFetched < totalDBRowCount
      ) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  useEffect(() => {
    if (rowVirtualizerInstanceRef.current) {
      try {
        rowVirtualizerInstanceRef.current.scrollToIndex(0);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const handleGenerateDocument = async () => {
    try {
      await generateDocument(1); // Pass the appropriate invoice ID if needed
    } catch (error) {
      console.error('Error generating document:', error);
    }
  };

  const table = useMantineReactTable({
    columns,
    data: flatData,
    enablePagination: false,
    enableDensityToggle: false,
    initialState: { density: 'xs' },
    enableRowVirtualization: true,
    enableHiding: false,
    manualFiltering: true,
    manualSorting: true,
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: true,
    },
    mantineTableContainerProps: {
      ref: tableContainerRef,
      style: { overflowY: 'auto' },
      onScroll: (event) =>
        fetchMoreOnBottomReached(event.target as HTMLDivElement),
    },
    mantineToolbarAlertBannerProps: {
      color: 'red',
      children: 'Error loading data',
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderTopToolbarCustomActions: () => (
      <div className='flex justify-between'>
        <Text className='text-2xl font-bold px-10'>
          {flatData.length > 0 ? (
            flatData[0].attributes.items?.data[0]?.attributes?.itemList || "Gun"
          ) : (
            "Gun"
          )}
        </Text>
        <Text className='text-2xl font-bold px-10'>
          Код номенклатури: {flatData.length > 0 ? flatData[0].attributes.number || '' : ''}
        </Text>
        <Button onClick={handleGenerateDocument}>
          Генерувати
        </Button>
        </div>
    ),
    renderBottomToolbarCustomActions: () => (
      <Text>
        Fetched {totalFetched} of {totalDBRowCount} total rows.
      </Text>
    ),
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
    rowVirtualizerInstanceRef,
    rowVirtualizerProps: { overscan: 5 },
    columnVirtualizerProps: { overscan: 2 },
  });

  return <MantineReactTable table={table} />;
};

const queryClient = new QueryClient();

export const Addon47 = () => (
  <QueryClientProvider client={queryClient}>
    <Addon47Table />
  </QueryClientProvider>
);
