import React, { useState } from "react";
import { Box, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function ExtractedTable({
  data,
  setExtracted,
}: {
  data: {
    url: string;
    summary: string;
    points: string[];
    date: string;
  }[];
  setExtracted: (src: {
    url: string;
    summary: string;
    points: string[];
    date: string;
  }) => void;
}) {
  const [search, setSearch] = useState("");

  const columns: GridColDef[] = [
    { field: "url", headerName: "URL", flex: 1 },
    { field: "summary", headerName: "Summary", flex: 1 },
  ];

  const filteredRows = data
    .filter(
      (item) =>
        item.url.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase())
    )
    .map((item, index) => ({
      id: `${item.url}-${index}`, // Ensure unique ID
      ...item,
    }));

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
        rows={filteredRows}
        columns={columns}
        onRowClick={(params) => {
          const clickedItem = filteredRows.find((row) => row.id === params.id);
          if (clickedItem) {
            setExtracted({
              url: clickedItem.url,
              summary: clickedItem.summary,
              points: clickedItem.points ?? [],
              date: clickedItem.date,
            });
          }
        }}
        sx={{
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
