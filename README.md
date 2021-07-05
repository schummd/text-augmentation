# VM (Optional)

1. Obtain a license (free for CSE students) and download Vmware Fusion Pro (mac) or Vmware Workstation Pro/player (windows) [here](https://e5.onthehub.com/WebStore/Welcome.aspx?ws=7c113c30-5d8b-de11-8cd1-0030487d8897)

2. Download and run the prebuilt VM available [here](https://www.dropbox.com/s/fyofpn7mv7o74rm/COMP9323.ova?dl=0). Password for VM is `COMP9323`

If you have issues installing or using the VMWare software, then use VirtualBox as a free alternative.
- VirtualBox Installation [guide](https://wikis.utexas.edu/display/MSBTech/Installing+VirtualBox)
- Installing OVA files in VirtualBox [guide](https://wikis.utexas.edu/display/MSBTech/Installing+OVA+files+using+VirtualBox)

## Tutorial
Very brief walkthrough [here](https://www.dropbox.com/s/ehvi9vrj7myk3qg/9323_vm_tutorial.mov?dl=0). Download for better quality.

# Usage

## Frontend
1. Download an install [npm and node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
2. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

1. In /frontend run `yarn install` then `yarn dev`
2. In /frontend-dev-server run `yarn install` then `yarn server`

- Frontend should be running on http://localhost:3000
- frontend-dev-server should be running on http://localhost:3001

## Backend

Follow instructions in server/README.md

# Frontend

Skeleton for fetching data from JSON db file served via an express server.



## frontend-dev-server endpoints
GET / - returns JSON object with contents of frontend-dev-server/db.json

# Backend TBA

# Collaboration

Collaboration will be managed via Github Projects. Three projects have been created [here](https://github.com/COMP9323-project/Software-as-a-Sevice-project-/projects):
- Frontend
- Backend
- Ops
