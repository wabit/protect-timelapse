# protect-timelapse

Continaer that takes snapshots from unifi cameras and generates a timelapse video from the snapshots at the end of each day.

## Usage

### Enabling Anonymous Snapshots

This continaer uses the Anonymous Snapshots feature of the unifi cameras. To enable this feature, you must first enable it on each camera you want to create a timelapse for.

* Get into Protect UI
* On left bottom corner click the Settings gear
* Click System
* On the main page, you’ll see Recovery Code, click REVEAL. This is the password for your addopted cameras.
* Copy the password
* Connect to the Camera IP through https, e.g. <https://your.camera.ip.address>
* Login with username `ubnt` and password from above
* Enable the “Anonymous Snapshot” on the camera

To test it is working you should be able to access <http://your.camera.ip.address/snap.jpeg>

### Running the container

The first run will generate a default config file aswell as the directories to store the snapshots and timelapses and then stop. Edit the config file to your using the details bellow and restart the container, you should shortly start to see snapshots being saved.

<details>
  <summary> docker run </summary>

```bash
`docker run -v ./config:/app/config -d protect-timelapse`
```

</details>

<details>
  <summary>docker-compose.yml</summary>

```yaml
version: '3'

services:
  protect-timelapse:
    image: protect-timelapse:v1.0.0
    container_name: protect-timelapse
    volumes:
      - ./config:/app/config
```

</details>

### Config example

```json
{
  "debug": false,
  "interval": 1,
  "saveLocation": "./config/snapshots/",
  "timelapseLocation": "./config/timelapse/",
  "cameras": [
    { "name": "Patio", "ip": "192.168.1.10"},
    { "name": "Front-Door", "ip": "192.168.1.11"}
  ]
}
```

* **`debug`** *(Boolean)* - enable debug logging.
* **`interval`** *(Number)* - number of minutes between snapshots. 1 is the lowest value, 0.25 is the lowest value that is recommended.
* **`saveLocation`** *(String)* - location to save snapshots, this shouldnt need to be changed.
* **`timelapseLocation`** *(String)* - location to save timelapse videos, this shouldnt need to be changed.
* **`cameras`** *(Array)* - All the cameras to take snapshots from. **`name`** *(String)* used for the filename of the timelapse video. **`ip`** *(String)* the ip address of the camera.
