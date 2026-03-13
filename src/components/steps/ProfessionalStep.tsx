import { Controller, useFormContext } from 'react-hook-form'
import { Box, TextField, Typography, MenuItem, InputAdornment } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import type { ProfessionalInfoSchema } from '../../schemas/employeeSchema'

const NIVEIS = [
  { value: 'junior', label: 'Junior' },
  { value: 'pleno', label: 'Pleno' },
  { value: 'senior', label: 'Senior' },
  { value: 'gestor', label: 'Gestor' },
]

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#2DB564',
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#2DB564' },
}

interface ProfessionalStepProps {
  departamentos: { id: string; nome: string }[]
  gestores: { id: string; titulo: string }[]
}

export default function ProfessionalInfoStep({ departamentos, gestores }: ProfessionalStepProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProfessionalInfoSchema>()

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="#2DB564" mb={4} fontSize={22}>
        Informacoes Profissionais
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <Controller
          name="departamentoId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Departamento"
              fullWidth
              error={!!errors.departamentoId}
              helperText={errors.departamentoId?.message}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return <Typography color="#BFBFBF" fontSize={14}>Selecione um departamento</Typography>
                  }
                  const dept = departamentos.find((item) => item.id === value)
                  return dept?.nome || (value as string)
                },
              }}
              sx={fieldSx}
            >
              {departamentos.length === 0 ? (
                <MenuItem disabled>Nenhum departamento cadastrado</MenuItem>
              ) : (
                departamentos.map((dep) => (
                  <MenuItem key={dep.id} value={dep.id}>
                    {dep.nome}
                  </MenuItem>
                ))
              )}
            </TextField>
          )}
        />

        <Controller
          name="cargo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Cargo"
              placeholder="Ex: Desenvolvedor Frontend"
              fullWidth
              error={!!errors.cargo}
              helperText={errors.cargo?.message}
              sx={fieldSx}
            />
          )}
        />

        <Controller
          name="dataAdmissao"
          control={control}
          render={({ field }) => (
            <DatePicker
              label="Data de admissao"
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dataAdmissao,
                  helperText: errors.dataAdmissao?.message,
                  sx: fieldSx,
                },
              }}
            />
          )}
        />

        <Controller
          name="nivelHierarquico"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Nivel hierarquico"
              fullWidth
              error={!!errors.nivelHierarquico}
              helperText={errors.nivelHierarquico?.message}
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return <Typography color="#BFBFBF" fontSize={14}>Selecione o nivel</Typography>
                  }
                  return NIVEIS.find((item) => item.value === value)?.label || (value as string)
                },
              }}
              sx={fieldSx}
            >
              {NIVEIS.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />

        <Controller
          name="gestorResponsavelId"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              select
              label="Gestor responsavel"
              fullWidth
              InputLabelProps={{ shrink: true }}
              SelectProps={{
                displayEmpty: true,
                renderValue: (value) => {
                  if (!value) {
                    return <Typography color="#BFBFBF" fontSize={14}>Selecione um gestor (opcional)</Typography>
                  }
                  return gestores.find((item) => item.id === value)?.titulo || (value as string)
                },
              }}
              sx={fieldSx}
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
          )}
        />

        <Controller
          name="salarioBase"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Salario base"
              type="number"
              fullWidth
              error={!!errors.salarioBase}
              helperText={errors.salarioBase?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
              sx={fieldSx}
            />
          )}
        />
      </Box>
    </Box>
  )
}
