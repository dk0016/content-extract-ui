import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import ExtractedContentCard from "./components/ExtractedContentCard";
import ContentPlaceholder from "./components/ContentPlaceHolder";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import ExtractedTable from "./components/ExtractedTable";

export default function App() {
  const [url, setUrl] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<any>([]);
  const [extracted, setExtracted] = React.useState<{
    url: string;
    summary: string;
    points: string[];
    date: string;
  }>({
    url: "",
    summary: "",
    points: [],
    date: "",
  });

  const [isValidUrl, setIsValidUrl] = useState(false);

  // URL validation function using regular expression
  const validateUrl = (valUrl: string) => {
    const urlRegex =
      /^https:\/\/([\w\d-]+\.)+[a-z]{2,6}(\/[\w\d-_.~:/?#[\]@!$&'()*+,;=]*)?$/i;
    return urlRegex.test(valUrl);
  };

  // Check if URL is valid whenever the url changes
  useEffect(() => {
    setIsValidUrl(validateUrl(url));
  }, [url]);

  const ResetAll = () => {
    setExtracted({
      url: "",
      summary: "",
      points: [],
      date: "",
    });
    setData([]);
    setUrl("");
  };

  const handleExtract = async () => {
    setLoading(true);
    await axios
      .post("https://content-extract-be.vercel.app/api/extract", { url })
      // .post("http://localhost:9000/api/extract", { url })
      .then((response) => {
        const { extractedAt, keyPoints, summary, url: resUrl } = response.data;
        setExtracted({
          url: resUrl,
          summary,
          points: keyPoints,
          date: moment(extractedAt).format("DD-MM-YYYY h:mm A"),
        });
        setData((prevData: any) => [
          ...prevData,
          {
            url: resUrl,
            summary,
            date: moment(extractedAt).format("DD-MM-YYYY h:mm A"),
            points: keyPoints,
          },
        ]);

        toast.success("Content extracted successfully!");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(
          "Failed to extract content. Please try again or check the URL."
        );
      });
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Header />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
        <TextField
          fullWidth
          label="Paste article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          variant="outlined"
          disabled={loading}
          placeholder="https://example.com/article"
        />
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            style={{
              cursor: isValidUrl ? "pointer" : "not-allowed",
              backgroundColor: isValidUrl ? "#1976d2" : "#ccc",
              width: "100px",
              height: loading ? "30px" : "100%",
            }}
            variant="contained"
            onClick={handleExtract}
            disabled={!isValidUrl || loading}
            loading={loading}
            loadingPosition="center"
          >
            {!loading ? "Extract" : ""}
          </Button>
          <Button
            style={{
              cursor: url ? "pointer" : "not-allowed",
              backgroundColor: url ? "#1976d2" : "#ccc",
              width: "100px",
              height: loading ? "30px" : "100%",
              marginLeft: "10px",
            }}
            variant="contained"
            disabled={!url || loading}
            onClick={ResetAll}
          >
            {"RESET"}
          </Button>
        </Typography>
      </Stack>
      {data.length > 0 && (
        <ExtractedTable data={data} setExtracted={setExtracted} />
      )}

      {extracted.url ? (
        <ExtractedContentCard extracted={extracted} />
      ) : (
        <ContentPlaceholder />
      )}
    </Container>
  );
}
