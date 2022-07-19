start-frontend:
	make -C frontend start

start-backend:
	npx start-server -p 5001

start:
	make start-backend & make start-frontend

deploy:
	git push heroku main