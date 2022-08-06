db_up: 
	docker compose --env-file=./.env up -d

db_down: 
	docker compose --env-file=./.env down

db_down_with_volume: 
	docker compose --env-file=./.env down -v