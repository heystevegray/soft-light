import React, { useState, useEffect } from "react"
import Fab from "@material-ui/core/Fab"
import EditIcon from "@material-ui/icons/Edit"
import { makeStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import { SwatchesPicker, ChromePicker, ColorResult } from "react-color"
import "../assets/sass/base.scss"

interface State {
  defaultColor: ColorResult
  backgroundColor: ColorResult
  recentColors: ColorResult[]
}

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
}

export default function Home() {
  const storage = localStorage.getItem(STORAGE_KEY)
  const [state, setState] = useState<State>(
    (storage && JSON.parse(storage)) || initialState
  )

  useEffect(() => {
    saveLocalStorage()
  }, [state])

  const handleColorChange = (color: ColorResult): void => {
    setState(state => ({ ...state, backgroundColor: color }))
  }

  const saveDefault = (): void => {
    console.log("Saving...")

    setState({ ...state, defaultColor: state.backgroundColor })
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

  const formatColor = (hex = "#000000", alpha = 1): string => {
    const brightness = Math.round(alpha * 255).toString(16)
    return `${hex}${brightness}` || "black"
  }

  const alpha = state.backgroundColor?.rgb.a || 1
  const hex = state.backgroundColor?.hex || "#000000"

  return (
    <div className="page" style={{ background: formatColor(hex, alpha) }}>
      <h1>soft light</h1>
      <div className="colors">
        <ChromePicker
          className="picker"
          color={state.backgroundColor.rgb}
          onChange={handleColorChange}
          onChangeComplete={handleColorChange}
        />
        <SwatchesPicker
          className="picker"
          color={state.backgroundColor.rgb}
          onChange={handleColorChange}
          onChangeComplete={handleColorChange}
        />
        {/* <Fab color="secondary" aria-label="edit">
          <EditIcon />
        </Fab> */}
        {/* <div className="container">
          {state.recentColors.map((color: ColorResult, index: number) => (
            <div
              key={index}
              className="recent"
              style={{ background: formatColor(color.hex, color.rgb.a) }}
            >
              <p>{formatColor(color.hex, color.rgb.a)}</p>
            </div>
          ))}
        </div> */}
      </div>
      <div>
        <Button variant="outlined" color="primary" onClick={saveDefault}>
          Save Default Color
        </Button>
      </div>
    </div>
  )
}
