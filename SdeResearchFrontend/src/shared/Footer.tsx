import { Paper, Container, Box, Typography, useTheme } from "@mui/material";

export default function Footer() {
  const theme = useTheme();
  return (
    <Paper sx={{
      backgroundColor: theme.palette.primaryPalette.darkColor,
      color: "white",
      width: '100%',
      relative: 'absolute',
      left: 0,
      bottom: 0,
      right: 0,
    }} component="footer" square >
      <Container maxWidth="lg">
        <Box
          sx={{
            flexGrow: 1,
            justifyContent: "center",
            display: "flex",
            py: 6,
          }}
        >
          <Typography variant="caption" color="initial" sx={{color: 'white'}}>
            Copyright © 2023 SDE Research. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
}
