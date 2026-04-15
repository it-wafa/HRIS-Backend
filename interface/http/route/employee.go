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

func EmployeeRoutes(app *fiber.App, db *gorm.DB) {
	repo := repository.NewEmployeeRepository(db)
	txManager := repository.NewTxManager(db)
	h := handler.NewEmployeeHandler(service.NewEmployeeService(repo, txManager))

	employees := app.Group("/employees")
	{
		employees.Get("/metadata", h.Metadata)
		employees.Get("/", middleware.RBACMiddleware(data.PERM_EmployeeRead), h.List)
		employees.Get("/:id", middleware.RBACMiddleware(data.PERM_EmployeeRead), h.Detail)
		employees.Post("/", middleware.RBACMiddleware(data.PERM_EmployeeCreate), h.Create)
		employees.Put("/:id", middleware.RBACMiddleware(data.PERM_EmployeeUpdate), h.Update)
		employees.Delete("/:id", middleware.RBACMiddleware(data.PERM_EmployeeDelete), h.Delete)
	}
}
