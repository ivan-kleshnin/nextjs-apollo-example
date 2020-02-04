import fetch from "cross-fetch"
import merge from "lodash.merge"

export async function fetchJSON(url, options = {}) {
  options = merge(options, {
    credentials: "same-origin",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      // ... typeof window != "undefined" ? {} : {
      //   "Cookie": global.headers.cookie
      // }
    },
    body: JSON.stringify(options.body),
  })

  let resp = await fetch(url, options)

  if ((resp.headers.get("content-type") || "").includes("application/json")) {
    try {
      // We don't check for `resp.ok` or `resp.status > 299`
      // because in those cases the server still have to provide valid JSON
      // which is left for the client to interpret. We only care
      // about valid JSON responses in this function.
      return {
        body: await resp.json(),
        status: resp.status,
      }
    } catch (err) {
      // Bad JSON
      throw new ErrorX({status: resp.status, message: `API: Invalid JSON`})
    }
  } else {
    // Bad Content-type
    throw new ErrorX({status: resp.status, message: `API: Invalid mime-type`})
  }
}
