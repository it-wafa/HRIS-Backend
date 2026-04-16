package route

import (
	"hris-backend/interface/http/middleware"
	"hris-backend/internal/struct/dto"
	"hris-backend/internal/utils/data"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func ShiftRoutes(app *fiber.App, db *gorm.DB) {
	shifts := app.Group("/shifts")
	{
		shifts.Get("/metadata", func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift metadata", Data: map[string]any{}})
		})
		shifts.Get("/", middleware.RBACMiddleware(data.PERM_ShiftRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift template list", Data: []any{}})
		})
		shifts.Get("/:id", middleware.RBACMiddleware(data.PERM_ShiftRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift template detail", Data: map[string]any{}})
		})
		shifts.Post("/", middleware.RBACMiddleware(data.PERM_ShiftCreate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 201, Message: "Shift template created"})
		})
		shifts.Put("/:id", middleware.RBACMiddleware(data.PERM_ShiftUpdate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift template updated"})
		})
		shifts.Delete("/:id", middleware.RBACMiddleware(data.PERM_ShiftDelete), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift template deleted"})
		})
		shifts.Get("/:id/details", middleware.RBACMiddleware(data.PERM_ShiftRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Shift details list", Data: []any{}})
		})
	}

	schedules := app.Group("/schedules")
	{
		schedules.Get("/", middleware.RBACMiddleware(data.PERM_ShiftRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Schedule list", Data: []any{}})
		})
		schedules.Get("/:id", middleware.RBACMiddleware(data.PERM_ShiftRead), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Schedule detail", Data: map[string]any{}})
		})
		schedules.Post("/", middleware.RBACMiddleware(data.PERM_ShiftCreate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 201, Message: "Schedule created"})
		})
		schedules.Put("/:id", middleware.RBACMiddleware(data.PERM_ShiftUpdate), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Schedule updated"})
		})
		schedules.Delete("/:id", middleware.RBACMiddleware(data.PERM_ShiftDelete), func(c *fiber.Ctx) error {
			return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Schedule deleted"})
		})
	}
}
