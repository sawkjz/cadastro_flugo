import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import { useNavigate, useLocation } from 'react-router-dom'
import logoFlugo from '../../prints/logo_flugo.png'

const SIDEBAR_WIDTH = 240

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const isColabActive = location.pathname === '/' || location.pathname.startsWith('/colaboradores')
  const isDeptActive = location.pathname.startsWith('/departamentos')

  const navItemSx = {
    borderRadius: '8px',
    mb: 0.5,
    '&.Mui-selected': {
      bgcolor: '#F0FAF4',
      '&:hover': { bgcolor: '#E5F5EC' },
    },
  }

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
      <Box
        sx={{
          pl: '20px',
          pr: '20px',
          pt: '20px',
          pb: 0,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          component="img"
          src={logoFlugo}
          alt="Flugo"
          sx={{
            width: 120,
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain',
          }}
        />
      </Box>

      <List sx={{ px: 1.5, mt: 1 }}>
        <ListItemButton onClick={() => navigate('/')} selected={isColabActive} sx={navItemSx}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <PeopleAltOutlinedIcon sx={{ color: isColabActive ? '#2DB564' : '#8C8C8C', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Colaboradores"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isColabActive ? 600 : 400,
              color: isColabActive ? '#1A1A1A' : '#8C8C8C',
            }}
          />
        </ListItemButton>

        <ListItemButton onClick={() => navigate('/departamentos')} selected={isDeptActive} sx={navItemSx}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <BusinessOutlinedIcon sx={{ color: isDeptActive ? '#2DB564' : '#8C8C8C', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="Departamentos"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: isDeptActive ? 600 : 400,
              color: isDeptActive ? '#1A1A1A' : '#8C8C8C',
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  )
}

export { SIDEBAR_WIDTH }
