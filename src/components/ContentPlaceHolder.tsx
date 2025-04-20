import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

export default function ContentPlaceholder() {
  return (
    <Paper
      elevation={2}
      sx={{
        textAlign: "center",
        p: { xs: 3, sm: 4 },
        color: "text.secondary",
        borderRadius: 3,
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
      }}
    >
      <Box display="flex" justifyContent="center" mb={2}>
        <ArticleIcon sx={{ fontSize: 50, color: "primary.light" }} />
      </Box>
      <Typography
        variant="h6"
        fontWeight={500}
        fontSize={{ xs: "1.1rem", sm: "1.25rem" }}
      >
        Nothing here yet
      </Typography>
      <Typography variant="body2" fontSize={{ xs: "0.85rem", sm: "0.95rem" }}>
        Paste a URL above and click extract to get started
      </Typography>
    </Paper>
  );
}
