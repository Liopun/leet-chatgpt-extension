import archiver from 'archiver'
import autoprefixer from 'autoprefixer'
import * as dotenv from 'dotenv'
import esbuild from 'esbuild'
import postcssPlugin from 'esbuild-style-plugin'
import fs from 'fs-extra'
import path from "path"
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const templatesDir = path.join(__dirname, 'templates');
const localesDir = path.join(__dirname, '_locales');
const sourceDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'extension')

const cleanupBuild = async () => {
  await fs.remove(outDir)
}

const runEsbuild = async () => {
  await esbuild.build({
    entryPoints: [
      path.join(sourceDir, 'contentScript', 'index.tsx'),
      path.join(sourceDir, 'background', 'index.ts'),
      path.join(sourceDir, 'options', 'index.tsx'),
      path.join(sourceDir, 'popup', 'index.tsx'),
    ],
    bundle: true,
    outdir: outDir,
    treeShaking: true,
    minify: true,
    legalComments: 'none',
    define: {
      'process.env.NODE_ENV': '"production"',
    },
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    jsx: 'automatic',
    loader: {
      '.png': 'dataurl',
    },
    plugins: [
      postcssPlugin({
        postcss: {
          plugins: [autoprefixer],
        },
      }),
    ],
  })
}

async function zipBuild(dir) {
  const output = fs.createWriteStream(`${dir}.zip`)
  const archive = archiver('zip', {
    zlib: { level: 9 },
  })
  archive.pipe(output)
  archive.directory(dir, false)
  await archive.finalize()
}

async function copyFiles(entryPoints, targetDir) {
  await fs.ensureDir(targetDir)
  await Promise.all(
    entryPoints.map(async (entryPoint) => {
      await fs.copy(entryPoint.src, `${targetDir}/${entryPoint.dst}`)
    }),
  )
}

async function build() {
  await cleanupBuild()
  await runEsbuild()

  const commonFiles = [
    { src: path.join(outDir, 'contentScript', 'index.js'), dst: 'content-script.js' },
    { src: path.join(outDir, 'contentScript', 'index.css'), dst: 'content-script.css' },
    { src: path.join(outDir, 'background', 'index.js'), dst: 'background.js' },
    { src: path.join(outDir, 'options', 'index.js'), dst: 'options.js' },
    { src: path.join(templatesDir, 'options.html'), dst: 'options.html' },
    { src: path.join(outDir, 'options', 'index.css'), dst: 'options.css' },
    { src: path.join(outDir, 'popup', 'index.js'), dst: 'popup.js' },
    { src: path.join(outDir, 'popup', 'index.css'), dst: 'popup.css' },
    { src: path.join(templatesDir, 'popup.html'), dst: 'popup.html' },
    { src: path.join(sourceDir, 'app/assets', 'logo.png'), dst: 'logo.png' },
    { src: localesDir, dst: '_locales' },
  ]

  // chromium
  await copyFiles(
    [...commonFiles, { src: path.join(sourceDir, 'manifest.json'), dst: 'manifest.json' }],
    `./extension/chrome`,
  )

  await zipBuild(`./extension/chrome`)

  // firefox
  await copyFiles(
    [...commonFiles, { src: path.join(sourceDir, 'manifest.v2.json'), dst: 'manifest.json' }],
    `./extension/firefox`,
  )

  await zipBuild(`./extension/firefox`)

  console.log('Build success.')
}

build()