import { Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.primaryPalette.lighterColor,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  boxShadow: 'none',
  color: theme.palette.text.secondary,
}));
