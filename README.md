# Ironhack-Final-Project

## Listado de Endopints API:

|Id|Method|Path|Description|
|---|---|---|---|
|1|Get|'/api/bookings'|Get all bookings.|
|2|Get|'/api/bookings/pending'|Get booking with pending approval.|
|3|Put|'/api/bookings/:_id'|Update one booking.|
|4|Post|'/api/bookings/new'|Create new booking.|
|5|Delete|'/api/bookings/:_id'|Delete one booking.|
|6|Get|'/api/users'|Get all users.|
|7|Put|'/api/users/:_id'|Update one user.|
|8|Post|'/api/users/new'|Create new user.|
|9|Delete|'/api/users/:_id'|Delete one user.|
|10|Get|'/api/occupancies'|Get all occupancies.|
|11|Post|'/api/occupancies/new'|Create new occupancy.|
|12|Put|'/api/occupancies/:_id'|Update one occupancy.|
|13|Delete|'/api/occupancies/:date'|Delete many occupancies.|
|14|Get|'/api/lessons/filter'|Get all lessons filtered by query (?startDate=*&endDate=*).|
|15|Post|'/api/lessons/new'|Create new lesson.|
|16|Put|'/api/lessons/:_id'|Update one lesson.|
|17|Delete|'/api/lessons/:_id'|Delete one lesson.|
|18|Get|'/api/meals/filter'|Get all meals filtered by query (?startDate=*&endDate=*).|
|19|Post|'/api/meals/new'|Create new meal.|
|20|Put|'/api/meals/:_id'|Update one meal.|
|21|Delete|'/api/meals/:_id'|Delete one meal.|
|22|Get|'/api/rates/'|Get all rates.|
|23|Get|'/api/rates/filter'|Get all rates filtered by query (?place=*&nights=*&season=*).|
|24|Post|'/api/rates/new'|Create new rates.|
|25|Put|'/api/rates/:_id'|Update one rate.|
|26|Delete|'/api/rates/:_id'|Delete one rate.|
|27|Post|'/api/auth/login'|User log in.|
|28|Post|'/api/auth/logout'|User log out.|
|29|Get|'/api/auth/loggedin'|Check if user is logged in.|