import React from "react"
import App from "./App"
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
})

export default function Providers() {
  return (
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  )
}
