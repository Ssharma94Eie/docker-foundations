.PHONY: all naive slim sizes history clean

all: naive slim sizes

naive:
	docker build -f Dockerfile.naive -t demo-api:naive .

slim:
	docker build -f Dockerfile -t demo-api:slim .

sizes:
	docker images demo-api --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}"

history:
	docker history demo-api:slim

clean:
	docker rmi demo-api:naive demo-api:slim
