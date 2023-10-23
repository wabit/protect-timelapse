const { checkFolder, createFolder } = require('./helpers')
const configuration = require('./config')
let config = {}

async function checkFolders() {
  if (!checkFolder(config.timelapseLocation, config)) {
    createFolder(config.timelapseLocation, config)
  } else {
    console.log('Folder exists: ' + config.timelapseLocation)
  }
  if (!checkFolder(config.saveLocation)) {
    createFolder(config.saveLocation)
  } else {
    console.log('Folder exists: ' + config.saveLocation)
  }
  return true
}

async function currentSettings() {
  console.log(' ')
  console.log('---------------------------------')
  console.log('Starting snapshot service...')
  console.log('Interval: ' + config.interval + ' minutes')
  console.log('Snapshot Location: ' + config.saveLocation)
  console.log('Timelapse Location: ' + config.timelapseLocation)
  console.log('Debug: ' + config.debug)
  console.log('Cameras: ' + config.cameras.length)
  config.cameras.forEach(camera => {
    console.log('  ' + camera.name + ' - ' + camera.ip)
  })
  console.log('---------------------------------')
  console.log(' ')
  return true
}

async function startup() {
  console.log('Initializing...')
  config = await configuration.load()

  console.log('Checking folders...')

  await checkFolders()
  await currentSettings()
}

module.exports = {
  startup,
}