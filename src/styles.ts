import styled from 'styled-components'
import { Paper } from '@mui/material'

export const Page = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: start center;
  padding: 24px;
  background: linear-gradient(180deg, #f9fafb, #f3f4f6);
`

export const Card = styled(Paper)`
  width: 100%;
  max-width: 1200px;
  padding: 16px;
  border-radius: 16px !important;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06) !important;
`

export const ToolbarRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 8px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`
