"use client";

import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type { ReferralWithCommission } from "@/lib/referrals/types";
import { StatusBadge } from "../status-badge";
import { formatClp, formatDateCl } from "@/lib/referrals/format";
import { SOURCE_LABELS } from "@/lib/referrals/status";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
});

const helper = createColumnHelper<typeof features, ReferralWithCommission>();

const columns = helper.columns([
  helper.accessor("prospect_name", {
    header: "Contacto",
    cell: (c) => (
      <div>
        <div className="font-medium">{c.getValue()}</div>
        <div className="text-xs text-muted-foreground">{c.row.original.prospect_role}</div>
      </div>
    ),
  }),
  helper.accessor("prospect_company", { header: "Empresa" }),
  helper.accessor("status", {
    header: "Estado",
    cell: (c) => <StatusBadge status={c.getValue()} />,
  }),
  helper.accessor("source", {
    header: "Origen",
    cell: (c) => SOURCE_LABELS[c.getValue() as keyof typeof SOURCE_LABELS] || c.getValue(),
  }),
  helper.accessor("created_at", {
    header: "Enviada",
    cell: (c) => formatDateCl(c.getValue()),
  }),
  helper.display({
    id: "commission",
    header: "Comisión",
    cell: (c) => {
      const comm = c.row.original.commission;
      if (!comm) return <span className="text-muted-foreground">—</span>;
      return (
        <span className="tabular-nums text-emerald-800 dark:text-emerald-300">
          {formatClp(comm.commission_amount_clp)}
        </span>
      );
    },
  }),
]);

const EMPTY: ReferralWithCommission[] = [];

export function ReferralTable({
  data,
}: {
  data: ReferralWithCommission[];
  dense?: boolean;
}) {
  const rows = data.length ? data : EMPTY;
  const table = useTable({
    features,
    columns,
    data: rows,
  });

  const headerGroups = table.getHeaderGroups();
  const bodyRows = table.getRowModel().rows;

  return (
    <div className="rounded-2xl border border-border bg-card">
      <Table>
        <TableHeader>
          {headerGroups.map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="cursor-pointer select-none"
                  onClick={h.column.getToggleSortingHandler()}
                >
                  {h.isPlaceholder ? null : <table.FlexRender header={h} />}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {bodyRows.map((row) => (
            <TableRow key={row.id}>
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
