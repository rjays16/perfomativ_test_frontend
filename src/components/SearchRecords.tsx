import React from 'react';
import { 
  Box, 
  TextField,
  InputAdornment 
} from '@mui/material';
import { Search } from '@mui/icons-material';

interface SearchRecordsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchRecords: React.FC<SearchRecordsProps> = ({ 
  searchQuery, 
  onSearchChange 
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <TextField
        fullWidth
        placeholder="Search records..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: 'text.secondary' }} />
            </InputAdornment>
          )
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.87)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />
    </Box>
  );
};

export default SearchRecords;