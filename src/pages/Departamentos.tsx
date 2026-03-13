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
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Autocomplete,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Alert,
  Snackbar,
  Divider,
  Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  getDepartamentos,
  saveDepartamento,
  updateDepartamento,
  deleteDepartamento,
} from '../firebase/departmentService'
import { getColaboradores, updateColaborador } from '../firebase/employeeService'
import type { Departamento } from '../types/department'
import type { Colaborador } from '../types/employee'

const AVATAR_COLORS = ['#F48FB1', '#CE93D8', '#90CAF9', '#80CBC4', '#FFCC80', '#A5D6A7']

function getAvatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formNome, setFormNome] = useState('')
  const [formGestorId, setFormGestorId] = useState('')
  const [employeesToAdd, setEmployeesToAdd] = useState<Colaborador[]>([])
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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
      const [deps, collabs] = await Promise.all([getDepartamentos(), getColaboradores()])
      setDepartamentos(deps)
      setColaboradores(collabs)
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }

  const gestores = colaboradores.filter((item) => item.nivelHierarquico === 'gestor')

  function getCollabsForDept(deptId: string) {
    return colaboradores.filter((item) => item.departamentoId === deptId)
  }

  function getGestorNome(gestorId: string) {
    return colaboradores.find((item) => item.id === gestorId)?.titulo || '-'
  }

  function openCreateDialog() {
    setDialogMode('create')
    setEditingId(null)
    setFormNome('')
    setFormGestorId('')
    setEmployeesToAdd([])
    setFormError('')
    setDialogOpen(true)
  }

  function openEditDialog(dept: Departamento) {
    setDialogMode('edit')
    setEditingId(dept.id!)
    setFormNome(dept.nome)
    setFormGestorId(dept.gestorId || '')
    setEmployeesToAdd([])
    setFormError('')
    setDialogOpen(true)
  }

  async function handleSaveDialog() {
    if (!formNome.trim()) {
      setFormError('Nome do departamento e obrigatorio.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      if (dialogMode === 'create') {
        const newId = await saveDepartamento({ nome: formNome.trim(), gestorId: formGestorId })
        for (const item of employeesToAdd) {
          await updateColaborador(item.id!, { departamentoId: newId })
        }
        setSnackbar({ open: true, message: 'Departamento criado com sucesso!', severity: 'success' })
      } else if (editingId) {
        await updateDepartamento(editingId, { nome: formNome.trim(), gestorId: formGestorId })
        for (const item of employeesToAdd) {
          await updateColaborador(item.id!, { departamentoId: editingId })
        }
        setSnackbar({ open: true, message: 'Departamento atualizado com sucesso!', severity: 'success' })
      }
      setDialogOpen(false)
      await loadData()
    } catch {
      setFormError('Erro ao salvar departamento.')
    } finally {
      setSaving(false)
    }
  }

  function handleDeleteClick(id: string) {
    setDeletingId(id)
    setDeleteDialogOpen(true)
  }

  async function handleConfirmDelete() {
    if (!deletingId) return
    const collabs = getCollabsForDept(deletingId)
    if (collabs.length > 0) {
      setSnackbar({
        open: true,
        message: 'Nao e possivel excluir um departamento que possui colaboradores.',
        severity: 'error',
      })
      setDeleteDialogOpen(false)
      setDeletingId(null)
      return
    }
    try {
      await deleteDepartamento(deletingId)
      setSnackbar({ open: true, message: 'Departamento excluido com sucesso!', severity: 'success' })
      await loadData()
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir departamento.', severity: 'error' })
    } finally {
      setDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const availableEmployees =
    dialogMode === 'edit' && editingId
      ? colaboradores.filter((item) => item.departamentoId !== editingId && !employeesToAdd.find((current) => current.id === item.id))
      : colaboradores.filter((item) => !employeesToAdd.find((current) => current.id === item.id))

  const deptMap = Object.fromEntries(departamentos.map((item) => [item.id, item]))

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h5" fontWeight={700} color="#1A1A1A">
          Departamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreateDialog}
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
          Novo Departamento
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E8E8E8' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['Nome', 'Gestor', 'Colaboradores', 'Acoes'].map((item) => (
                <TableCell
                  key={item}
                  sx={{
                    fontWeight: 600,
                    color: '#8C8C8C',
                    fontSize: 13,
                    borderBottom: '1px solid #E8E8E8',
                    bgcolor: '#FAFAFA',
                    py: 1.5,
                  }}
                >
                  {item}
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
            ) : departamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#8C8C8C' }}>
                  Nenhum departamento cadastrado
                </TableCell>
              </TableRow>
            ) : (
              departamentos.map((departamento) => {
                const collabs = getCollabsForDept(departamento.id!)
                return (
                  <TableRow
                    key={departamento.id}
                    sx={{
                      '&:hover': { bgcolor: '#FAFAFA' },
                      '& td': { borderBottom: '1px solid #F0F0F0', py: 2 },
                    }}
                  >
                    <TableCell>
                      <Typography fontSize={14} fontWeight={500} color="#1A1A1A">
                        {departamento.nome}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={14} color="#595959">
                        {departamento.gestorId ? getGestorNome(departamento.gestorId) : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${collabs.length} colaborador${collabs.length !== 1 ? 'es' : ''}`}
                        size="small"
                        sx={{
                          bgcolor: '#F0FAF4',
                          color: '#2DB564',
                          fontWeight: 600,
                          fontSize: 12,
                          borderRadius: '6px',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => openEditDialog(departamento)}>
                          <EditOutlinedIcon sx={{ fontSize: 18, color: '#8C8C8C' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Excluir">
                        <IconButton size="small" onClick={() => handleDeleteClick(departamento.id!)}>
                          <DeleteOutlineIcon sx={{ fontSize: 18, color: '#E53535' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700, color: '#1A1A1A', pb: 1 }}>
          {dialogMode === 'create' ? 'Novo Departamento' : 'Editar Departamento'}
        </DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1, borderRadius: '8px' }}>
              {formError}
            </Alert>
          )}

          <Box display="flex" flexDirection="column" gap={2.5} mt={1}>
            <TextField
              label="Nome do departamento"
              value={formNome}
              onChange={(e) => setFormNome(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2DB564',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2DB564' },
              }}
            />

            <TextField
              select
              label="Gestor responsavel"
              value={formGestorId}
              onChange={(e) => setFormGestorId(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return <Typography color="#BFBFBF" fontSize={14}>Selecione um gestor (opcional)</Typography>
                  }
                  return getGestorNome(value as string)
                },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2DB564',
                    borderWidth: 2,
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': { color: '#2DB564' },
              }}
            >
              <MenuItem value="">
                <em>Nenhum</em>
              </MenuItem>
              {gestores.map((gestor) => (
                <MenuItem key={gestor.id} value={gestor.id}>
                  {gestor.titulo}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography fontWeight={600} fontSize={14} color="#1A1A1A" mb={2}>
            Colaboradores
          </Typography>

          {dialogMode === 'edit' && editingId && (
            <>
              {getCollabsForDept(editingId).length > 0 ? (
                <List dense sx={{ mb: 2 }}>
                  {getCollabsForDept(editingId).map((item) => (
                    <ListItem key={item.id} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: getAvatarColor(item.titulo),
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {getInitials(item.titulo)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.titulo}
                        secondary={item.email}
                        primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                        secondaryTypographyProps={{ fontSize: 12 }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography fontSize={13} color="#8C8C8C" mb={2}>
                  Nenhum colaborador neste departamento.
                </Typography>
              )}
            </>
          )}

          <Autocomplete
            multiple
            options={availableEmployees}
            getOptionLabel={(option) => {
              const dept = deptMap[option.departamentoId]
              return `${option.titulo}${dept ? ` (${dept.nome})` : ''}`
            }}
            value={employeesToAdd}
            onChange={(_, newValue) => setEmployeesToAdd(newValue)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Adicionar colaboradores"
                placeholder="Buscar colaborador..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2DB564',
                      borderWidth: 2,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#2DB564' },
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option.titulo}
                  {...getTagProps({ index })}
                  key={option.id}
                  size="small"
                  sx={{
                    bgcolor: '#E6F9EE',
                    color: '#2DB564',
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': { color: '#2DB564' },
                  }}
                />
              ))
            }
            noOptionsText="Nenhum colaborador disponivel"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ textTransform: 'none', color: '#8C8C8C', fontWeight: 600 }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveDialog}
            disabled={saving}
            sx={{
              bgcolor: '#2DB564',
              '&:hover': { bgcolor: '#27A058' },
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 'none',
            }}
          >
            {saving ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Excluir departamento</DialogTitle>
        <DialogContent>
          <Typography fontSize={14} color="#595959">
            Tem certeza que deseja excluir este departamento? Esta acao nao pode ser desfeita.
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
