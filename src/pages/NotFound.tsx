import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#FAFAFA"
      gap={2}
    >
      <Typography variant="h1" fontWeight={800} color="#2DB564" fontSize={120}>
        404
      </Typography>
      <Typography variant="h5" fontWeight={600} color="#1A1A1A">
        Pagina nao encontrada
      </Typography>
      <Typography fontSize={14} color="#8C8C8C" mb={2}>
        A pagina que voce procura nao existe ou foi removida.
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate('/')}
        sx={{
          bgcolor: '#2DB564',
          '&:hover': { bgcolor: '#27A058' },
          borderRadius: '8px',
          px: 4,
          py: 1.2,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        }}
      >
        Voltar ao Inicio
      </Button>
    </Box>
  )
}
