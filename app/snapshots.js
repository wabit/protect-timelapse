const { fs, axios } = require('./utils')
const { checkFolder, createFolder, createMetadata } = require('./helpers')


async function get (camera, time, currentFolder, debug) {
  if (debug) {
    console.log('Getting snapshot for: ' + camera.name)
  }
  const url = `http://${camera.ip}/snap.jpeg`
  const filename = `${currentFolder}/${camera.name}/${time}.jpg`
  try {
    const snapshot = await axios({
      url: url,
      method: 'GET',
      responseType: 'stream'
    })

    snapshot.data.pipe(fs.createWriteStream(filename))
    if (debug) {
      console.log('Snapshot saved: ' + filename)
    }
  } catch (error) {
    console.log('Error getting snapshot from ${camera.name}: ${error}')
  }
}

async function snapshotService (config, currentFolder, time) {
  if (config.debug) {
    console.log('Getting snapshots...')
  }
  if (!checkFolder(currentFolder)) {
    createFolder(currentFolder)
    checkFolder(currentFolder)
  }
  config.cameras.forEach(camera => {
    if (!checkFolder(currentFolder + '/' + camera.name)) {
      createFolder(currentFolder + '/' + camera.name)
      createMetadata(currentFolder + '/' + camera.name, camera.name)
      checkFolder(currentFolder + '/' + camera.name)
    }
    get(camera, time, currentFolder, config.debug)
  })

}

module.exports = {
  get,
  snapshotService,
}