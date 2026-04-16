package route

import (
	"hris-backend/interface/http/handler"
	"hris-backend/interface/http/middleware"
	"hris-backend/internal/repository"
	"hris-backend/internal/service"
	"hris-backend/internal/utils/data"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func PositionRoutes(app *fiber.App, db *gorm.DB) {
	repo := repository.NewPositionRepository(db)
	h := handler.NewPositionHandler(service.NewPositionService(repo))

	positions := app.Group("/positions")
	{
		positions.Get("/metadata", h.Metadata)
		positions.Get("/", middleware.RBACMiddleware(data.PERM_PositionRead), h.List)
		positions.Post("/", middleware.RBACMiddleware(data.PERM_PositionCreate), h.Create)
		positions.Put("/:id", middleware.RBACMiddleware(data.PERM_PositionUpdate), h.Update)
		positions.Delete("/:id", middleware.RBACMiddleware(data.PERM_PositionDelete), h.Delete)
	}
}
