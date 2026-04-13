package cache

import (
	"context"
	"strconv"

	logger "hris-backend/config/log"

	"github.com/redis/go-redis/v9"
)

// RedisConfig holds the Redis connection parameters.
type RedisConfig struct {
	Address  string
	Password string
	DB       int
}

// NewRedisClient creates and pings a new Redis client.
func NewRedisClient(cfg RedisConfig) (*redis.Client, error) {
	client := redis.NewClient(&redis.Options{
		Addr:     cfg.Address,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}

	logger.Info("redis_connected", map[string]any{
		"service": "cache",
		"address": cfg.Address,
		"db":      cfg.DB,
	})

	return client, nil
}

// ParseRedisDB converts a string DB number to int, defaulting to 0.
func ParseRedisDB(s string) int {
	if s == "" {
		return 0
	}
	db, err := strconv.Atoi(s)
	if err != nil {
		return 0
	}
	return db
}
