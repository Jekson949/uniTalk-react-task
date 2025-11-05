import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: [
      "Inter",
      "system-ui",
      "Segoe UI",
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
  },
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#7a4cff" },
  },
  shape: { borderRadius: 12 },
});
