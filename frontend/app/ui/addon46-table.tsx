'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef, type MRT_ColumnFiltersState, type MRT_SortingState, type MRT_Virtualizer } from 'mantine-react-table';
import { Text } from '@mantine/core';
import { QueryClient, QueryClientProvider, useInfiniteQuery } from '@tanstack/react-query';
import { type User } from '@/utils/mock';
import axios from 'axios';

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

const columns: MRT_ColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: 'First Name',
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
  },
  {
    accessorKey: 'address',
    header: 'Address',
  },
  {
    accessorKey: 'state',
    header: 'State',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
];

const FETCH_SIZE = 50;
const SCROLL_THRESHOLD = 400;

const Addon46Table = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const rowVirtualizerInstanceRef = useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [sorting, setSorting] = useState<MRT_SortingState>([]);

  const { data, fetchNextPage, isError, isFetching, isLoading } = useInfiniteQuery<UserApiResponse>({
    queryKey: ['table-data', columnFilters, globalFilter, sorting],
    queryFn: async ({ pageParam = 0 }) => {
      const url = '/api/';
      const params = {
        start: `${pageParam * FETCH_SIZE}`,
        size: `${FETCH_SIZE}`,
        filters: JSON.stringify(columnFilters ?? []),
        globalFilter: globalFilter ?? '',
        sorting: JSON.stringify(sorting ?? []),
      };

      const response = await axios.get(url, { params });
      const json = response.data as UserApiResponse;
      return json;
    },
    getNextPageParam: (_lastGroup, groups) => groups.length,
    initialPageParam: 0,
    refetchOnWindowFocus: false,
  });

  const flatData = useMemo(() => data?.pages.flatMap((page) => page.data) ?? [], [data]);

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
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

  const table = useMantineReactTable<User>({
    columns,
    data: flatData,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    manualFiltering: true,
    manualSorting: true,
    mantineTableProps: {
      highlightOnHover: true,
      withColumnBorders: true,
      withBorder: true
    },
    mantineTableContainerProps: {
      ref: tableContainerRef,
      style: { maxHeight: '80vh', overflowY: 'auto' },
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

  return <MantineReactTable table={table} />
};

const queryClient = new QueryClient();

export const Addon46 = () => (
  <QueryClientProvider client={queryClient}>
    <Addon46Table />
  </QueryClientProvider>
);