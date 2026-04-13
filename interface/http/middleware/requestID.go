package middleware

import (
	"hris-backend/internal/utils/data"

	"github.com/gofiber/fiber/v2"
	"github.com/rs/xid"
)

func RequestIDMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		requestID := c.Get(data.REQUEST_ID_HEADER)
		if requestID == "" {
			requestID = xid.New().String() + "-X"
		}

		c.Locals(data.REQUEST_ID_LOCAL_KEY, requestID)
		c.Set(data.REQUEST_ID_HEADER, requestID)

		return c.Next()
	}
}
