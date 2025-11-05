import React from "react";
import {
  Avatar,
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useOperators, useOperatorAddons } from "@/api/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  setDateFrom,
  setDateTo,
  setPage,
  setRowsPerPage,
  setSearch,
  setSort,
  setWorking,
} from "@/store";
import type { Operator, OperatorAddon } from "@/types";

type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (
    op: Operator,
    addonsDict: Record<string, string>
  ) => React.ReactNode;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return format(d, "dd.MM.yyyy HH:mm");
};

const buildAddonColumns = (addons: OperatorAddon[]): string[] => {
  const set = new Set<string>();
  for (const a of addons) set.add(a.fieldName);
  const sorted = Array.from(set).sort((a, b) => a.localeCompare(b));
  const promoted = ["SMTP", "JBOD"];
  const start: string[] = [];
  const rest: string[] = [];
  for (const f of sorted) (promoted.includes(f) ? start : rest).push(f);
  return [...start, ...rest];
};

export const OperatorTable: React.FC = () => {
  const dispatch = useDispatch();
  const { page, rowsPerPage, sort, filters } = useSelector(
    (s: RootState) => s.table
  );

  const ops = useOperators();
  const add = useOperatorAddons();
  const loading = ops.isLoading || add.isLoading;

  const addonFieldNames = buildAddonColumns(add.data ?? []);
  const columns: Column[] = [
    { key: "#", label: "#" },
    {
      key: "user",
      label: "Користувач",
      sortable: true,
      render: (op) => (
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            src={op.avatar}
            alt={op.name}
            sx={{ width: 32, height: 32 }}
          />
          <Typography fontWeight={600}>{op.name}</Typography>
        </Box>
      ),
    },
    {
      key: "isWorking",
      label: "Працює",
      sortable: true,
      render: (op) => <Checkbox checked={op.isWorking} readOnly />,
    },
    {
      key: "createdAt",
      label: "Дата доєднання",
      sortable: true,
      render: (op) => (
        <Tooltip title={op.createdAt}>
          <span>{formatDate(op.createdAt)}</span>
        </Tooltip>
      ),
    },
    ...addonFieldNames.map<Column>((fname) => ({
      key: `addon:${fname}`,
      label: `\`${fname}\``,
      sortable: true,
      render: (_op, dict) => dict[fname] ?? "—",
    })),
  ];

  const addonDict: Record<string, string> = React.useMemo(() => {
    const dict: Record<string, string> = {};
    for (const a of add.data ?? []) {
      dict[a.fieldName] = a.text;
    }
    return dict;
  }, [add.data]);

  const filteredSorted = React.useMemo(() => {
    let rows = (ops.data ?? []) as Operator[];

    const q = filters.search.trim().toLowerCase();
    if (q) rows = rows.filter((r) => r.name.toLowerCase().includes(q));

    if (filters.working === "working") rows = rows.filter((r) => r.isWorking);
    if (filters.working === "not_working")
      rows = rows.filter((r) => !r.isWorking);

    const df = filters.dateFrom ? new Date(filters.dateFrom) : null;
    const dt = filters.dateTo ? new Date(filters.dateTo) : null;
    if (df || dt) {
      rows = rows.filter((r) => {
        const d = new Date(r.createdAt);
        if (Number.isNaN(d.getTime())) return false;
        if (df && d < df) return false;
        if (dt && d > dt) return false;
        return true;
      });
    }

    const { orderBy, order } = sort;
    rows.sort((a, b) => {
      const dir = order === "asc" ? 1 : -1;
      const getVal = (op: Operator) => {
        if (orderBy === "user") return op.name;
        if (orderBy === "isWorking") return op.isWorking ? 1 : 0;
        if (orderBy === "createdAt")
          return new Date(op.createdAt).getTime() || 0;
        if (orderBy.startsWith("addon:")) {
          const key = orderBy.split(":")[1] ?? "";
          return (addonDict[key] ?? "").toLowerCase();
        }
        return "";
      };
      const va = getVal(a);
      const vb = getVal(b);
      if (va < vb) return -1 * dir;
      if (va > vb) return 1 * dir;
      return 0;
    });

    return rows;
  }, [
    ops.data,
    filters.search,
    filters.working,
    filters.dateFrom,
    filters.dateTo,
    sort,
    addonDict,
  ]);

  const paged = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filteredSorted.slice(start, start + rowsPerPage);
  }, [filteredSorted, page, rowsPerPage]);

  const handleSort = (key: string) => {
    const isAsc = sort.orderBy === key && sort.order === "asc";
    dispatch(setSort({ orderBy: key, order: isAsc ? "desc" : "asc" }));
  };

  return (
    <>
      <Box
        display="grid"
        gridTemplateColumns="1fr auto auto auto"
        gap={1.5}
        mb={2}
      >
        <TextField
          label="Пошук за ім'ям"
          value={filters.search}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          size="small"
        />
        <FormControl size="small">
          <InputLabel id="working-select">Працює</InputLabel>
          <Select
            labelId="working-select"
            value={filters.working}
            label="Працює"
            onChange={(e) => dispatch(setWorking(e.target.value as any))}
            input={<OutlinedInput label="Працює" />}
          >
            <MenuItem value="all">Всі</MenuItem>
            <MenuItem value="working">Так</MenuItem>
            <MenuItem value="not_working">Ні</MenuItem>
          </Select>
        </FormControl>
        <TextField
          type="datetime-local"
          label="Від дати"
          value={filters.dateFrom ?? ""}
          onChange={(e) => dispatch(setDateFrom(e.target.value || null))}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="datetime-local"
          label="До дати"
          value={filters.dateTo ?? ""}
          onChange={(e) => dispatch(setDateTo(e.target.value || null))}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell
                  key={c.key}
                  onClick={() =>
                    c.sortable && handleSort(c.key === "user" ? "user" : c.key)
                  }
                  sx={{
                    cursor: c.sortable ? "pointer" : "default",
                    fontWeight: 700,
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <span>{c.label}</span>
                    {c.sortable && sort.orderBy === c.key && (
                      <Typography
                        component="span"
                        fontSize={12}
                        color="text.secondary"
                      >
                        {sort.order === "asc" ? "▲" : "▼"}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={4}
                    gap={2}
                  >
                    <CircularProgress size={24} />
                    <Typography>Завантаження…</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : paged.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Box p={4} textAlign="center">
                    <Typography color="text.secondary">
                      Нічого не знайдено
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              paged.map((op, idx) => (
                <TableRow hover key={op.id}>
                  {columns.map((c) => {
                    if (c.key === "#")
                      return (
                        <TableCell key={c.key}>
                          {page * rowsPerPage + idx + 1}
                        </TableCell>
                      );
                    if (c.render)
                      return (
                        <TableCell key={c.key}>
                          {c.render(op, addonDict)}
                        </TableCell>
                      );

                    const value = (op as any)[c.key];
                    return <TableCell key={c.key}>{String(value)}</TableCell>;
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredSorted.length}
        page={page}
        onPageChange={(_e, p) => dispatch(setPage(p))}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) =>
          dispatch(setRowsPerPage(parseInt(e.target.value, 10)))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
        labelRowsPerPage="Рядків на сторінці"
      />
    </>
  );
};
