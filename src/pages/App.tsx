import React, { useState, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
import ColorizeIcon from "@material-ui/icons/Colorize"
import PaletteIcon from "@material-ui/icons/Palette"
import { IconButton, Snackbar, Link, Tooltip } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { Save, Edit, PowerSettingsNew } from "@material-ui/icons"
import { SwatchesPicker, ChromePicker, ColorResult } from "react-color"

interface State {
  defaultColor: ColorResult
  backgroundColor: ColorResult
  recentColors: ColorResult[]
  usePalette: boolean
}

const messages = [
  "Free lighting what's up",
  "Adjust the background color of this page and use your screen as a soft light source for your face",
  "This really brings our your eyes!",
  "Choose a background color that makes you look good for video calls",
  "Pick a background color to use as additional lighting from your monitor, or monitors 😎 ",
  "soft light, for everyone",
  "soft light, it's lit (travis scott reverb)",
  "Look how beautiful you are!",
  "Looking good",
  `"When will my reflection show, who I am, inside."`,
  "Free video conferencing lighting",
]

const STORAGE_KEY = "soft-light-data"

const initialState: State = {
  defaultColor: {
    hex: "#000000",
    hsl: { h: 0, s: 0, l: 0, a: 0 },
    rgb: { r: 0, g: 0, b: 0, a: 0 },
  },
  backgroundColor: {
    hex: "#000000",
    hsl: { h: 0, s: 0, l: 0, a: 0 },
    rgb: { r: 0, g: 0, b: 0, a: 0 },
  },
  recentColors: [],
  usePalette: false,
}

export default function App() {
  const storage = localStorage.getItem(STORAGE_KEY)
  const [showPicker, setShowPicker] = useState(false)
  const [lightsOut, setLightsOut] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [hexWithAlpha, setHexWithAlpha] = useState("")
  const [showNotification, setShowNotification] = useState(false)
  const [state, setState] = useState<State>(
    (storage && JSON.parse(storage)) || initialState
  )

  useEffect(() => {
    saveLocalStorage()
  }, [state])

  useEffect(() => {
    const alpha = state.backgroundColor?.rgb.a || 1
    const hex = state.backgroundColor?.hex || "#000000"
    setHexWithAlpha(formatColor(hex, alpha))
  }, [state.backgroundColor])

  useEffect(() => {
    const alpha = state.defaultColor?.rgb.a || 1
    const hex = state.defaultColor?.hex || "#000000"
    setState(state => ({ ...state, backgroundColor: state.defaultColor }))
    setHexWithAlpha(formatColor(hex, alpha))
  }, [])

  useEffect(() => {
    const off: ColorResult = {
      hex: "#000000",
      hsl: { h: 0, s: 0, l: 0, a: 1 },
      rgb: { r: 0, g: 0, b: 0, a: 1 },
    }

    const color = lightsOut ? off : state.defaultColor

    setState(state => ({
      ...state,
      backgroundColor: color,
    }))
  }, [lightsOut])

  const formatColor = (hex = "#000000", alpha = 1): string => {
    const brightness = Math.round(alpha * 255).toString(16)
    return `${hex}${brightness}` || "black"
  }

  const getRandomNumber = (min = 0, max = messages.length - 1): number => {
    const randomNumber = Math.random() * (max - min + 1) + min
    return Math.floor(randomNumber)
  }

  const handleColorChange = (color: ColorResult): void => {
    setState(state => ({ ...state, backgroundColor: color }))
  }

  const handleEdit = (): void => {
    setShowPicker(!showPicker)

    // Reset to the default color if the user did not save?????
    // setState(state => ({ ...state, backgroundColor: state.defaultColor }))
  }

  const togglePalette = (usePalette: boolean): void => {
    setMessageIndex(getRandomNumber())
    setState(state => ({ ...state, usePalette: usePalette }))
    setShowPicker(true)
  }

  const saveDefault = (): void => {
    setState({ ...state, defaultColor: state.backgroundColor })
    setShowPicker(false)
    setShowNotification(true)
  }

  const saveLocalStorage = (): void => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
        recentColors: [
          formatColor(state.backgroundColor.hex, state.backgroundColor.rgb.a),
          ...state.recentColors.slice(0, 4),
        ],
      })
    )
  }

  const handleNotificationClose = (event, reason = ""): void => {
    if (reason === "clickaway") {
      return
    }

    setShowNotification(false)
  }

  const handleLightsOut = (): void => {
    setLightsOut(!lightsOut)
  }

  const swatchStyles = {
    default: {
      overflow: {
        backgroundColor: "var(--dark)",
      },
    },
  }

  return (
    <div
      className="font-sans grid gap-4 grid-rows-layout base"
      style={{ background: hexWithAlpha }}
    >
      <div className="pt-4 inline-grid grid-cols-appbar gap-x-4">
        <Link href="/" tabIndex={1}>
          <h1 className="pl-4 text-lg text-shadow" aria-label="soft light">
            soft light
          </h1>
        </Link>
        <Tooltip title="Lights Out">
          <Fab
            style={{ background: "var(--light)" }}
            aria-label="Lights Out"
            size="small"
            onClick={handleLightsOut}
          >
            <PowerSettingsNew style={{ color: hexWithAlpha }} />
          </Fab>
        </Tooltip>
        <div className="pr-4">
          <Tooltip title="Edit">
            <Fab
              style={{ background: "var(--light)" }}
              aria-label="Edit"
              size="small"
              onClick={handleEdit}
            >
              <Edit style={{ color: hexWithAlpha }} />
            </Fab>
          </Tooltip>
        </div>
      </div>
      <div className="p-4 max-w-lg place-self-center align-middle">
        <h2
          tabIndex={2}
          aria-label="description of soft light"
          className="text-3xl text-center"
        >
          {messages[messageIndex]}
        </h2>
      </div>
      {state.usePalette ? (
        <SwatchesPicker
          className="place-self-center"
          styles={swatchStyles}
          color={state.backgroundColor.rgb}
          onChange={handleColorChange}
          onChangeComplete={handleColorChange}
        />
      ) : (
        <ChromePicker
          className="place-self-center"
          color={state.backgroundColor.rgb}
          onChange={handleColorChange}
          onChangeComplete={handleColorChange}
        />
      )}
      <div className="inline-grid px-8 inline-grid grid-cols-toolbar gap-x-4 toolbar">
        <Tooltip title="Color Picker">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Color Picker"
            onClick={() => togglePalette(false)}
          >
            <ColorizeIcon className="icon" />
          </IconButton>
        </Tooltip>
        <div className="place-self-center fab">
          <Tooltip title="Save">
            <Fab
              style={{ background: "var(--light)" }}
              aria-label="Save"
              onClick={saveDefault}
            >
              <Save style={{ color: hexWithAlpha }} />
            </Fab>
          </Tooltip>
        </div>
        <Tooltip title="Color Palette">
          <IconButton
            edge="end"
            aria-label="Color Palette"
            color="inherit"
            onClick={() => togglePalette(true)}
          >
            <PaletteIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      <Snackbar
        className="mt-12"
        open={showNotification}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleNotificationClose}
      >
        <Alert
          className="alert"
          onClose={handleNotificationClose}
          severity="success"
        >
          {`Saved default soft light as ${hexWithAlpha} 👍`}
        </Alert>
      </Snackbar>
    </div>
  )
}
