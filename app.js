const moment = require('moment')
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfmpegPath('/usr/bin/ffmpeg')

const { fs } = require('./app/utils')
const { startup } = require('./app/init')
const configuration = require('./app/config')
const { minutesToMilliseconds, getDirsForProcessing } = require('./app/helpers')
const snapshots = require('./app/snapshots')

let initialised = false
let date = moment().format('YYYY-MM-DD')
let interval = 1 // sets the interval to a sane 1 minute rather than the defualt 0
let config ={}

async function init() {
  if (initialised) {
    return;
  }
  try {
    await startup()
    config = await configuration.get()
    currentFolder = config.saveLocation + date
    interval = config.interval
    initialised = true
  } catch (error) {
    console.error('Initialization error:', error)
    process.exit(1)
  }
  main()
  setInterval(main, minutesToMilliseconds(interval))
}

let processing = 0

async function createVideo() {
  getDirsForProcessing(config.saveLocation, date, config.cameras).forEach(directory => {
    try {
      processing++
      console.log('Creating video for: ' + directory)
      const split = directory.split('/')
      const camera = split.pop()
      const dirDate = split.pop()
      const filename = `${config.timelapseLocation}${camera}_${dirDate}.mp4`
      const video = ffmpeg()
      let lastProgressUpdate = 0
      video.addInput(`${directory}/%*.jpg`)
      video.output(filename)
      video.on('progress', (progress) => {
        const formattedProgress = (progress.percent).toFixed(1)
        const currentProgress = Math.floor(formattedProgress)
        if (currentProgress % 10 === 0 && currentProgress !== lastProgressUpdate) {
          console.log(`Processing : ${camera}_${dirDate}.mp4 ${formattedProgress}% done`)
          lastProgressUpdate = currentProgress
        }
      })
      video.on('end', () => {
        console.log('Video created: ' + filename)
        const metadataFile = `${directory}/metadata.json`
        const metadata = JSON.parse(fs.readFileSync(metadataFile))
        metadata.processed = true
        fs.writeFileSync(metadataFile, JSON.stringify(metadata))
        processing--
      })
      video.run()
    } catch (error) {
      console.log('Error creating video: ' + error)
    }
  })
}

async function main() {
  await init()
  config = await configuration.get()
  let currentFolder = config.saveLocation + date
  const currentDate = moment().format('YYYY-MM-DD')
  const time = moment().format('HHmmss')
  if (currentDate != date) {
    date = currentDate;
    currentFolder = config.saveLocation + date
  }
  if (processing == 0) {
    await createVideo()
  }
  await snapshots.snapshotService(config, currentFolder, time)
}

init()
