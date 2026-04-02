# MovReview

One stop for all your movie tracking needs.

## Installation

Use the package manager to install all the required packages.

```bash
npm install
```

Import all .json files into a database of your choosing. Ensure each .json file being uploaded is to their respective collection name.  
Example: movies.json => movies (collection name)  
  
Setup config.env with the following:
```
DB= mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTERADDRESS>/<DBNAME>?retryWrites=true&w=majority
SECRET= kewjfiwhwfjjweeg243r2435wfvq
```

## Usage

Start localhost by running:
```javascript
nodemon server.js
```

Open browser and visit http://localhost:8000/

## Sample Users and Passwords
__Admin__
```
email: admin@gmail.com
password: 1234567890
```
__User1__
```
email: user1@gmail.com
password: 12345
```

## Contributions
Register & Login (Accounts): Hong Liang  
Home (Movie List): Dikshaa  
Rating: Noah  
Review: Cesar  
Watched List: Minh  
Watchlist: Yashvardhan

## AI/LLM Declaration
1. Primarily used for explaining coding errors and debugging hints with code snippets
2. Retrieved 100 dataset of movies from a ~39K dataset of real movies from Kaggle.
3. Randomly generated 7 accounts' watched movies, watchlist, as well as their ratings and reviews for the movies.
4. Helped with making the front-end look better and cleaner.