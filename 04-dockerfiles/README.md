# 04 - Lean Docker Images

Companion code for [Lean Docker Images: Multi-Stage Builds and Layer Caching](https://www.techdevmantra.com/guides/lean-docker-images-multi-stage-builds).

Two ways to build the same Node app, so you can measure the difference:

- `Dockerfile.naive` - full `node:22` base, `COPY . .` then `npm install`. Around 1.62GB in the post's run.
- `Dockerfile` - multi-stage, `node:22-alpine`, production deps only, cache-friendly ordering. Around 233MB.
- `.dockerignore` - keeps `node_modules`, `.git`, and `.env` out of the build context.
- `Makefile` - convenience targets for the two builds and a size comparison.

## Build and compare

```bash
make naive
make slim
make sizes
```

`make sizes` prints both image sizes side by side. Change `server.js` and rebuild to see the optimized image reuse its cached dependency layer while the naive one reinstalls.
