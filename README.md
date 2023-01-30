# TOKEN PAIRS

Connects to Uniswap graph api and retrieves all pairs, synchronizes them to a local database.

## Setup
- ``git clone https://github.com/AshakaE/token-pairs.git``
-  ``cd token-pairs``   
- Run ``yarn``
- Fill out the rest of the envs in a `.env` file
```yml
PORT= {{ port for server to listen on }}
DATABASE_USERNAME= {{ database user }}
DATABASE_HOST= {{ Database host }}
DATABASE_PASS= {{ Database password }}
DATABASE_NAME= {{ where data will be stored }}
REQUEST_URL='https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'
```
- Run ``yarn build`` &&  ``yarn start``