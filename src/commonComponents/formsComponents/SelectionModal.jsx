import React, { useState, useMemo } from 'react';
import {
  Modal,
  Paper,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  TextField
} from '@mui/material';
import { Close, Search, InfoOutlined } from '@mui/icons-material';
import { grey } from '@mui/material/colors';

const SelectionModal = ({
  open,
  onClose,
  title,
  items,
  onSelect,
  loading,
  getText,
  getSecondaryText,
  emptyText,
  icon: Icon,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    return items.filter(item =>
      getText(item).toLowerCase().includes(lower) ||
      (getSecondaryText?.(item)?.toLowerCase().includes(lower) ?? false)
    );
  }, [items, searchTerm, getText, getSecondaryText]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableEnforceFocus
      sx={{
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper
        sx={{
          width: '500px',
          maxHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          p: 3
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {Icon && <Icon color="primary" />}
            <Typography variant="h6" color="primary">{title}</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Search bar */}
        <TextField
          fullWidth
          placeholder="Buscar..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: grey[500] }} />
          }}
        />

        {/* Main content */}
        <Box sx={{ flex: 1, overflow: 'auto', minHeight: '300px' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress size={24} />
            </Box>
          ) : filteredItems.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body2" color="textSecondary">
                {emptyText}
              </Typography>
            </Box>
          ) : (
            <List dense>
              {filteredItems.map((item) => (
                <ListItem
                  key={item._id}
                  button
                  onClick={() => onSelect(item)}
                  secondaryAction={
                    onViewDetails && item._id !== 'null' && (
                      <IconButton
                        edge="end"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(item);
                        }}
                        sx={{
                          color: (theme) => theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)'
                          }
                        }}
                      >
                        <InfoOutlined fontSize="small" />
                      </IconButton>
                    )
                  }
                  sx={{
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.action.hover
                    }
                  }}
                >
                  <ListItemText
                    primary={<Typography fontWeight="medium">{getText(item)}</Typography>}
                    secondary={
                      getSecondaryText?.(item) && (
                        <Typography variant="body2" color="text.secondary">
                          {getSecondaryText(item)}
                        </Typography>
                      )
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default SelectionModal;
