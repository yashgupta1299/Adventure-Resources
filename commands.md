### Connect to local host (works on proxy server also)

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
"git merge -s recursive -X theirs --squash test1"

### Instructions to again start

1. As our API and frontend is hosted on same place hence we can call ourAPI from frontend with relative url also means we can from this
   "http://127.0.0.1:3000/api/v1/users/login"
   to this
   "/api/v1/users/login"

2. hosted app:
   "https://adventure.up.railway.app"
   "https://adventure-authentication.up.railway.app"

3. while restarting note thungs to be change in
   webhook on stripe and google outh url from callback url from .env file and on google credential website.

4. in cookie Secure inside .env epmty string for false non empty string for true

5. Inside frontend authentication.js update urlDomain as process.env.AUTHENTICATION_DOMAIN value

## proxy for git

1. Change proxyuser to your proxy user
2. change proxypwd to your proxy password
3. change proxy.server.com to the URL of your proxy server
4. change 8080 to the proxy port configured on your proxy server
   Note that this works for both http and https repos.
   "git config --global http.proxy http://proxyuser:proxypwd@proxy.server.com:8080"

5. If you decide at any time to reset this proxy and work without proxy:
   "git config --global --unset http.proxy"

6. Finally, to check the currently set proxy:
   "git config --global --get http.proxy"

## environment proxy

1. Source of truth for environment proxy
   "env | grep -i proxy"

2. can change this to other proxy or remove proxy like
   "HTTPS_PROXY="
