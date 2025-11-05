import React from 'react'
import { ThemeProvider, CssBaseline, Typography, Divider } from '@mui/material'
import { theme } from './theme'
import { Card, Page } from './styles'
import { OperatorTable } from './components/OperatorTable'

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Page>
        <Card elevation={0}>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            UniTalk — Оператори
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Таблиця злитих даних з ендпоїнтів <code>operator</code> та <code>operatorAddon</code> з фільтрацією, сортуванням та пагінацією.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <OperatorTable />
        </Card>
      </Page>
    </ThemeProvider>
  )
}

export default App
