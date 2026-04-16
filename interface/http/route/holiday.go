package route

import (
	"hris-backend/interface/http/middleware"
	"hris-backend/internal/struct/dto"
	"hris-backend/internal/utils/data"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func HolidayRoutes(app *fiber.App, db *gorm.DB) {
	holidays := app.Group("/holidays")
	{
		holidays.Get("/metadata", func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Holiday metadata", Data: map[string]any{}})
		})
		holidays.Get("/", middleware.RBACMiddleware(data.PERM_HolidayRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Holiday list", Data: []any{}})
		})
		holidays.Get("/:id", middleware.RBACMiddleware(data.PERM_HolidayRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Holiday detail", Data: map[string]any{}})
		})
		holidays.Post("/", middleware.RBACMiddleware(data.PERM_HolidayCreate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 201, Message: "Holiday created"})
		})
		holidays.Put("/:id", middleware.RBACMiddleware(data.PERM_HolidayUpdate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Holiday updated"})
		})
		holidays.Delete("/:id", middleware.RBACMiddleware(data.PERM_HolidayDelete), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Holiday deleted"})
		})
	}
}
