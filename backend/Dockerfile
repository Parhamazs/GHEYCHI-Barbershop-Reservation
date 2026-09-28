# Multi-stage Dockerfile for Golang Backend
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

COPY go.mod go.sum* ./
RUN go mod download

COPY . .

# Build statically linked binary
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/gheychi-api ./cmd/api

# Final minimal scratch-based runtime
FROM alpine:3.20

RUN apk --no-cache add ca-certificates tzdata

WORKDIR /root/

COPY --from=builder /app/gheychi-api .

EXPOSE 8080

CMD ["./gheychi-api"]
