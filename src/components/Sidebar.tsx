import { Box, Typography, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import { useNavigate, useLocation } from 'react-router-dom'

const SIDEBAR_WIDTH = 240

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname.startsWith('/colaboradores') || location.pathname === '/'

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        minHeight: '100vh',
        borderRight: '1px solid #E8E8E8',
        bgcolor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '6px',
            background: 'linear-gradient(135deg, #2DB564 0%, #28A45C 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          F
        </Box>
        <Typography variant="h6" fontWeight={700} fontSize={18} color="#1A1A1A">
          Flugo
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ px: 1.5, mt: 1 }}>
        <ListItemButton
          onClick={() => navigate('/')}
          selected={isActive}
          sx={{
            borderRadius: '8px',
            mb: 0.5,
            '&.Mui-selected': {
              bgcolor: '#F0FAF4',
              '&:hover': { bgcolor: '#E5F5EC' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <PeopleAltOutlinedIcon sx={{ color: isActive ? '#2DB564' : '#8C8C8C', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Colaboradores"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              color: isActive ? '#1A1A1A' : '#8C8C8C',
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  )
}

export { SIDEBAR_WIDTH }
