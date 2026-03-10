import { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  TableSortLabel,
  CircularProgress,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate } from 'react-router-dom'
import { getColaboradores } from '../firebase/employeeService'
import type { Colaborador } from '../types/employee'

type Order = 'asc' | 'desc'
type OrderBy = 'titulo' | 'email' | 'departamento' | 'ativoAoCriar'

const AVATAR_COLORS = ['#F48FB1', '#CE93D8', '#90CAF9', '#80CBC4', '#FFCC80', '#A5D6A7']

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function descendingComparator(a: Colaborador, b: Colaborador, orderBy: OrderBy) {
  const aVal = a[orderBy]
  const bVal = b[orderBy]
  if (bVal < aVal) return -1
  if (bVal > aVal) return 1
  return 0
}

function getComparator(order: Order, orderBy: OrderBy) {
  return order === 'desc'
    ? (a: Colaborador, b: Colaborador) => descendingComparator(a, b, orderBy)
    : (a: Colaborador, b: Colaborador) => -descendingComparator(a, b, orderBy)
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('titulo')

  useEffect(() => {
    loadColaboradores()
  }, [])

  async function loadColaboradores() {
    setLoading(true)
    try {
      const data = await getColaboradores()
      setColaboradores(data)
    } catch {
      // silently fail if Firebase not configured
    } finally {
      setLoading(false)
    }
  }

  function handleSort(property: OrderBy) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedColaboradores = [...colaboradores].sort(getComparator(order, orderBy))

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={700} color="#1A1A1A">
          Colaboradores
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/colaboradores/novo')}
          sx={{
            bgcolor: '#2DB564',
            '&:hover': { bgcolor: '#27A058' },
            borderRadius: '8px',
            px: 3,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: 'none',
            '&:active': { boxShadow: 'none' },
          }}
        >
          Novo Colaborador
        </Button>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          borderRadius: '12px',
          border: '1px solid #E8E8E8',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {[
                { id: 'titulo' as OrderBy, label: 'Nome' },
                { id: 'email' as OrderBy, label: 'Email' },
                { id: 'departamento' as OrderBy, label: 'Departamento' },
                { id: 'ativoAoCriar' as OrderBy, label: 'Status' },
              ].map((col) => (
                <TableCell
                  key={col.id}
                  sx={{
                    fontWeight: 600,
                    color: '#8C8C8C',
                    fontSize: 13,
                    borderBottom: '1px solid #E8E8E8',
                    bgcolor: '#FAFAFA',
                    py: 1.5,
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.id}
                    direction={orderBy === col.id ? order : 'asc'}
                    onClick={() => handleSort(col.id)}
                    sx={{
                      '& .MuiTableSortLabel-icon': { fontSize: 16 },
                    }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} sx={{ color: '#2DB564' }} />
                </TableCell>
              </TableRow>
            ) : sortedColaboradores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#8C8C8C' }}>
                  Nenhum colaborador cadastrado
                </TableCell>
              </TableRow>
            ) : (
              sortedColaboradores.map((colab) => (
                <TableRow
                  key={colab.id}
                  sx={{
                    '&:hover': { bgcolor: '#FAFAFA' },
                    '& td': { borderBottom: '1px solid #F0F0F0', py: 2 },
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: getAvatarColor(colab.titulo),
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(colab.titulo)}
                      </Avatar>
                      <Typography fontSize={14} fontWeight={500} color="#1A1A1A">
                        {colab.titulo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#595959">
                      {colab.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#595959">
                      {colab.departamento}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={colab.ativoAoCriar ? 'Ativo' : 'Inativo'}
                      size="small"
                      sx={{
                        bgcolor: colab.ativoAoCriar ? '#E6F9EE' : '#FDE8E8',
                        color: colab.ativoAoCriar ? '#2DB564' : '#E53535',
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: '6px',
                        height: 26,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
