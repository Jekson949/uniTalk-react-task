import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TableState, TableSort, WorkingFilter } from '@/types'

const initialState: TableState = {
  page: 0,
  rowsPerPage: 10,
  sort: { orderBy: 'createdAt', order: 'desc' },
  filters: {
    search: '',
    working: 'all',
    dateFrom: null,
    dateTo: null
  }
}

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload
    },
    setRowsPerPage(state, action: PayloadAction<number>) {
      state.rowsPerPage = action.payload
      state.page = 0
    },
    setSort(state, action: PayloadAction<TableSort>) {
      state.sort = action.payload
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload
      state.page = 0
    },
    setWorking(state, action: PayloadAction<WorkingFilter>) {
      state.filters.working = action.payload
      state.page = 0
    },
    setDateFrom(state, action: PayloadAction<string | null | undefined>) {
      state.filters.dateFrom = action.payload ?? null
      state.page = 0
    },
    setDateTo(state, action: PayloadAction<string | null | undefined>) {
      state.filters.dateTo = action.payload ?? null
      state.page = 0
    }
  }
})

export const {
  setPage,
  setRowsPerPage,
  setSort,
  setSearch,
  setWorking,
  setDateFrom,
  setDateTo
} = tableSlice.actions

export const store = configureStore({
  reducer: {
    table: tableSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
