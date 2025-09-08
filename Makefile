docker/up:
	docker compose -f docker-compose-dev.yml up;

docker/down:
	docker compose  -f docker-compose-dev.yml down --rmi local --remove-orphans --volumes

docker/rebuild:
	docker compose -f docker-compose-dev.yml up --build;