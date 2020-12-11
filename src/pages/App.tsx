import React, { useState, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
import ColorizeIcon from "@material-ui/icons/Colorize"
import PaletteIcon from "@material-ui/icons/Palette"
import { IconButton, Snackbar, Link, Tooltip } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import {
  Save,
  Edit,
  PowerSettingsNew,
  OpenInNew,
  Videocam,
  VideocamOff,
  Fullscreen,
  FullscreenExit,
} from "@material-ui/icons"
import { ColorResult } from "react-color"
import parse from "html-react-parser"
import Picker from "../components/Picker/Picker"
import { State } from "../interfaces/State"
import adapter from "webrtc-adapter"

const messages = [
  "Free lighting what's up",
  "This one really brings out your eyes",
  'Change the background color of your screen, or screens 😎 <a target="_blank" href="/">open another tab</a>!',
  'Inspired by Julie Schiro\'s <a target="_blank" href="https://www.youtube.com/watch?v=jiUpK0dhWTE&t=421s&ab_channel=JulieSchiro">"secret monitor hack"</a>, go give it a watch. Thank you Julie!',
  "soft light, for everyone",
  "soft light, it's lit (travis scott reverb)",
  "Look how beautiful you are!",
  `"When will my reflection show, who I am, inside."`,
  "Free video conferencing lighting",
]

const STORAGE_KEY = "soft-light-data"

export const initialState: State = {
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
  usePalette: false,
  notification: { message: "", show: false },
}

const off: ColorResult = {
  hex: "#000000",
  hsl: { h: 0, s: 0, l: 0, a: 1 },
  rgb: { r: 0, g: 0, b: 0, a: 1 },
}

const constraints: MediaStreamConstraints = {
  audio: false,
  video: {
    facingMode: "user",
  },
}

export default function App() {
  const storage =
    typeof window !== "undefined" && window.localStorage.getItem(STORAGE_KEY)
  const storageState: State = (storage && JSON.parse(storage)) || initialState
  const [showPicker, setShowPicker] = useState(false)
  const [lightsOut, setLightsOut] = useState(false)
  const [messageIndex, setMessageIndex] = useState(0)
  const [hexWithAlpha, setHexWithAlpha] = useState("")
  const [showVideo, setShowVideo] = useState(false)
  const [videoSupported, setVideoSupported] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [state, setState] = useState<State>(storageState)
  const [oldColor, setOldColor] = useState<ColorResult>(
    storageState.backgroundColor
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
    let color = oldColor

    if (lightsOut) {
      setOldColor(state.backgroundColor)
      color = off
    }

    setState(state => ({ ...state, backgroundColor: color }))
  }, [lightsOut])

  useEffect(() => {
    const init = async (): Promise<void> => {
      const alpha = storageState.defaultColor?.rgb.a || 1
      const hex = storageState.defaultColor?.hex || "#000000"
      setHexWithAlpha(formatColor(hex, alpha))

      try {
        await navigator.mediaDevices.enumerateDevices().then(devices => {
          const cameras = devices.filter(d => d.kind === "videoinput")
          if (cameras && cameras.length > 0) {
            setVideoSupported(true)
          } else {
            setVideoSupported(false)
          }
        })
      } catch (error) {
        setVideoSupported(false)
      }
    }

    init()
  }, [])

  useEffect(() => {
    if (videoSupported) {
      const video: HTMLVideoElement = document.querySelector("video")

      if (showVideo) {
        startVideoStream(video)
        toggleNotification(true, `Camera enabled 📷`)
      } else {
        stopVideoStream(video)
      }
    }
  }, [showVideo])

  const toggleFullscreen = (isFullscreen: boolean): void => {
    setFullscreen(isFullscreen)
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        toggleNotification(true, "Fullscreen enabled 👌")
      })
    } else {
      setFullscreen(isFullscreen)
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          toggleNotification(true, "Fullscreen disabled 🤙 🤙")
        })
      }
    }
  }

  const toggleNotification = (show: boolean, message = "") => {
    setState(state => ({
      ...state,
      notification: { show, message },
    }))
  }

  const startVideoStream = (video: HTMLVideoElement): void => {
    navigator.getUserMedia(
      constraints,
      stream => {
        if (video) {
          video.srcObject = stream
        }
      },
      error => {
        console.log(error)
      }
    )
  }

  const stopVideoStream = (video: HTMLVideoElement): void => {
    if (video) {
      // A video's MediaStream object is available through its srcObject attribute
      const stream = video.srcObject
      const tracks = stream.getTracks()

      tracks.forEach(track => {
        track.stop()
      })

      video.srcObject = null
    }
  }

  const handleCameraOff = (): void => {
    toggleNotification(true, `Camera disabled 👍`)
    toggleVideoPreview()
  }

  const toggleVideoPreview = (): void => {
    setShowVideo(!showVideo)
  }

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

    // Hide notifications
    if (state.notification.show) {
      toggleNotification(false)
    }
  }

  const handleEdit = (): void => {
    const state = !showPicker
    setShowPicker(state)

    const message = state ? "enabled 🎨" : "disabled"
    toggleNotification(true, `Edit mode ${message}`)

    // Reset to the default color if the user did not save?????
    // setState(state => ({ ...state, backgroundColor: state.defaultColor }))
  }

  const togglePalette = (usePalette: boolean): void => {
    setMessageIndex(getRandomNumber())
    setState(state => ({ ...state, usePalette: usePalette }))
    setShowPicker(true)
  }

  const saveDefault = (): void => {
    setState(state => ({ ...state, defaultColor: state.backgroundColor }))
    setShowPicker(false)
    toggleNotification(true, `Saved default soft light as ${hexWithAlpha} 😎`)
  }

  const saveLocalStorage = (): void => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...state,
      })
    )
  }

  const handleNotificationClose = (event, reason = ""): void => {
    if (reason === "clickaway") {
      return
    }

    toggleNotification(false)
  }

  const handleLightsOut = (): void => {
    const state = !lightsOut
    setLightsOut(state)

    const message = state ? "enabled " : "disabled"
    toggleNotification(true, `Lights Out ${message}`)
  }

  const message = parse(messages[messageIndex])

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
        {fullscreen ? (
          <Tooltip title="Exit Fullscreen">
            <Fab
              className="lg:visible md:invisible sm:invisible"
              style={{ background: "var(--light)" }}
              aria-label="Exit Fullscreen"
              size="small"
              onClick={() => toggleFullscreen(false)}
            >
              <FullscreenExit style={{ color: hexWithAlpha }} />
            </Fab>
          </Tooltip>
        ) : (
          <Tooltip title="Enter Fullscreen">
            <Fab
              className="lg:visible md:invisible sm:invisible"
              style={{ background: "var(--light)" }}
              aria-label="Enter Fullscreen"
              size="small"
              onClick={() => toggleFullscreen(true)}
            >
              <Fullscreen style={{ color: hexWithAlpha }} />
            </Fab>
          </Tooltip>
        )}
        <Tooltip title="Duplicate Tab">
          <Fab
            className="lg:visible md:invisible sm:invisible"
            style={{ background: "var(--light)" }}
            aria-label="Duplicate Tab"
            size="small"
            onClick={() => {
              window.open("/", "_blank")
            }}
          >
            <OpenInNew style={{ color: hexWithAlpha }} />
          </Fab>
        </Tooltip>
        <Tooltip title="Toggle Lights Out">
          <Fab
            style={{ background: "var(--light)" }}
            aria-label="Toggle Lights Out"
            size="small"
            onClick={handleLightsOut}
          >
            <PowerSettingsNew style={{ color: hexWithAlpha }} />
          </Fab>
        </Tooltip>
        {videoSupported && (
          <>
            {showVideo ? (
              <Tooltip title="Turn Off Camera">
                <Fab
                  style={{ background: "var(--light)" }}
                  aria-label="Turn Off Camera"
                  size="small"
                  onClick={handleCameraOff}
                >
                  <VideocamOff style={{ color: hexWithAlpha }} />
                </Fab>
              </Tooltip>
            ) : (
              <Tooltip title="Turn On Camera">
                <Fab
                  style={{ background: "var(--light)" }}
                  aria-label="Turn On Camera"
                  size="small"
                  onClick={toggleVideoPreview}
                >
                  <Videocam style={{ color: hexWithAlpha }} />
                </Fab>
              </Tooltip>
            )}
          </>
        )}
        <div className="pr-4">
          <Tooltip title="Toggle Edit">
            <Fab
              style={{ background: "var(--light)" }}
              aria-label="Toggle Edit"
              size="small"
              onClick={handleEdit}
            >
              <Edit style={{ color: hexWithAlpha }} />
            </Fab>
          </Tooltip>
        </div>
      </div>
      <div className="place-self-center w-80">
        {showVideo && <video id="camera" muted autoPlay />}
      </div>
      <div className="p-4 max-w-lg place-self-center align-top">
        {showPicker && (
          <h2
            tabIndex={2}
            aria-label="description of soft light"
            className="lg:text-2xl md:text-xl sm:text-base text-center"
          >
            {message}
          </h2>
        )}
      </div>
      <div className="place-self-center">
        {showPicker && (
          <Picker
            usePalette={state.usePalette}
            state={state || initialState}
            onChange={handleColorChange}
          />
        )}
      </div>
      <div className="inline-grid px-8 inline-grid grid-cols-toolbar toolbar">
        <Tooltip title="Color Picker">
          <IconButton
            className="iconButton"
            edge="start"
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
            className="iconButton"
            edge="end"
            aria-label="Color Palette"
            onClick={() => togglePalette(true)}
          >
            <PaletteIcon className="icon" />
          </IconButton>
        </Tooltip>
      </div>
      <Snackbar
        className="mt-16"
        open={state.notification.show}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        onClose={handleNotificationClose}
      >
        <Alert
          className="alert"
          onClose={handleNotificationClose}
          severity="success"
        >
          {state.notification.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
