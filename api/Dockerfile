# Use the official Rust image from the Docker Hub
FROM rustlang/rust:nightly as builder

# Create a new directory in the container
WORKDIR /usr/src/api

# Copy the current directory contents into the container at /usr/src/api
COPY . .

# Build the project in release mode
RUN cargo build --release

# Start a new, final image to reduce size
FROM debian:buster-slim

# Copy the binary from the builder stage to the final stage
COPY --from=builder /usr/src/api/target/release/api /usr/local/bin/api

# Set the command to run your application when the docker container starts
CMD ["api"]