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
  Checkbox,
  IconButton,
  TextField,
  MenuItem,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router-dom'
import {
  getColaboradores,
  deleteColaborador,
  deleteColaboradores,
} from '../firebase/employeeService'
import { getDepartamentos } from '../firebase/departmentService'
import type { Colaborador } from '../types/employee'
import type { Departamento } from '../types/department'

type Order = 'asc' | 'desc'
type OrderBy = 'titulo' | 'email' | 'departamentoId' | 'ativoAoCriar'

const AVATAR_COLORS = ['#F48FB1', '#CE93D8', '#90CAF9', '#80CBC4', '#FFCC80', '#A5D6A7']

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
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
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<OrderBy>('titulo')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filterNome, setFilterNome] = useState('')
  const [filterEmail, setFilterEmail] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  })

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    try {
      const [collabs, deps] = await Promise.all([getColaboradores(), getDepartamentos()])
      setColaboradores(collabs)
      setDepartamentos(deps)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  const deptMap = Object.fromEntries(departamentos.map((item) => [item.id, item]))

  function getDeptName(deptId: string) {
    return deptMap[deptId]?.nome || deptId || '-'
  }

  function handleSort(property: OrderBy) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const filtered = colaboradores.filter((colaborador) => {
    if (filterNome && !colaborador.titulo.toLowerCase().includes(filterNome.toLowerCase())) return false
    if (filterEmail && !colaborador.email.toLowerCase().includes(filterEmail.toLowerCase())) return false
    if (filterDept && colaborador.departamentoId !== filterDept) return false
    return true
  })

  const sorted = [...filtered].sort(getComparator(order, orderBy))

  function handleSelectAll(checked: boolean) {
    if (checked) {
      setSelected(new Set(sorted.map((colaborador) => colaborador.id!)))
      return
    }
    setSelected(new Set())
  }

  function handleSelectOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const allSelected = sorted.length > 0 && sorted.every((colaborador) => selected.has(colaborador.id!))
  const someSelected = sorted.some((colaborador) => selected.has(colaborador.id!)) && !allSelected

  function handleDeleteClick(id: string) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingId) return
    try {
      await deleteColaborador(deletingId)
      setSelected((prev) => {
        const next = new Set(prev)
        next.delete(deletingId)
        return next
      })
      setSnackbar({ open: true, message: 'Colaborador excluido com sucesso!', severity: 'success' })
      await loadData()
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir colaborador.', severity: 'error' })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  async function handleBulkDelete() {
    try {
      await deleteColaboradores(Array.from(selected))
      setSelected(new Set())
      setSnackbar({ open: true, message: `${selected.size} colaborador(es) excluido(s) com sucesso!`, severity: 'success' })
      await loadData()
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir colaboradores.', severity: 'error' })
    } finally {
      setBulkDeleteOpen(false)
    }
  }

  const filterSx = {
    minWidth: 200,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      bgcolor: '#fff',
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#2DB564' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#2DB564' },
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={700} color="#1A1A1A">
          Colaboradores
        </Typography>
        <Box display="flex" gap={1.5}>
          {selected.size > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setBulkDeleteOpen(true)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              Excluir ({selected.size})
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/colaboradores/novo')}
            sx={{
              bgcolor: '#2DB564',
              color: '#FFFFFF',
              '&:hover': { bgcolor: '#27A058' },
              borderRadius: '8px',
              px: 3,
              py: 1.2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 14,
              boxShadow: 'none',
            }}
          >
            Novo Colaborador
          </Button>
        </Box>
      </Box>

      {!loading && (
        <Box display="flex" gap={2} mb={3}>
          {[
            { label: 'Total', value: colaboradores.length, color: '#2DB564' },
            { label: 'Ativos', value: colaboradores.filter((item) => item.ativoAoCriar).length, color: '#2DB564' },
            { label: 'Inativos', value: colaboradores.filter((item) => !item.ativoAoCriar).length, color: '#E53535' },
          ].map((card) => (
            <Paper
              key={card.label}
              elevation={0}
              sx={{
                px: 3,
                py: 2,
                borderRadius: '10px',
                border: '1px solid #E8E8E8',
                minWidth: 140,
              }}
            >
              <Typography fontSize={12} color="#8C8C8C" fontWeight={500} mb={0.5}>
                {card.label}
              </Typography>
              <Typography fontSize={24} fontWeight={700} color={card.color}>
                {card.value}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          size="small"
          label="Buscar por nome"
          value={filterNome}
          onChange={(e) => setFilterNome(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: '#BFBFBF', mr: 0.5, fontSize: 20 }} /> }}
          sx={filterSx}
        />
        <TextField
          size="small"
          label="Buscar por e-mail"
          value={filterEmail}
          onChange={(e) => setFilterEmail(e.target.value)}
          InputProps={{ startAdornment: <SearchIcon sx={{ color: '#BFBFBF', mr: 0.5, fontSize: 20 }} /> }}
          sx={filterSx}
        />
        <TextField
          size="small"
          select
          label="Departamento"
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          sx={{ ...filterSx, minWidth: 180 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {departamentos.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.nome}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E8E8E8' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ bgcolor: '#FAFAFA', borderBottom: '1px solid #E8E8E8' }}>
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  sx={{ '&.Mui-checked, &.MuiCheckbox-indeterminate': { color: '#2DB564' } }}
                />
              </TableCell>
              {[
                { id: 'titulo' as OrderBy, label: 'Nome' },
                { id: 'email' as OrderBy, label: 'Email' },
                { id: 'departamentoId' as OrderBy, label: 'Departamento' },
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
                    sx={{ '& .MuiTableSortLabel-icon': { fontSize: 16 } }}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell
                sx={{
                  fontWeight: 600,
                  color: '#8C8C8C',
                  fontSize: 13,
                  borderBottom: '1px solid #E8E8E8',
                  bgcolor: '#FAFAFA',
                  py: 1.5,
                  width: 100,
                }}
              >
                Acoes
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={32} sx={{ color: '#2DB564' }} />
                </TableCell>
              </TableRow>
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#8C8C8C' }}>
                  {colaboradores.length === 0
                    ? 'Nenhum colaborador cadastrado'
                    : 'Nenhum colaborador encontrado com os filtros aplicados'}
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((colaborador) => (
                <TableRow
                  key={colaborador.id}
                  hover
                  selected={selected.has(colaborador.id!)}
                  sx={{
                    '&:hover': { bgcolor: '#FAFAFA' },
                    '& td': { borderBottom: '1px solid #F0F0F0', py: 1.5 },
                    '&.Mui-selected': { bgcolor: '#F0FAF4' },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.has(colaborador.id!)}
                      onChange={() => handleSelectOne(colaborador.id!)}
                      sx={{ '&.Mui-checked': { color: '#2DB564' } }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: getAvatarColor(colaborador.titulo),
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {getInitials(colaborador.titulo)}
                      </Avatar>
                      <Typography fontSize={14} fontWeight={500} color="#1A1A1A">
                        {colaborador.titulo}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#595959">
                      {colaborador.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize={14} color="#595959">
                      {getDeptName(colaborador.departamentoId)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={colaborador.ativoAoCriar ? 'Ativo' : 'Inativo'}
                      size="small"
                      sx={{
                        bgcolor: colaborador.ativoAoCriar ? '#E6F9EE' : '#FDE8E8',
                        color: colaborador.ativoAoCriar ? '#2DB564' : '#E53535',
                        fontWeight: 600,
                        fontSize: 12,
                        borderRadius: '6px',
                        height: 26,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Editar">
                      <IconButton size="small" onClick={() => navigate(`/colaboradores/${colaborador.id}/editar`)}>
                        <EditOutlinedIcon sx={{ fontSize: 18, color: '#8C8C8C' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Excluir">
                      <IconButton size="small" onClick={() => handleDeleteClick(colaborador.id!)}>
                        <DeleteOutlineIcon sx={{ fontSize: 18, color: '#E53535' }} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir colaborador</DialogTitle>
        <DialogContent>
          <Typography fontSize={14} color="#595959">
            Tem certeza que deseja excluir este colaborador? Esta acao nao pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: 'none', color: '#8C8C8C', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            sx={{
              bgcolor: '#E53535',
              '&:hover': { bgcolor: '#C62828' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir colaboradores</DialogTitle>
        <DialogContent>
          <Typography fontSize={14} color="#595959">
            Tem certeza que deseja excluir {selected.size} colaborador(es) selecionado(s)? Esta acao nao pode ser desfeita.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setBulkDeleteOpen(false)} sx={{ textTransform: 'none', color: '#8C8C8C', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleBulkDelete}
            sx={{
              bgcolor: '#E53535',
              '&:hover': { bgcolor: '#C62828' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
            }}
          >
            Excluir {selected.size}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          sx={{ borderRadius: '8px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
