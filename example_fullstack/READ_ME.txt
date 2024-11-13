SET UP:

have node js installed

run the following in cmd:
npm install

run the following SQL in mySQL:
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

RUNNING:

to run type in cmd:
node index.js

INFORMATION:

index.js should be used for the WHOLE BACKEND
public/index.html should be used for the homepage for the FRONTEND and other html pages can be made in the public folder

right now it just lets users type in SQL... DO NOT ACTUALLY LET THEM
write functions that give parameters to the BACKEND and let the BACKEND form the sql itself
DO NOT LET THE FRONT END CREATE THE RAW SQL QUERIE

