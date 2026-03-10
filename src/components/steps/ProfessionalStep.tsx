import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material'
import type { ProfessionalInfoSchema } from '../../schemas/employeeSchema'

const DEPARTAMENTOS = [
  'Design',
  'TI',
  'Marketing',
  'Produto',
  'Recursos Humanos',
  'Financeiro',
  'Comercial',
  'Operações',
  'Jurídico',
  'Administrativo',
  'Suporte',
]

export default function ProfessionalInfoStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProfessionalInfoSchema>()

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        color="#2DB564"
        mb={4}
        fontSize={22}
      >
        Informações Profissionais
      </Typography>

      <Controller
        name="departamento"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            select
            label="Departamento"
            InputLabelProps={{ shrink: true }}
            fullWidth
            error={!!errors.departamento}
            helperText={errors.departamento?.message}
            SelectProps={{
              displayEmpty: true,
              renderValue: (value) => {
                if (!value) {
                  return (
                    <Typography color="#BFBFBF" fontSize={14}>
                      Selecione um departamento
                    </Typography>
                  )
                }
                return value as string
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
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#2DB564',
              },
            }}
          >
            {DEPARTAMENTOS.map((dep) => (
              <MenuItem key={dep} value={dep}>
                {dep}
              </MenuItem>
            ))}
          </TextField>
        )}
      />
    </Box>
  )
}
