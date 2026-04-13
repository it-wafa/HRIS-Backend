package middleware

import (
	"strings"

	"hris-backend/config/env"
	"hris-backend/internal/struct/dto"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(fiber.StatusUnauthorized).JSON(dto.APIResponse{
				Status:     false,
				StatusCode: 401,
				Message:    "Authorization token is required",
			})
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			return c.Status(fiber.StatusUnauthorized).JSON(dto.APIResponse{
				Status:     false,
				StatusCode: 401,
				Message:    "Invalid authorization format",
			})
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(t *jwt.Token) (any, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fiber.NewError(fiber.StatusUnauthorized, "unexpected signing method")
			}
			return []byte(env.Cfg.Server.JWTSecret), nil
		})

		if err != nil || !token.Valid {
			return c.Status(fiber.StatusUnauthorized).JSON(dto.APIResponse{
				Status:     false,
				StatusCode: 401,
				Message:    "Invalid or expired token",
			})
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(fiber.StatusUnauthorized).JSON(dto.APIResponse{
				Status:     false,
				StatusCode: 401,
				Message:    "Invalid token claims",
			})
		}

		userData := dto.UserData{
			ID:    claims["id"].(string),
			Email: claims["email"].(string),
		}

		c.Locals("user_data", userData)
		return c.Next()
	}
}
