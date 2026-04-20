package cache

import (
	"context"
	"fmt"
	"strconv"

	logger "hris-backend/config/log"

	"github.com/redis/go-redis/v9"
)

// RedisConfig holds the Redis connection parameters.
type RedisConfig struct {
	Host     string
	Port     string
	Password string
	DB       int
}

// NewRedisClient creates and pings a new Redis client.
func NewRedisClient(cfg RedisConfig) (*redis.Client, error) {
	endpoint := cfg.Host
	if cfg.Port != "" {
		endpoint = fmt.Sprintf("%s:%s", cfg.Host, cfg.Port)
	}

	client := redis.NewClient(&redis.Options{
		Addr:     endpoint,
		Password: cfg.Password,
		DB:       cfg.DB,
	})

	if err := client.Ping(context.Background()).Err(); err != nil {
		return nil, err
	}

	logger.Info("redis_connected", map[string]any{
		"service": "cache",
		"address": endpoint,
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
