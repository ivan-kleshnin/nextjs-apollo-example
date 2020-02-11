import PT from "prop-types"
import React from "react"

export function Field(props) {
  let {autoComplete, caption, name, required, type} = props

  return <div>
    <label>
      {caption} {required ? <span title="Required">*</span> : undefined}
      <input
        autoComplete={autoComplete}
        name={name}
        required={required}
        type={type}
      />
    </label>
  </div>
}

Field.propTypes = {
  autoComplete: PT.oneOf(["on", "off"]),
  caption: PT.string.isRequired,
  name: PT.string.isRequired,
  required: PT.bool,
  type: PT.string.isRequired,
}

Field.defaultProps = {
  autoComplete: "off",
  required: false,
}
