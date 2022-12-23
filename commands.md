<!--! Connect to local host -->

1. run in a terminal:
   "brew services start mongodb-community@6.0"

2. check service is activated or not by running:
   "brew services"

3. Then try to connect through local host in an application

4. After all work close connection in terminal by running a command
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
