import { Typography, Box, useTheme } from "@mui/material";

export default function Header() {
  const theme = useTheme();

  return (
    <Box mb={4} textAlign="center">
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        fontSize={{ xs: "2rem", sm: "2.5rem" }}
        color={theme.palette.primary.main}
      >
        AI Content Extractor
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        fontSize={{ xs: "0.95rem", sm: "1rem" }}
      >
        Instantly extract summaries and key points from any article URL
      </Typography>
    </Box>
  );
}
