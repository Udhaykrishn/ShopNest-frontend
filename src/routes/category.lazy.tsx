import { createLazyFileRoute } from '@tanstack/react-router';
import TableWrapper, { Column } from '@/components/Table-wrapper';

export interface Category {
  _id: string;
  name: string;
  isBlocked: boolean;
}

const categoryColumns: Column<Category>[] = [
  { key: '_id', label: 'Id' },
  { key: 'name', label: 'Category Name' },
  {
    key: 'isBlocked',
    label: 'Blocked',
    render: (value: boolean) => <span>{value ? 'Yes' : 'No'}</span>,
  },
];

const categoryFilters = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

function CategoryTable() {
  return (
    <TableWrapper
      columns={categoryColumns}
      fetchUrl="https://shopnest.zapto.org/api/categorys"
      filters={categoryFilters}
      pageSizeOptions={[5, 10, 20]}
    />
  );
}

export const Route = createLazyFileRoute('/category')({
  component: CategoryTable,
});