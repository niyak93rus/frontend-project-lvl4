install:
	npm install

build:
	npm run build

start-dev:
	npm run start-dev & make start-frontend

start-frontend:
	make -C frontend start

start-backend:
	npx start-server

start:
	make start-backend & make start-frontend

deploy:
	git push heroku main