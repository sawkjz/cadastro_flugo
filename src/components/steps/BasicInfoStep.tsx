import { Controller, useFormContext } from 'react-hook-form'
import {
  Box,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material'
import type { BasicInfoSchema } from '../../schemas/employeeSchema'

export default function BasicInfoStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BasicInfoSchema>()

  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
        color="#2DB564"
        mb={4}
        fontSize={22}
      >
        Informações Básicas
      </Typography>

      <Box display="flex" flexDirection="column" gap={3}>
        <Controller
          name="titulo"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="Título"
              placeholder="João da Silva"
              fullWidth
              error={!!errors.titulo}
              helperText={errors.titulo?.message}
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
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <TextField
              {...field}
              label="E-mail"
              placeholder="e.g. john@gmail.com"
              type="email"
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
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
            />
          )}
        />

        <Controller
          name="ativoAoCriar"
          control={control}
          defaultValue={true}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#2DB564',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#2DB564',
                    },
                  }}
                />
              }
              label={
                <Typography fontSize={14} color="#595959">
                  Ativar ao criar
                </Typography>
              }
            />
          )}
        />
      </Box>
    </Box>
  )
}
