build:
	npm run build

start-frontend:
	make -C frontend start

start-backend:
	npx start-server -p 5000

start:
	make start-backend & make start-frontend

deploy:
	git push heroku main