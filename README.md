# VM (Optional)

1. Obtain a license (free for CSE students) and download Vmware Fusion Pro (mac) or Vmware Workstation Pro/player (windows) [here](https://e5.onthehub.com/WebStore/Welcome.aspx?ws=7c113c30-5d8b-de11-8cd1-0030487d8897)

2. Download and run the prebuilt VM available [here](https://www.dropbox.com/s/fyofpn7mv7o74rm/COMP9323.ova?dl=0). Password for VM is `COMP9323`

If you have issues installing or using the VMWare software, then use VirtualBox as a free alternative.
- VirtualBox Installation [guide](https://wikis.utexas.edu/display/MSBTech/Installing+VirtualBox)
- Installing OVA files in VirtualBox [guide](https://wikis.utexas.edu/display/MSBTech/Installing+OVA+files+using+VirtualBox)

## Tutorial
Very brief walkthrough [here](https://www.dropbox.com/s/ehvi9vrj7myk3qg/9323_vm_tutorial.mov?dl=0). Download for better quality.

# Frontend

## Installation (only if not using VM)
- Download an install [npm and node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

##  Usage
1. In /frontend run `yarn install` then `yarn dev`
2. In /frontend-dev-server run `yarn install` then `yarn server`

- Frontend should be running on http://localhost:3000
- frontend-dev-server should be running on http://localhost:3001

# Backend
## Boilerplate: FLASK RESTX BOILER-PLATE WITH JWT

Full description and guide [here](https://medium.freecodecamp.org/structuring-a-flask-restplus-web-service-for-production-builds-c2ec676de563)
## Usage
Note: make sure you have `pip` and `virtualenv` installed (If not using VM).

    Initial installation: make install

    To run test: make tests

    To run application: make run

    To run all commands at once : make all

Make sure to run the initial migration commands to update the database.

    `make migrate`
    
    OR
    
    > python manage.py db init

    > python manage.py db migrate --message 'initial database migration'

    > python manage.py db upgrade


## Viewing the app ###

    Open the following url on your browser to view swagger documentation
    http://127.0.0.1:5000/


### Using Insomnia (or Postman) ####

    Authorization header is in the following format:

    Key: Authorization
    Value: "token_generated_during_login"

    For testing authorization, url for getting all user requires an admin token while url for getting a single
    user by public_id requires just a regular authentication.

## API Keys
### Current Key Names
This is a list of all API keys used in our project. If you incorporate a new key, update this list with its name ONLY. Only update this list when your code has been pushed to master.
- EXAMPLE_API_KEY

In the /server folder, create a file named `server.env`:

```
├── server
│   └── server.env
```

This is a private file included in .gitignore. Ensure no keys are pushed to the repo.
Example file:

```
EXAMPLE_API_KEY_1="XXXXXXXXXX"
EXAMPLE_API_KEY_2="YYYYYYYYY"
```
### Loading keys from server.env within code
```python
# example_controller.py

import os
from dotenv import load_dotenv, find_dotenv

@api.route('/')
class Example(Resource):
    @api.response(200, 'Example endpoint succesfully fetched.')
    @api.doc('Fetch example data')
    def get(self):
        
        # Set all API keys in server.env as environment variables
        load_dotenv(find_dotenv('server.env'))
        EXAMPLE_API_KEY_1 = os.environ.get("EXAMPLE_API_KEY_1")
        print("EXAMPLE_API_KEY_1: ",  EXAMPLE_API_KEY_1)
```

# Frontend

Skeleton for fetching data from JSON db file served via an express server.

## frontend-dev-server endpoints
GET / - returns JSON object with contents of frontend-dev-server/db.json
# Collaboration

Collaboration will be managed via Github Projects. Three projects have been created [here](https://github.com/COMP9323-project/Software-as-a-Sevice-project-/projects):
- Frontend
- Backend
- Ops
