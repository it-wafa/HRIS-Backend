package dto

import "time"

type BusinessTripRequestResponse struct {
	ID            uint       `json:"id"`
	EmployeeID    uint       `json:"employee_id"`
	EmployeeName  *string    `json:"employee_name"`
	StartDate     string     `json:"start_date"`
	EndDate       string     `json:"end_date"`
	Destination   string     `json:"destination"`
	Purpose       string     `json:"purpose"`
	DocumentURL   *string    `json:"document_url"`
	Status        string     `json:"status"`
	ApproverID    *uint      `json:"approver_id"`
	ApproverName  *string    `json:"approver_name"`
	ApproverNotes *string    `json:"approver_notes"`
	CreatedAt     time.Time  `json:"created_at"`
	UpdatedAt     *time.Time `json:"updated_at"`
}

type CreateBusinessTripRequest struct {
	StartDate   string  `json:"start_date"`
	EndDate     string  `json:"end_date"`
	Destination string  `json:"destination"`
	Purpose     string  `json:"purpose"`
	DocumentURL *string `json:"document_url"`
}

type UpdateBusinessTripStatusRequest struct {
	Status string  `json:"status"`
	Notes  *string `json:"notes"`
}

type BusinessTripListParams struct {
	EmployeeID *uint   `query:"employee_id"`
	Status     *string `query:"status"`
	StartDate  *string `query:"start_date"`
	EndDate    *string `query:"end_date"`
}
