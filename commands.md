<!--! Connect to local host -->

1. run in a terminal:
   "brew services start mongodb-community@6.0"

2. check service is activated or not by running:
   "brew services"

3. you can also run you connection in a terminal by:
   "mongosh"

4. Then try to connect through local host in an application

5. After all work close connection in terminal by running a command
   "brew services stop mongodb-community@6.0"

<!--! installing package -->

1. "npm install <%packageName%>"
   or "npm i <%packageName%>"

2. Install only dependencies
   "npm install --omit=dev"

3. Install only dev-dependencies
   "npm install --only=dev"

4. Install all
   "npm install"

<!--! running a script -->

1. if package.json have start script
   "npm start"
2. In general
   "npm run <%scriptName%>"

<!--! update a package -->

1. check outdated packages from package.json
   "npm outdated"

2. to update package
   "npm update"

3. to update a single dependency
   "npm update <%packageName>"

4. To update package.json version numbers, append the --save flag:
   "npm update --save"

5. To update all packages in package.json irrespective of its tag:
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

<!--! import and delete all data in a database [custom command] -->

1. firt comment pre query of hash password in "/models/userModel"
   A = import or delete
   B = local or cloud
   note: choosing first character also work
   run: "node dbReset.js <%A%> <%B%>"

2. A = import or delete
   B = tours or users or reviews
   C = local or cloud
   note: choosing first character also work
   "node dbconfig.js <%A%> <%B%> <%C%>"
