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

func DepartmentRoutes(app *fiber.App, db *gorm.DB) {
	repo := repository.NewDepartmentRepository(db)
	h := handler.NewDepartmentHandler(service.NewDepartmentService(repo))

	departments := app.Group("/departments")
	{
		departments.Get("/metadata", h.Metadata)
		departments.Get("/", middleware.RBACMiddleware(data.PERM_DepartmentRead), h.List)
		departments.Get("/:id", middleware.RBACMiddleware(data.PERM_DepartmentRead), h.Detail)
		departments.Post("/", middleware.RBACMiddleware(data.PERM_DepartmentCreate), h.Create)
		departments.Put("/:id", middleware.RBACMiddleware(data.PERM_DepartmentUpdate), h.Update)
		departments.Delete("/:id", middleware.RBACMiddleware(data.PERM_DepartmentDelete), h.Delete)
	}
}
