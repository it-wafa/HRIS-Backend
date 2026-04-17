package handler

import (
	"hris-backend/internal/struct/dto"

	"github.com/gofiber/fiber/v2"
)

// getAccountFromCtx — ambil account dari context (di-set oleh AuthMiddleware)
func getAccountFromCtx(c *fiber.Ctx) dto.GetEmployeeByIDResponse {
	account, _ := c.Locals("account").(dto.GetEmployeeByIDResponse)
	return account
}

func respondBadRequest(c *fiber.Ctx, msg string) error {
	return c.Status(fiber.StatusBadRequest).JSON(dto.APIResponse{
		Status:     false,
		StatusCode: fiber.StatusBadRequest,
		Message:    msg,
	})
}

func respondError(c *fiber.Ctx, err error) error {
	return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
		Status:     false,
		StatusCode: fiber.StatusInternalServerError,
		Message:    err.Error(),
	})
}
