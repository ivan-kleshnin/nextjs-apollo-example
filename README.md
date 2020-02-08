# NextJS & Apollo Stack Example

This code is an evolution of [api-routes-apollo-server-and-client-auth](https://github.com/zeit/next.js/tree/canary/examples/api-routes-apollo-server-and-client-auth) original demo.
My goal is to make it much easier and, at the same time, more production-like.

### Steps Taken

- [x] 1. Use more realistic folder/file structure.
- [x] 2. Use FS-based DB emulation as RAM-based don't play well with dev servers.
- [x] 3. Demonstrate GitHub (OAuth) authentication.
- [x] 4. Replace Full SSR with [Partial SSR](https://paqmind.com/en/blog/ssr-is-not-the-future).
- [ ] 5. Demonstrate proper error handling/logging (in process).
- [ ] 6. Revisit security & performance aspects.

## How To Use

0. Rename `.env.default` to `.env`. Set the appropriate credentials.

1. Fetch repo

```
project-folder $ git init
project-folder $ git remote add origin git@github.com:ivan-kleshnin/nextjs-apollo-example.git
project-folder $ git pull origin master
```

2. Install deps

```
project-folder $ yarn install
```

3. Run

```
project-folder $ yarn dev
```
