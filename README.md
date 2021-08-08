# VM (Optional)

1. Obtain a license (free for CSE students) and download Vmware Fusion Pro (mac) or Vmware Workstation Pro/player (windows) [here](https://e5.onthehub.com/WebStore/Welcome.aspx?ws=7c113c30-5d8b-de11-8cd1-0030487d8897)

2. Download and run the prebuilt VM available [here](https://www.dropbox.com/s/fyofpn7mv7o74rm/COMP9323.ova?dl=0). Password for VM is `COMP9323`

If you have issues installing or using the VMWare software, then use VirtualBox as a free alternative.
- VirtualBox Installation [guide](https://wikis.utexas.edu/display/MSBTech/Installing+VirtualBox)
- Installing OVA files in VirtualBox [guide](https://wikis.utexas.edu/display/MSBTech/Installing+OVA+files+using+VirtualBox)

# Frontend

## API Keys
### Current Key Names
This is a list of all API keys used in our project. If you incorporate a new key, update this list with its name ONLY. Only update this list when your code has been pushed to master.
- REACT_APP_YT_KEY: API key for youtube [Getting a key](https://medium.com/swlh/how-to-get-youtubes-api-key-7c28b59b1154)
- REACT_APP_NEWSAPI_KEY: API key for newsapi.org [Get a key](https://newsapi.org/)
- REACT_APP_UNPAYWALL_EMAIL: your email for unpaywall requests.

In the /frontned folder, create a file named `.env`:

```
├── frontend
│   └──.env
```

This is a private file included in .gitignore. Ensure no keys are pushed to the repo.
CURRENT file:

```
REACT_APP_YT_KEY="XXXXXXXXXX"
REACT_APP_NEWSAPI_KEY="XXXXXXXXXX"
REACT_APP_UNPAYWALL_EMAIL="XXXXXXXXXX"
```


## Installation (only if not using VM)
- Download an install [npm and node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

##  Usage
1. In /frontend run `yarn install` then `yarn dev`

- Frontend should be running on http://localhost:3000

# Backend

## Boilerplate: FLASK RESTX BOILER-PLATE WITH JWT

Full description and guide [here](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563)
## Usage
Note: make sure you have `pip` and `virtualenv` installed (If not using VM).

    Initial installation: make install

    To run tests: make tests

    To run application: make run


Make sure to run the initial migration commands to update the database.

    `make migrate`


## Viewing the app ###

    Open the following url on your browser to view swagger documentation
    http://127.0.0.1:5000/


## API Keys

In the /server folder, create a file named `server.env`:

```
├── server
│   └── server.env
```

This is a private file included in .gitignore. Ensure no keys are pushed to the repo.
Current file:

```
IBM_WATSON_API_KEY="XXXXXXXX"
IBM_WATSON_URL="XXXXXXXX"
MEANING_CLOUD="XXXXXXXX"
OXFORD_API_KEY="XXXXXXXX"
OXFORD_ID="XXXXXXXX"
SCIENCE_PARSE_URL="http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/v1"
```

