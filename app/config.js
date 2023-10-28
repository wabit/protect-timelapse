const { fs } = require('./utils')

let config = {}
const baseConfig = {
  "interval": 1,
  "snapshotLocation": "./config/snapshots/",
  "snapshotRetention": 2,
  "timelapseLocation": "./config/timelapse/",
  "timelapseRetention": 7,
  "debug": false,
  "cameras": [
    {
      "name": "camera1",
      "ip": "0.0.0.0"
    }
  ]
}

async function createConfig(configFile) {
  if (!fs.existsSync(configFile)) {
    console.error('config.json does not exist, creating using defaults')
    fs.writeFileSync(configFile, JSON.stringify(baseConfig))
    console.log('Config file created successfully.\nPlease edit config.json with your camera details and restart.')
    process.exit()
  }
  return true
}

async function load() {
  const configFile = './config/config.json';
  console.log('Loading config from ' + configFile);

  if (!fs.existsSync(configFile)) {
    await createConfig(configFile)
    return null
  }

  try {
    const configFileContents = fs.readFileSync(configFile)
    console.log('Config file loaded successfully. \n')
    config = JSON.parse(configFileContents)
    return config
  } catch (error) {
    console.error('Error getting config:', error)
    return null
  }
}

function get() {
  return config
}

function update(config) {
  const jsonString = JSON.stringify(config)
  try {
    fs.writeFileSync('./config.json', jsonString)
    return true
  } catch (error) {
    console.log('Error updating config: ' + error)
    return false
  }
}

module.exports = {
  load,
  get,
  update,
}