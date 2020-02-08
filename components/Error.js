import React from "react"
import {getErrorMessage} from "lib"

export function Error({error}) {
  return <p>
    {getErrorMessage(error)}
  </p>
}
