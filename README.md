# VM (Optional)

1. Obtain a license (free for CSE students) and download Vmware Fusion Pro (mac) or Vmware Workstation Pro/player (windows) [here](https://e5.onthehub.com/WebStore/Welcome.aspx?ws=7c113c30-5d8b-de11-8cd1-0030487d8897)

2. Download and run the prebuilt VM available [here](https://www.dropbox.com/s/fyofpn7mv7o74rm/COMP9323.ova?dl=0). Password for VM is `COMP9323`

If you have issues installing or using the VMWare software, then use VirtualBox as a free alternative.
- VirtualBox Installation [guide](https://wikis.utexas.edu/display/MSBTech/Installing+VirtualBox)
- Installing OVA files in VirtualBox [guide](https://wikis.utexas.edu/display/MSBTech/Installing+OVA+files+using+VirtualBox)

## Tutorial
Very brief walkthrough [here](https://www.dropbox.com/s/ehvi9vrj7myk3qg/9323_vm_tutorial.mov?dl=0). Download for better quality.

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

## science-parse

Scientific paper parsing library used for parsing PDFs. Taken from [here](https://github.com/stoposto/science-parse) which is a fork of [science-parse](https://github.com/allenai/science-parse). Due to high resource usage and operational overhead required to provide a reliable local instance for team members, it has been deployed[here](http://SPV1-Scienc-C3GW28LU2S2X-1391134067.eu-north-1.elb.amazonaws.com/) on a load balanced AWS ECS service.
### Deployment

To deploy yourself(not required):

0. Install and configure [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)
1. install [aws cdk](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html#getting_started_install)
2. Navigate to ./science-parse/cdk 
3. Run `cdk deploy`
## Resources

- [TDD](https://testdriven.io/test-driven-development/)
- [Unittest](https://docs.python.org/3/library/unittest.html)
- [API design](https://swagger.io/resources/articles/best-practices-in-api-design/)
- [Flask-SQLAlchemy](https://docs.sqlalchemy.org/en/14/)
- [ORM](https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping)
- [Using Git](https://github.com/UofTCoders/studyGroup/tree/gh-pages/lessons/git)

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
For IBM-Watson, in addition to the API key (IBM_WATSON_API_KEY), the service provider also generates a specific URL.
Please store it together with the API key: IBM_WATSON_URL="XXXXX"
The slideshow illustrating how to obtain IBM-Watson credentials is in Teams, Resources channel, Files.

For the MEANING CLOUD the name of the key is MEANING_CLOUD. It could be obtained at https://www.meaningcloud.com/developer/summarization/dev-tools/1.0


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

# Collaboration

Collaboration will be managed via Github Projects. Three projects have been created [here](https://github.com/COMP9323-project/Software-as-a-Sevice-project-/projects):
- Frontend
- Backend
- Ops
