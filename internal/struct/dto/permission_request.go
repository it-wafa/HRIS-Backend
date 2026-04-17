package dto

import "time"

type PermissionRequestResponse struct {
	ID             uint       `json:"id"`
	EmployeeID     uint       `json:"employee_id"`
	EmployeeName   *string    `json:"employee_name"`
	Date           string     `json:"date"`
	PermissionType string     `json:"permission_type"` // late_arrival, early_leave, out_of_office
	StartTime      string     `json:"start_time"`
	EndTime        string     `json:"end_time"`
	Duration       int        `json:"duration"` // in minutes
	Reason         string     `json:"reason"`
	DocumentURL    *string    `json:"document_url"`
	Status         string     `json:"status"` // pending, approved, rejected
	ApproverID     *uint      `json:"approver_id"`
	ApproverName   *string    `json:"approver_name"`
	ApproverNotes  *string    `json:"approver_notes"`
	CreatedAt      time.Time  `json:"created_at"`
	UpdatedAt      *time.Time `json:"updated_at"`
}

type CreatePermissionRequest struct {
	Date           string  `json:"date"`
	PermissionType string  `json:"permission_type"`
	StartTime      string  `json:"start_time"`
	EndTime        string  `json:"end_time"`
	Duration       int     `json:"duration"`
	Reason         string  `json:"reason"`
	DocumentURL    *string `json:"document_url"`
}

type UpdatePermissionStatusRequest struct {
	Status string  `json:"status"`
	Notes  *string `json:"notes"`
}

type PermissionListParams struct {
	EmployeeID *uint   `query:"employee_id"`
	Status     *string `query:"status"`
	StartDate  *string `query:"start_date"`
	EndDate    *string `query:"end_date"`
}

type RequestMetadata struct {
	PermissionTypeMeta []Meta `json:"permission_type_meta"`
	WorkLocationMeta   []Meta `json:"work_location_meta"`
	StatusMeta         []Meta `json:"status_meta"`
	EmployeeMeta       []Meta `json:"employee_meta"`
}
