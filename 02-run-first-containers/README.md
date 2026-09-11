# 02 - Run Your First Containers

Command reference for [Run Your First Containers](https://www.techdevmantra.com/guides/run-your-first-docker-containers). This post is command-only (no application code); the container lifecycle is collected here for quick copy and paste. The full walkthrough is in the post.

## The container lifecycle

```bash
# start a container: detached (-d), with a published port (-p) and a name
docker run -d -p 8080:80 --name web nginx

# see it running
docker ps

# talk to it
curl localhost:8080

# read its logs
docker logs web

# get a shell inside it (or run a one-off command)
docker exec -it web sh
docker exec web whoami

# stop, start, and inspect stopped containers
docker stop web
docker ps -a          # includes stopped containers
docker start web

# remove it (-f stops and removes in one step)
docker rm -f web

# a throwaway container that cleans itself up on exit
docker run --rm alpine echo "hello from a throwaway container"
```
