FROM williamyeh/ansible:alpine3

# Update packages and install dependencies
RUN apk update && \
    apk add --no-cache docker python3 py3-pip && \
    pip3 install --upgrade pip setuptools && \
    apk add --no-cache python3-dev libffi-dev openssl-dev gcc libc-dev make rust cargo

# Install Docker Compose
RUN pip3 install docker-compose
