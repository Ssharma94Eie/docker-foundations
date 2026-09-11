# 01 - Install Docker

Command reference for [Install Docker on macOS, Windows (WSL2), and Linux](https://www.techdevmantra.com/guides/install-docker-macos-windows-wsl2-linux). This post is command-only (no application code); the steps are collected here for quick copy and paste. The full walkthrough and gotchas are in the post.

## macOS (Docker Desktop)

Download Docker Desktop for your chip from the [official page](https://docs.docker.com/desktop/setup/install/mac-install/), drag it to Applications, open it, and wait for the whale icon to settle. Then verify:

```bash
docker --version
docker run hello-world
```

## Windows (Docker Desktop + WSL2)

In an elevated PowerShell:

```powershell
wsl --install        # then reboot if asked
wsl --version        # want 2.1.5 or later
```

Install [Docker Desktop for Windows](https://docs.docker.com/desktop/setup/install/windows-install/), choose the WSL2 backend, then verify from inside your WSL2 Linux shell:

```bash
docker --version
docker run hello-world
```

## Linux (Docker Engine, Ubuntu)

```bash
# add Docker's official apt repository
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# install the engine and plugins
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# run docker without sudo, then verify
sudo usermod -aG docker $USER
newgrp docker
docker run hello-world
```

Optional rootless mode is covered in the post.
