package dto

import "time"

type PositionResponse struct {
	ID             uint       `json:"id"`
	Title          string     `json:"title"`
	DepartmentID   *uint      `json:"department_id"`
	DepartmentName *string    `json:"department_name"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      *time.Time `json:"updated_at"`
}

type CreatePositionRequest struct {
	Title        string `json:"title"`
	DepartmentID *uint  `json:"department_id"`
}

type UpdatePositionRequest struct {
	Title        *string `json:"title"`
	DepartmentID *uint   `json:"department_id"`
}

type PositionMetadata struct {
	DepartmentMeta []Meta `json:"department_meta"`
}
