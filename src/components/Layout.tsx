import { useState } from 'react'
import { Box, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar'
import { useAuth } from '../contexts/AuthContext'

export default function Layout() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  async function handleLogout() {
    setAnchorEl(null)
    await logout()
    navigate('/login')
  }

  const initial = user?.email?.charAt(0).toUpperCase() || 'U'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Sidebar />

      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            px: 4,
            py: 1.5,
            borderBottom: '1px solid #F0F0F0',
            bgcolor: '#fff',
          }}
        >
          <Avatar
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#2DB564',
              fontSize: 16,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {initial}
          </Avatar>
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { borderRadius: '8px', mt: 1, minWidth: 160 } }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#E53535' }} />
              </ListItemIcon>
              <ListItemText
                primary="Sair"
                primaryTypographyProps={{ fontSize: 14, color: '#E53535', fontWeight: 500 }}
              />
            </MenuItem>
          </Menu>
        </Box>

        <Box sx={{ flex: 1, p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
