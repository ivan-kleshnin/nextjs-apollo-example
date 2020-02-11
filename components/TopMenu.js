import Link from "next/link"
import React from "react"

export function TopMenu({me}) {
  return <>
    <Link href="/"><a>Home</a></Link>
    {" "}
    <Link href="/about"><a>About</a></Link>
    {" "}
    <Link href="/posts"><a>Blog</a></Link>
    {" "}
    <AccountSubMenu me={me}/>
    <hr/>
  </>
}

function AccountSubMenu({me}) {
  return <>
    {me
      ? <Link href="/signout">
          <a>SignOut</a>
        </Link>

      : <>
          {" | "}
          <Link href="/signin">
            <a>SignIn</a>
          </Link>
          {" or "}
          <Link href="/signup">
            <a>SignUp</a>
          </Link>
        </>}
  </>
}
