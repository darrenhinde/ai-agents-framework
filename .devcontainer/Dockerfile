FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Install global packages
RUN npm install -g turbo typescript

# Set up non-root user
USER node

# Set up shell
SHELL ["/bin/bash", "-c"]

# Set working directory
WORKDIR /workspace 