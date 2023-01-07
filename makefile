final:
	parcel build ./public/js/index.js --dist-dir ./public/js/bundle --public-url js
	git add -A
	git commit -m "update"
	git push origin HEAD
