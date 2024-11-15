if modules are missing run: npm i

to start the project: npm run devStart
then go to localhost:3000 in a browser

for a test login, use the following sql:
use db_name;
insert into useraccount (accountId, name, balance) VALUES ('123','James',100.10);
insert into usercard (accountId, cardId, PIN) VALUES ('123','456','dog');