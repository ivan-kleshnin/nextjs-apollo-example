import FS from "fs"

export function read() {
  if (FS.existsSync("./db.json")) {
    return JSON.parse(FS.readFileSync("./db.json", "utf-8"))
  } else {
    return {accounts: []}
  }
}

export function write(data) {
  let db = read()
  FS.writeFileSync("./db.json", JSON.stringify({...db, ...data}, null, 2))
}
