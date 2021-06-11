# Usage
1. Install docker
2. copy server.env and frontend.env into directory as follows:
```
.
├── frontend
│   ├── frontend.env
└── server
    ├── server.env
```
3. In base directory run `docker compose up`
4. Navigate to localhost:3000 for frontend, 0.0.0.0:5000 for backend (swagger)

# API Keys
Frontend keys will most likely be shared between us for now, however let's all individually keys for backend API integrations
so to not have to worry about rate limits etc.

- copy server.env and frontend.env into directory as follows:
```
.
├── frontend
│   ├── frontend.env
└── server
    ├── server.env
```

## Frontend 
### Required keys

- Auth0 domain key (`AUTH0_DOMAIN`)
- Auth0 client ID (`AUTH0_CLIENT_ID`)
### Access within code:
```javascript
// example.js
KEY_VALUE = window._env_.KEY_NAME
```
## Server 
### Required keys

- News API key (`NEWS_API_KEY`)
### Access within code:
```python
# examply.py
from dotenv import load_dotenv, find_dotenv
load_dotenv(find_dotenv('server.env'))
KEY_VALUE = os.environ.get("KEY_NAME")
```