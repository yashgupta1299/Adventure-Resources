### Connect to local host

1.a run in a terminal:
"brew services start mongodb-community@6.0"

1.b check service is activated or not by running:
"brew services"

1.c you can also run you connection in a terminal by:
"mongosh"

1.d Then try to connect through local host in an application

1.e After all work close connection in terminal by running a command
"brew services stop mongodb-community@6.0"

### installing package

2.a "npm install <%packageName%>"
or "npm i <%packageName%>"

2.b Install only dependencies
"npm install --omit=dev"

2.c Install only dev-dependencies
"npm install --only=dev"

2.d Install all
"npm install"

### running a script

3.a if package.json have start script
"npm start"
3.b In general
"npm run <%scriptName%>"

### update a package

4.a check outdated packages from package.json
"npm outdated"

4.b to update package
"npm update"

4.c to update a single dependency
"npm update <%packageName>"

4.d To update package.json version numbers, append the --save flag:
"npm update --save"

4.e To update all packages in package.json irrespective of its tag:
install:
"npm i -g npm-check-updates"

    change all package to latest version in package.json by:
    "ncu -u"
    or replace their version with "\*"

    install package according to package.json by:
    "npm install"

    then if you used "\*" then you have to update package.json
    according to latest version by running:
    "npm update --save"

### import and delete all data in a database [custom command]

5.a firt comment pre query of hash password in "/models/userModel"
A = import or delete
B = local or cloud
note: choosing first character also work
run: "node dbReset.js <%A%> <%B%>"

5.b A = import or delete
B = tours or users or reviews
C = local or cloud
note: choosing first character also work
"node dbconfig.js <%A%> <%B%> <%C%>"

### some commands

6.a delete last commit reset head to its preveios state
"git reset --hard HEAD~1"

6.b Remove directory from Git but NOT local
"git rm -r --cached myFolder"
