const { fs } = require('./utils')
const { get: config } = require('./config')

const checkFolder = (folder) => {
  const exists = fs.existsSync(folder)
  if (config.debug) {
    if (!exists) {
      console.log('Folder does not exist: ' + folder)
    } else {
      console.log('Folder exists: ' + folder)
    }
  }
  return exists
}

const createFolder = (folder) => {
  fs.mkdirSync(folder)
}

const minutesToMilliseconds = (minutes) => {
  return minutes * 60 * 1000
}

const getDirsForProcessing = (folder, date, cameras) => {
  const directories = []
  folders = fs.readdirSync(folder)
  // remove a list of folders
  const removeFolders = [date, '.DS_Store']
  removeFolders.forEach(folder => {
    const index = folders.indexOf(folder)
    if (index > -1) {
      folders.splice(index, 1)
    }
  })

  folders.forEach(dir => {
    cameras.forEach(camera => {
      if (fs.existsSync(folder + dir + '/' + camera.name)) {
        if (!checkIfProcessed(folder + dir + '/' + camera.name)) {
          directories.push(folder + dir + '/' + camera.name)
        }
      }
  })
})
  if (directories.length > 0 && config.debug) {
    console.log('Directories for processing: ' + directories.length)
    console.log(directories)
  }
  return directories
}

const createMetadata = (folder, camera) => {
  const metadata = {
    camera: camera,
    processed: false,
  }
  console.log('Creating metadata for: ' + folder)
  const filename = `${folder}/metadata.json`
  const jsonString = JSON.stringify(metadata)
  fs.writeFileSync(filename, jsonString)
}

function checkIfProcessed(directory) {
  if (config.debug) {
    console.log('Checking if processed: ' + directory)
  }
  const metadataFile = `${directory}/metadata.json`
  const metadata = JSON.parse(fs.readFileSync(metadataFile))
  if (!metadata.processed) {
    return false
  }
  return true
}

module.exports = {
  checkFolder,
  createFolder,
  minutesToMilliseconds,
  getDirsForProcessing,
  createMetadata,
}