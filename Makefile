build:
	npm run build

start-dev:
	npm run start-dev & make start-frontend

start-frontend:
	make -C frontend start

start-backend:
	npm run start

start:
	make start-backend & make start-frontend

deploy:
	git push heroku main