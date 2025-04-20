import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function ExtractedTable({ data }: { data: any[] }) {
  const [search, setSearch] = useState("");

  const columns = [
    { field: "url", headerName: "URL", flex: 1 },
    { field: "summary", headerName: "Summary", flex: 1 },
    // { field: "date", headerName: "Date", width: 180 },
  ];

  const rows = data
    .filter(
      (item, idx) =>
        item.url.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase())
    )
    .map((item, index) => ({ id: index, ...item }));

  return (
    <Box sx={{ mt: 4 }}>
      <TextField
        fullWidth
        label="Search extracted content..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="outlined"
        sx={{ mb: 2 }}
      />
      <DataGrid
        rows={rows}
        columns={columns}
        sx={{
          marginBottom: 2,
          borderRadius: 2,
          boxShadow: 1,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
}
