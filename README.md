## Requirements

### Using VM

1. Obtain a license (free for CSE students) and download Vmware Fusion Pro (mac) or Vmware Workstation Pro/player (windows) [here](https://e5.onthehub.com/WebStore/Welcome.aspx?ws=7c113c30-5d8b-de11-8cd1-0030487d8897)

2. Download and run the prebuilt VM available [here](https://www.dropbox.com/s/fyofpn7mv7o74rm/COMP9323.ova?dl=0). Password for VM is `COMP9323`

If you have issues installing or using the VMWare software, then use VirtualBox as a free alternative.
- VirtualBox Installation [guide](https://wikis.utexas.edu/display/MSBTech/Installing+VirtualBox)
- Installing OVA files in VirtualBox [guide](https://wikis.utexas.edu/display/MSBTech/Installing+OVA+files+using+VirtualBox)

### Locally

- [NPM and node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)
- [Python v3.8.5](https://www.python.org/downloads/release/python-385/) (+ [pip](https://pypi.org/project/pip/) and [virtualenv](https://pypi.org/project/virtualenv/))

## Installation
1. In /frontend run `yarn install`
2. In /server run `make install`
##  Usage

- Ensure API keys have been loaded as described below.
- In /server run `make migrate` followed by `make run`. Server should be running on port 5000. See swagger docs at http://127.0.0.1:5000/
- In /frontend run `yarn dev`. Frontend should be running on http://localhost:3000

## API Keys

Two env files are requied. One for frontend, and one for backend.

### Frontend (/frontend/.env)

In the /frontned folder, create a file named `.env`:

```
├── frontend
│   └──.env
```

Contents of `frontend/.env`:
```
REACT_APP_YT_KEY="XXXXXXXXXX"
REACT_APP_NEWSAPI_KEY="XXXXXXXXXX"
REACT_APP_UNPAYWALL_EMAIL="XXXXXXXXXX"
```

### Server (/server/server.env)

In the /server folder, create a file named `server.env`:

```
├── server
│   └── server.env
```

Contents of `server/server.env`:

```
IBM_WATSON_API_KEY="XXXXXXXX"
IBM_WATSON_URL="XXXXXXXX"
MEANING_CLOUD="XXXXXXXX"
OXFORD_API_KEY="XXXXXXXX"
OXFORD_ID="XXXXXXXX"
SCIENCE_PARSE_URL="http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/v1"
```

### Obtaining keys
- REACT_APP_YT_KEY: API key for youtube [Getting a key](https://medium.com/swlh/how-to-get-youtubes-api-key-7c28b59b1154)
- REACT_APP_NEWSAPI_KEY: API key for newsapi.org [Get a key](https://newsapi.org/)

## Credits 

- Backend boilerplate used from [here](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563)
- Scientific paper parsing library used for parsing PDFs. Taken from [here](https://github.com/stoposto/science-parse) which is our fork of [science-parse](https://github.com/allenai/science-parse). Due to high resource usage and operational overhead required to provide a reliable local instance, it has been deployed [here](http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/) on a load balanced AWS ECS service.

