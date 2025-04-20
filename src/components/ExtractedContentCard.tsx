import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import BoltIcon from "@mui/icons-material/Bolt";
import InsightsIcon from "@mui/icons-material/Insights";

interface Props {
  url: string;
  summary: string;
  points: string[];
  date: string;
}
export default function ExtractedContentCard({
  url,
  summary,
  points,
  date,
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 3,
        boxShadow: 2,
        background: "linear-gradient(135deg, #ffffff, #f3f4f6)",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1} mb={1} alignItems="center">
          <LanguageIcon fontSize="small" color="primary" />
          <Link href={url} target="_blank" rel="noopener" underline="hover">
            <Typography variant="subtitle2" color="text.secondary">
              {url}
            </Typography>
          </Link>
        </Stack>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          <Chip
            icon={<BoltIcon />}
            label="AI-generated"
            size="small"
            color="primary"
          />
          <Chip
            icon={<InsightsIcon />}
            label="Summary"
            size="small"
            variant="outlined"
          />
        </Stack>

        <Typography
          variant="h6"
          gutterBottom
          fontSize={{ xs: "1rem", sm: "1.25rem" }}
          fontWeight={600}
        >
          Summary
        </Typography>
        <Typography
          variant="body1"
          paragraph
          fontSize={{ xs: "0.95rem", sm: "1rem" }}
        >
          {summary}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography
          variant="h6"
          fontSize={{ xs: "1rem", sm: "1.25rem" }}
          fontWeight={600}
          gutterBottom
        >
          Key Points
        </Typography>
        <List dense>
          {points.map((point, index) => (
            <ListItem key={index} disablePadding>
              <ListItemText primary={`• ${point}`} />
            </ListItem>
          ))}
        </List>

        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={2}
        >
          Extracted on {date}
        </Typography>
      </CardContent>
    </Card>
  );
}
