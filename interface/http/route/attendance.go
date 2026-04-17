package route

import (
	"hris-backend/config/storage"
	"hris-backend/interface/http/handler"
	"hris-backend/interface/http/middleware"
	"hris-backend/internal/repository"
	"hris-backend/internal/service"
	"hris-backend/internal/utils/data"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AttendanceRoutes(app *fiber.App, db *gorm.DB, minio storage.MinioClient) {
	repo := repository.NewAttendanceRepository(db)
	txManager := repository.NewTxManager(db)
	svc := service.NewAttendanceService(repo, txManager, minio)
	h := handler.NewAttendanceHandler(svc)

	attendance := app.Group("/attendance")
	{
		// Pegawai: status hari ini
		attendance.Get("/today", h.GetTodayStatus)

		// Pegawai: presign upload foto
		attendance.Post("/presign", h.PresignClockPhoto)

		// Pegawai: signed download URL untuk foto
		attendance.Get("/photo", h.GetPhotoURL)

		// Pegawai: clock in / clock out
		attendance.Post("/clock-in", h.ClockIn)
		attendance.Post("/clock-out", h.ClockOut)

		// Admin: daftar semua presensi
		attendance.Get("/", middleware.RBACMiddleware(data.PERM_AttendanceRead), h.List)
	}
}
