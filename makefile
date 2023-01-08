final:
	npm run build:js
	git add -A
	git commit -m "update"
	git push 

test:
	npm run build:js
	git add -A
	git commit -m "update"
	git push origin HEAD

