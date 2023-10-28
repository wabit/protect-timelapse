const { fs } = require('./utils')
const moment = require('moment')

let date = moment().format('YYYY-MM-DD')
const blacklist = [date, '.DS_Store']

async function cleanUpSnapshots( folder, retention) {
  folders = fs.readdirSync(folder)
  blacklist.forEach(folder => {
    const index = folders.indexOf(folder)
    if (index > -1) {
      folders.splice(index, 1)
    }
  })
  folders.forEach(dir => {
    subFolders = fs.readdirSync(folder + dir).forEach(subDir => {
      if (blacklist.indexOf(subDir) === -1) {
        metadataFile = `${folder}${dir}/${subDir}/metadata.json`
        metadata = JSON.parse(fs.readFileSync(metadataFile))
        if (metadata.processed && moment().diff(moment(dir), 'days') > retention) {
          console.log('Deleting folder: ' + folder + dir + '/' + subDir)
          if (fs.existsSync(`${folder}${dir}/.DS_Store`)) {
            fs.rmSync(`${folder}${dir}/.DS_Store`)
          }
          fs.rmSync(folder + dir + '/' + subDir, { recursive: true })
        } else if (!metadata.processed && moment().diff(moment(dir), 'days') > retention) {
          console.log(folder + dir + '/' + subDir + ' is not processed but is older than the retention period, not deleting')
        }
      }
    })
  })
  folders.forEach(dir => {
    if (fs.readdirSync(folder + dir).length === 0) {
      console.log('Deleting folder: ' + folder + dir)
      fs.rmSync(folder + dir, { recursive: true })
    }
  })
}

async function cleanupTimelapses(folder, retention) {
  folders = fs.readdirSync(folder)
  folders.forEach(file => {
    if (file.endsWith('.mp4')) {
      const fileDate = file.split('_')[1].split('.')[0]
      if (moment(fileDate, "YYYY-MM-DD").isValid()) {
        if (moment().diff(moment(fileDate, "YYYY-MM-DD"), 'days') > retention) {
          console.log('Deleting timelapse: ' + folder + file)
          fs.rmSync(folder + file)
        }
      } else {
        console.log('Invalid date: ' + fileDate)
      }
    }
  })
}

module.exports = {
  cleanUpSnapshots,
  cleanupTimelapses
}