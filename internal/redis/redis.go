package redis

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type Redis interface {
	// Get retrieves a cached value by key. Returns nil, nil if the key does not exist.
	Get(ctx context.Context, key string) ([]byte, error)

	// Set stores a value in the cache with the given TTL.
	Set(ctx context.Context, key string, value []byte, ttl time.Duration) error

	// Delete removes one or more specific keys from the cache.
	Delete(ctx context.Context, keys ...string) error

	// DeleteByPattern removes all keys matching the given glob pattern (e.g. "wallet:abc:*").
	DeleteByPattern(ctx context.Context, pattern string) error

	// Close gracefully shuts down the cache connection.
	Close() error
}


// redisCache implements the Redis interface using Redis.
type redisCache struct {
	client *redis.Client
}

// NewRedisInstance creates a new Redis-backed Redis implementation.
func NewRedisInstance(client *redis.Client) Redis {
	return &redisCache{client: client}
}

func (r *redisCache) Get(ctx context.Context, key string) ([]byte, error) {
	val, err := r.client.Get(ctx, key).Bytes()
	if err == redis.Nil {
		return nil, nil // cache miss
	}
	if err != nil {
		return nil, err
	}
	return val, nil
}

func (r *redisCache) Set(ctx context.Context, key string, value []byte, ttl time.Duration) error {
	return r.client.Set(ctx, key, value, ttl).Err()
}

func (r *redisCache) Delete(ctx context.Context, keys ...string) error {
	if len(keys) == 0 {
		return nil
	}
	return r.client.Del(ctx, keys...).Err()
}

func (r *redisCache) DeleteByPattern(ctx context.Context, pattern string) error {
	var cursor uint64
	for {
		keys, nextCursor, err := r.client.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return err
		}
		if len(keys) > 0 {
			if err := r.client.Del(ctx, keys...).Err(); err != nil {
				return err
			}
		}
		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}
	return nil
}

func (r *redisCache) Close() error {
	return r.client.Close()
}
