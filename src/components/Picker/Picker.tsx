import React from "react"
import { ChromePicker, ColorResult, SwatchesPicker } from "react-color"
import { State } from "../../interfaces/State"
import { initialState } from "../../pages/App"

interface Props {
  usePalette: boolean
  state: State
  onChange: (color: ColorResult) => void
}

const swatchStyles = {
  default: {
    overflow: {
      backgroundColor: "var(--dark)",
    },
  },
}

const Picker = ({ usePalette = true, state, onChange }: Props) => {
  const color = state?.backgroundColor.rgb || initialState.backgroundColor.rgb
  return (
    <div>
      {usePalette ? (
        <SwatchesPicker
          className="place-self-center"
          styles={swatchStyles}
          color={color}
          onChange={onChange}
          onChangeComplete={onChange}
        />
      ) : (
        <ChromePicker
          className="place-self-center"
          color={color}
          onChange={onChange}
          onChangeComplete={onChange}
        />
      )}
    </div>
  )
}

export default Picker
