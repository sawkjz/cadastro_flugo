import { Box, Avatar } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar, { SIDEBAR_WIDTH } from './Sidebar'

export default function Layout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#FAFAFA' }}>
      <Sidebar />

      {/* Main area */}
      <Box
        sx={{
          ml: `${SIDEBAR_WIDTH}px`,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Top bar */}
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
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#E0E0E0',
              fontSize: 16,
              cursor: 'pointer',
            }}
          >
            U
          </Avatar>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, p: 4 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
