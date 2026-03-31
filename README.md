# MovReview

One stop for all your movie tracking needs.

## Installation

Use the package manager to install all the required packages.

```bash
npm install
```

Import all .json files into a database of your choosing and setup config.env with the following:
```
DB= (insert DB key here)
SECRET= (generate a random secure key)
```

__Powershell Secret Key Generator__
```bash
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

__MacOS/Linux Secret Key Generator__
```bash
openssl rand -base64 64 | tr -d '+/' | head -c 64; echo
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