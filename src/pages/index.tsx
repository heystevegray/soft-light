import React, { useState, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
import ColorizeIcon from "@material-ui/icons/Colorize"
import PaletteIcon from "@material-ui/icons/Palette"
import { makeStyles } from "@material-ui/core/styles"
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core"
import { Save, Edit } from "@material-ui/icons"
import { SwatchesPicker, ChromePicker, ColorResult } from "react-color"
import "../assets/sass/index.scss"

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

export default function Home() {
  const storage = localStorage.getItem(STORAGE_KEY)
  const [showPicker, setShowPicker] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [hexWithAlpha, setHexWithAlpha] = useState("")
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

  const useStyles = makeStyles(theme => ({
    text: {
      fontSize: "1.25em",
      color: "var(--light)",
      textShadow: "var(--textShadow)",
    },
    appBar: {
      backgroundColor: "var(--dark)",
    },
    header: {
      backgroundColor: "transparent",
      boxShadow: "none",
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: "absolute",
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: "0 auto",
    },
    colorFab: {
      background: "var(--light)",
      color: state.backgroundColor.hex,
    },
  }))

  const classes = useStyles()

  const swatchStyles = {
    default: {
      overflow: {
        backgroundColor: "var(--dark)",
      },
    },
  }

  return (
    <div className="page" style={{ background: hexWithAlpha }}>
      <div className="container">
        <div className="header">
          <AppBar className={classes.header}>
            <Toolbar>
              <Typography
                tabIndex={1}
                aria-label="soft light"
                className={classes.text}
                variant="h1"
                gutterBottom
              >
                soft light
              </Typography>
              <div className={classes.grow} />
              <Fab
                aria-label="Edit"
                size="small"
                className={classes.colorFab}
                onClick={handleEdit}
              >
                <Edit />
              </Fab>
            </Toolbar>
          </AppBar>
        </div>
        {showPicker && (
          <>
            <div className="description">
              <div className="description__container">
                <Typography
                  tabIndex={2}
                  aria-label="description of soft light"
                  className={classes.text}
                  variant="body1"
                  gutterBottom
                >
                  {messages[messageIndex]}
                </Typography>
              </div>
            </div>
            <div className="body">
              <div className="pickers">
                {!state.usePalette && (
                  <ChromePicker
                    className="picker"
                    color={state.backgroundColor.rgb}
                    onChange={handleColorChange}
                    onChangeComplete={handleColorChange}
                  />
                )}
                {state.usePalette && (
                  <SwatchesPicker
                    className="picker"
                    styles={swatchStyles}
                    color={state.backgroundColor.rgb}
                    onChange={handleColorChange}
                    onChangeComplete={handleColorChange}
                  />
                )}
              </div>
            </div>
          </>
        )}
        <div className="footer">
          <AppBar
            position="relative"
            color="primary"
            className={classes.appBar}
          >
            <Toolbar>
              <IconButton
                className="icon"
                edge="start"
                color="inherit"
                aria-label="Colorize"
                onClick={() => togglePalette(false)}
              >
                <ColorizeIcon />
              </IconButton>
              <Fab
                aria-label="Save"
                className={`${classes.fabButton} ${classes.colorFab}`}
                onClick={saveDefault}
              >
                <Save />
              </Fab>
              <div className={classes.grow} />
              <IconButton
                className="icon"
                edge="end"
                aria-label="Palette"
                color="inherit"
                onClick={() => togglePalette(true)}
              >
                <PaletteIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
        </div>
      </div>
    </div>
  )
}
