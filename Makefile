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

# Build production API image locally (ARM64 - for EC2)
docker/build/api/prod:
	docker buildx build --platform linux/arm64 -f apps/api/Dockerfile --target production -t network-api:local --load .

# Build production API image locally (AMD64 - for local testing on x86)
docker/build/api/prod/amd64:
	docker buildx build --platform linux/amd64 -f apps/api/Dockerfile --target production -t network-api:local --load .

# Test the production API image locally
docker/test/api:
	docker run --rm -it \
		--env-file apps/api/.env \
		-p 3000:3000 \
		network-api:local

# Build and test in one command
docker/build-test/api: docker/build/api/prod/amd64 docker/test/api