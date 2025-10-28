// ExpansionContainer.tsx
import React from 'react';
import Collapse from '@mui/material/Collapse';
import Box from '@mui/material/Box';

interface ExpansionContainerProps {
  open: boolean;
  children?: React.ReactNode;
}

const ExpansionContainer: React.FC<ExpansionContainerProps> = ({ open, children }) => {
  return (
    <Collapse in={open} timeout={300} unmountOnExit>
      <Box sx={{ backgroundColor: '#197c84', padding: 2 }}>
        {children}
      </Box>
    </Collapse>
  );
};

export default ExpansionContainer;
