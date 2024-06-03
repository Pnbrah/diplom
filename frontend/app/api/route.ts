import { NextRequest, NextResponse } from 'next/server';
import { getData, type User } from '@/utils/mock';
import { MRT_ColumnFiltersState, MRT_SortingState } from 'mantine-react-table';


export async function GET(req: NextRequest) {
  
  if (process.env.NODE_ENV === 'development') {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const url = new URL(req.nextUrl)
  let dbData = getData();
   
  const { start, size, filters, filterModes, sorting, globalFilter } = Object.fromEntries(url.searchParams) as Record<string, string>;

  const parsedFilterModes = JSON.parse(filterModes ?? '{}') as Record<string, string>;
  
  if (filters) {
    const parsedColumnFilters = JSON.parse(filters) as MRT_ColumnFiltersState;
    if (parsedColumnFilters?.length) {
      dbData = dbData.filter((row) => {
        return parsedColumnFilters.every((filter) => {
          const { id: columnId, value: filterValue } = filter;
          const filterMode = parsedFilterModes?.[columnId] ?? 'contains';
          const rowValue = row[columnId as keyof User]?.toString()?.toLowerCase();
          if (filterMode === 'contains') {
            return rowValue.includes((filterValue as string).toLowerCase());
          } else if (filterMode === 'startsWith') {
            return rowValue.startsWith((filterValue as string).toLowerCase());
          } else if (filterMode === 'endsWith') {
            return rowValue.endsWith((filterValue as string).toLowerCase());
          }
          return true; // Default to true if filter mode is not recognized
        });
      });
    }
}

  if (globalFilter) {
    dbData = dbData.filter((row) =>
    Object.keys(row).some((columnId) =>
    row[columnId as keyof User]
      ?.toString()
      ?.toLowerCase()
      ?.includes?.((globalFilter as string).toLowerCase()),
      )
    );
  }

if (sorting) {
  const parsedSorting = JSON.parse(sorting) as MRT_SortingState;
  if (parsedSorting?.length) {
    const sort = parsedSorting[0];
    const { id, desc } = sort as {id: keyof User; desc: boolean}; // Add 'desc' property to type declaration

    dbData.sort((a, b) => {
        if (desc) {
            return a[id ] < b[id] ? 1 : -1;
        }
        return a[id] > b[id] ? 1 : -1;
    });
  };
}

const totalRowCount = dbData.length;

if (start && size) {
  dbData = dbData.slice(parseInt(start), parseInt(start) + parseInt(size));
}
  return NextResponse.json({
    status: 200,
    data: dbData,
    meta: { totalRowCount },
});
}


