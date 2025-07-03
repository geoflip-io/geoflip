# Geoflip Client – Dev README
A Vite-powered React front-end for the Geoflip api.

## ✨ Prerequisites
| Tool        | Version           |
|-------------|-------------------|
| **Node.js** | **22.x** (LTS)    |
| npm         | Comes with Node 22 |

> ⚠️ Using an older Node version will cause install/build issues.  
> Check with: `node -v` → `22.*.*`

Also make sure you have docker running to run the backend api if you want it to work locally

---

## .ENV 
setup a .env file in the `/client` directory it should have these values, you will need a mapbox api key so get that from mapbox:

```
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=pk.ey...
```

---

## 🔧 Running the project

1. cd into the `/client` folder
2. run `npm install`
3. run `npm run dev`

