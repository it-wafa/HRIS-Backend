package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"hris-backend/config/db"
	"hris-backend/config/env"
	logger "hris-backend/config/log"
	"hris-backend/interface/http/router"
	"hris-backend/internal/utils"
	"hris-backend/internal/utils/data"
)

func init() {
	var err error
	var missing []string

	if missing, err = env.LoadNative(); err != nil {
		log.Fatalf("Failed to load environment variables: %v", err)
	}
	log.Printf("Environment variables by .env file loaded successfully")

	logger.SetupLogger()

	if len(missing) > 0 {
		for _, envVar := range missing {
			logger.Warn(data.LogEnvVarMissing, map[string]any{
				"service": data.EnvService,
				"env_var": envVar,
			})
		}
	}
}

// shutdownHTTP gracefully shuts down the HTTP server
func shutdownHTTP(app interface{ ShutdownWithTimeout(time.Duration) error }, errors map[string]any) {
	if app == nil {
		return
	}
	if err := app.ShutdownWithTimeout(30 * time.Second); err != nil {
		logger.Error(data.LogHTTPServerShutdownFailed, map[string]any{
			"service": data.HTTPServerService,
			"error":   err.Error(),
		})
		errors["http_error"] = true
	}
}

// shutdownInfra closes queue and database connections
func shutdownInfra(dbInstance db.DatabaseClient, errors map[string]any) {
	if err := dbInstance.Close(); err != nil {
		logger.Error(data.LogDBCloseFailed, map[string]any{
			"service": data.DatabaseService,
			"error":   err.Error(),
		})
		errors["database_error"] = true
	}
}

func main() {
	// ── Database ───────────────────────────────────────────────
	startTime := time.Now()
	dbInstance := db.GetInstance(env.Cfg.Database)
	logger.Info(data.LogDBSetupSuccess, map[string]any{
		"service":  data.DatabaseService,
		"duration": utils.Ms(time.Since(startTime)),
	})

	// ── HTTP Server ────────────────────────────────────────────
	startTime = time.Now()
	httpServer := router.SetupHTTPServer(dbInstance)
	if httpServer != nil {
		go func() {
			if err := httpServer.Listen(":" + env.Cfg.Server.HTTPPort); err != nil && err != http.ErrServerClosed {
				logger.Fatal(data.LogHTTPServerStartFailed, map[string]any{
					"service": data.HTTPServerService,
					"error":   err.Error(),
				})
			}
		}()
		logger.Info(data.LogHTTPServerStarted, map[string]any{
			"service":  data.HTTPServerService,
			"port":     env.Cfg.Server.HTTPPort,
			"duration": utils.Ms(time.Since(startTime)),
		})
	}

	// ── Wait for shutdown signal ───────────────────────────────
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info(data.LogShutdownSignalReceived, map[string]any{
		"service": data.MainService,
	})

	startTime = time.Now()
	shutdownErrors := map[string]any{"service": data.MainService}

	shutdownHTTP(httpServer, shutdownErrors)

	shutdownInfra(dbInstance, shutdownErrors)

	if len(shutdownErrors) > 1 {
		logger.Info(data.LogShutdownCompletedWithErrors, shutdownErrors)
	} else {
		logger.Info(data.LogShutdownCompleted, map[string]any{
			"service":  data.MainService,
			"duration": utils.Ms(time.Since(startTime)),
		})
	}
}
