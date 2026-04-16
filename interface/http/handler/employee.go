package handler

import (
	"hris-backend/internal/service"
	"hris-backend/internal/struct/dto"

	"github.com/gofiber/fiber/v2"
)

type EmployeeHandler struct {
	service service.EmployeeService
}

func NewEmployeeHandler(service service.EmployeeService) *EmployeeHandler {
	return &EmployeeHandler{
		service: service,
	}
}

func (h *EmployeeHandler) Metadata(c *fiber.Ctx) error {
	result, err := h.service.GetMetadata(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 200,
		Message:    "Employee metadata",
		Data:       result,
	})
}

func (h *EmployeeHandler) List(c *fiber.Ctx) error {
	result, err := h.service.GetAllEmployees(c.Context())
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 200,
		Message:    "Employee list",
		Data:       result,
	})
}

func (h *EmployeeHandler) Detail(c *fiber.Ctx) error {
	id := c.Params("id")
	result, err := h.service.GetEmployeeByID(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 200,
		Message:    "Employee detail",
		Data:       result,
	})
}

func (h *EmployeeHandler) Create(c *fiber.Ctx) error {
	var input dto.CreateEmployeeRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	newEmployee, newCredentials, err := h.service.CreateEmployee(c.Context(), input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 201,
		Message:    "Employee created",
		Data: map[string]any{
			"employee":    newEmployee,
			"credentials": newCredentials,
		},
	})
}

func (h *EmployeeHandler) Update(c *fiber.Ctx) error {
	var input dto.UpdateEmployeeRequest
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusBadRequest,
			Message:    err.Error(),
		})
	}

	id := c.Params("id")
	result, err := h.service.UpdateEmployee(c.Context(), id, input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 200,
		Message:    "Employee updated",
		Data:       result,
	})
}

func (h *EmployeeHandler) Delete(c *fiber.Ctx) error {
	id := c.Params("id")
	err := h.service.DeleteEmployee(c.Context(), id)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(dto.APIResponse{
			Status:     false,
			StatusCode: fiber.StatusInternalServerError,
			Message:    err.Error(),
		})
	}

	return c.JSON(dto.APIResponse{
		Status:     true,
		StatusCode: 200,
		Message:    "Employee deleted",
	})
}

// Contacts
func (h *EmployeeHandler) ListContacts(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contact list", Data: []any{}})
}
func (h *EmployeeHandler) CreateContact(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 201, Message: "Contact created", Data: map[string]any{}})
}
func (h *EmployeeHandler) UpdateContact(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contact updated", Data: map[string]any{}})
}
func (h *EmployeeHandler) DeleteContact(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contact deleted"})
}

// Contracts
func (h *EmployeeHandler) ListContracts(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contract list", Data: []any{}})
}
func (h *EmployeeHandler) CreateContract(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 201, Message: "Contract created", Data: map[string]any{}})
}
func (h *EmployeeHandler) UpdateContract(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contract updated", Data: map[string]any{}})
}
func (h *EmployeeHandler) DeleteContract(c *fiber.Ctx) error {
	return c.JSON(dto.APIResponse{Status: true, StatusCode: 200, Message: "Contract deleted"})
}
