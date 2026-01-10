docker/up/dev:
	docker compose -f docker-compose-dev.yml up;

docker/down/dev:
	docker compose -f docker-compose-dev.yml down --rmi local --remove-orphans --volumes

docker/up/local-prod:
	docker compose -f docker-compose-dev.yml -f docker-compose-local-prod.yml up;

docker/down/local-prod:
	docker compose -f docker-compose-dev.yml -f docker-compose-local-prod.yml down --rmi local --remove-orphans --volumes

docker/up/prod:
	docker compose -f docker-compose.yml up;

docker/down/prod:
	docker compose  -f docker-compose.yml down --rmi local --remove-orphans --volumes

docker/rebuild/dev:
	npm run build
	docker compose -f docker-compose-dev.yml up --build;

docker/rebuild/prod:
	docker compose -f docker-compose.yml build --no-cache;