import { Button, Container, Stack, TextField } from "@mui/material";
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

  const handleExtract = async () => {
    setLoading(true);
    await axios
      .post(
        "https://content-extract-7us0ht121-dks-projects-e80df377.vercel.app/api/extract",
        { url }
      )
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
        <Button
          style={{
            cursor: isValidUrl ? "pointer" : "not-allowed",
            backgroundColor: isValidUrl ? "#1976d2" : "#ccc",
          }}
          variant="contained"
          onClick={handleExtract}
          disabled={!isValidUrl || loading}
          loading={loading}
          loadingPosition="center"
        >
          {!loading ? "Extract" : ""}
        </Button>
      </Stack>
      {data.length > 0 && <ExtractedTable data={data} />}

      {extracted.url ? (
        <ExtractedContentCard
          url={extracted.url}
          summary={extracted.summary}
          points={extracted.points}
          date={extracted.date}
        />
      ) : (
        <ContentPlaceholder />
      )}
    </Container>
  );
}
