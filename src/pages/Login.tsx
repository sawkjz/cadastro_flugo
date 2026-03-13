import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logoFlugo from '../../prints/logo_flugo.png'

export default function Login() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      navigate('/')
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setError('E-mail ou senha invalidos.')
      } else if (code === 'auth/email-already-in-use') {
        setError('E-mail ja cadastrado.')
      } else if (code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.')
      } else {
        setError('Erro ao autenticar. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#FAFAFA">
      <Paper
        elevation={0}
        sx={{
          p: 5,
          borderRadius: '16px',
          border: '1px solid #E8E8E8',
          width: 420,
          maxWidth: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: '-9px',
          }}
        >
          <Box
            component="img"
            src={logoFlugo}
            alt="Flugo"
            sx={{
              width: { xs: 140, sm: 180 },
              maxWidth: '80%',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={600} color="#1A1A1A" mb={1} textAlign="center">
          {isRegister ? 'Criar conta' : 'Entrar'}
        </Typography>
        <Typography fontSize={14} color="#8C8C8C" mb={3} textAlign="center">
          {isRegister
            ? 'Preencha os campos abaixo para criar sua conta'
            : 'Entre com suas credenciais para acessar o sistema'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2.5}>
            <TextField
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
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
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: '#2DB564',
                color: '#FFFFFF',
                '&:hover': { bgcolor: '#27A058' },
                borderRadius: '8px',
                py: 1.5,
                textTransform: 'none',
                fontWeight: 600,
                fontSize: 15,
                boxShadow: 'none',
              }}
            >
              {loading ? (
                <CircularProgress size={22} sx={{ color: '#fff' }} />
              ) : isRegister ? (
                'Criar conta'
              ) : (
                'Entrar'
              )}
            </Button>
          </Box>
        </form>

        <Typography fontSize={13} color="#8C8C8C" mt={3} textAlign="center">
          {isRegister ? 'Ja tem uma conta?' : 'Nao tem uma conta?'}{' '}
          <Typography
            component="span"
            fontSize={13}
            fontWeight={600}
            color="#2DB564"
            sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister ? 'Entrar' : 'Criar conta'}
          </Typography>
        </Typography>
      </Paper>
    </Box>
  )
}
