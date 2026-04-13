package data

// Service field logging constants
const (
	MainService       = "main"
	EnvService        = "env"
	DatabaseService   = "database"
	RabbitmqService   = "rabbitmq"
	GRPCClientService = "grpc_client"
	GRPCServerService = "grpc_server"
	HTTPServerService = "http_server"
	OutboxService     = "outbox"
	WalletService     = "wallet"
	WalletTypeService = "wallet_type"
	RedisService      = "redis"
)

// Message field logging constants
const (
	// --- env / startup ---
	LogEnvVarMissing = "env_var_missing"

	// --- infrastructure setup ---
	LogDBSetupSuccess       = "db_setup_success"

	// cache / redis
	LogRedisSetupFailed    = "redis_setup_failed"
	LogRedisSetupSuccess   = "redis_setup_success"
	LogRedisCloseFailed    = "redis_close_failed"
	LogCacheHit            = "cache_hit"
	LogCacheMiss           = "cache_miss"
	LogCacheSetFailed      = "cache_set_failed"
	LogCacheGetFailed      = "cache_get_failed"
	LogCacheInvalidated    = "cache_invalidated"
	LogCacheInvalidateFail = "cache_invalidate_failed"

	// --- http server ---
	LogHTTPServerStarted        = "http_server_started"
	LogHTTPServerStartFailed    = "http_server_start_failed"
	LogHTTPServerShutdownFailed = "http_server_shutdown_failed"

	// --- shutdown ---
	LogShutdownSignalReceived      = "shutdown_signal_received"
	LogShutdownCompleted           = "shutdown_completed"
	LogShutdownCompletedWithErrors = "shutdown_completed_with_errors"
	LogDBCloseFailed               = "db_close_failed"
)
