import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  LinearProgress,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'

import BasicInfoStep from '../components/steps/BasicInfoStep'
import ProfessionalStep from '../components/steps/ProfessionalStep'

import {
  basicInfoSchema,
  professionalInfoSchema,
  type BasicInfoSchema,
  type ProfessionalInfoSchema,
} from '../schemas/employeeSchema'

import { saveColaborador } from '../firebase/employeeService'


const STEPS = [
  { label: 'Infos Básicas' },
  { label: 'Infos Profissionais' },
]

export default function CadastroColaborador() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const basicMethods = useForm<BasicInfoSchema>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: { titulo: '', email: '', ativoAoCriar: true },
    mode: 'onBlur',
  })

  const professionalMethods = useForm<ProfessionalInfoSchema>({
    resolver: zodResolver(professionalInfoSchema),
    defaultValues: { departamento: '' },
    mode: 'onBlur',
  })

  const progress = activeStep === 0 ? 0 : 50

  async function handleNext() {
    const valid = await basicMethods.trigger()
    if (!valid) return
    setActiveStep(1)
  }

  async function handleSubmit() {
    const valid = await professionalMethods.trigger()
    if (!valid) return

    setSubmitting(true)
    setError(null)

    try {
      const basicData = basicMethods.getValues()
      const profData = professionalMethods.getValues()

      await saveColaborador({
        titulo: basicData.titulo,
        email: basicData.email,
        ativoAoCriar: basicData.ativoAoCriar,
        departamento: profData.departamento,
      })

      navigate('/')
    } catch {
      setError('Erro ao salvar. Verifique sua conexão e tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleBack() {
    if (activeStep === 0) {
      navigate('/')
    } else {
      setActiveStep(0)
    }
  }

  return (
    <Box>
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
        <Typography
          fontSize={13}
          color="#8C8C8C"
          sx={{ cursor: 'pointer', '&:hover': { color: '#595959' } }}
          onClick={() => navigate('/')}
        >
          Colaboradores
        </Typography>
        <Typography fontSize={13} color="#8C8C8C">
          •
        </Typography>
        <Typography fontSize={13} color="#595959" fontWeight={500}>
          Cadastrar Colaborador
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box display="flex" alignItems="center" gap={1.5} mb={4}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            bgcolor: '#E8F5E9',
            '& .MuiLinearProgress-bar': {
              borderRadius: 3,
              bgcolor: '#2DB564',
            },
          }}
        />
        <Typography fontSize={13} color="#8C8C8C" fontWeight={500} minWidth={32}>
          {progress}%
        </Typography>
      </Box>

      {/* Content area: stepper left + form right */}
      <Box display="flex" gap={6}>
        {/* Vertical stepper */}
        <Box sx={{ minWidth: 180, pt: 0.5 }}>
          {STEPS.map((step, index) => {
            const isCompleted = index < activeStep
            const isActive = index === activeStep

            return (
              <Box key={step.label} display="flex" alignItems="flex-start" mb={index < STEPS.length - 1 ? 0 : 0}>
                <Box display="flex" flexDirection="column" alignItems="center" mr={1.5}>
                  {/* Circle */}
                  {isCompleted ? (
                    <CheckCircleIcon sx={{ color: '#2DB564', fontSize: 24 }} />
                  ) : (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: isActive ? '#2DB564' : '#E0E0E0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isActive ? '#fff' : '#8C8C8C',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </Box>
                  )}

                  {/* Connecting line */}
                  {index < STEPS.length - 1 && (
                    <Box
                      sx={{
                        width: 2,
                        height: 32,
                        bgcolor: isCompleted ? '#2DB564' : '#E0E0E0',
                        mt: 0.5,
                      }}
                    />
                  )}
                </Box>

                {/* Label */}
                <Typography
                  fontSize={14}
                  fontWeight={isActive ? 600 : 400}
                  color={isActive || isCompleted ? '#1A1A1A' : '#8C8C8C'}
                  pt={0.2}
                >
                  {step.label}
                </Typography>
              </Box>
            )
          })}
        </Box>

        {/* Form content */}
        <Box flex={1} maxWidth={600}>
          {activeStep === 0 && (
            <FormProvider {...basicMethods}>
              <BasicInfoStep />
            </FormProvider>
          )}
          {activeStep === 1 && (
            <FormProvider {...professionalMethods}>
              <ProfessionalStep />
            </FormProvider>
          )}
        </Box>
      </Box>

      {/* Navigation buttons */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={8}>
        <Typography
          fontSize={14}
          fontWeight={activeStep === 0 ? 400 : 600}
          color={activeStep === 0 ? '#BFBFBF' : '#1A1A1A'}
          sx={{
            cursor: activeStep === 0 ? 'default' : 'pointer',
            '&:hover': activeStep > 0 ? { textDecoration: 'underline' } : {},
          }}
          onClick={handleBack}
        >
          Voltar
        </Typography>

        <Button
          variant="contained"
          onClick={activeStep === 0 ? handleNext : handleSubmit}
          disabled={submitting}
          sx={{
            bgcolor: '#2DB564',
            '&:hover': { bgcolor: '#27A058' },
            borderRadius: '8px',
            px: 4,
            py: 1.2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: 14,
            boxShadow: 'none',
            minWidth: 120,
          }}
        >
          {submitting ? (
            <CircularProgress size={20} sx={{ color: '#fff' }} />
          ) : activeStep === 0 ? (
            'Próximo'
          ) : (
            'Concluir'
          )}
        </Button>
      </Box>

      {/* Error snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: '8px' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
