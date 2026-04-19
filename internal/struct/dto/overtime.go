package dto

import "time"

type OvertimeRequestResponse struct {
	ID               uint       `json:"id"`
	EmployeeID       uint       `json:"employee_id"`
	EmployeeName     *string    `json:"employee_name"`
	AttendanceLogID  *uint      `json:"attendance_log_id"`
	OvertimeDate     string     `json:"overtime_date"`
	PlannedStart     *time.Time `json:"planned_start"`
	PlannedEnd       *time.Time `json:"planned_end"`
	ActualStart      *time.Time `json:"actual_start"`
	ActualEnd        *time.Time `json:"actual_end"`
	PlannedMinutes   int        `json:"planned_minutes"`
	ActualMinutes    *int       `json:"actual_minutes"`
	Reason           string     `json:"reason"`
	WorkLocationType string     `json:"work_location_type"`
	Status           string     `json:"status"`
	ApprovedBy       *uint      `json:"approved_by"`
	ApproverName     *string    `json:"approver_name"`
	ApproverNotes    *string    `json:"approver_notes"`
	CreatedAt        time.Time  `json:"created_at"`
	UpdatedAt        *time.Time `json:"updated_at"`
	DeletedAt        *time.Time `json:"deleted_at"`
}

type CreateOvertimeRequest struct {
	AttendanceLogID  *uint   `json:"attendance_log_id"`
	OvertimeDate     string  `json:"overtime_date"`
	PlannedStart     *string `json:"planned_start"`
	PlannedEnd       *string `json:"planned_end"`
	PlannedMinutes   int     `json:"planned_minutes"`
	Reason           string  `json:"reason"`
	WorkLocationType string  `json:"work_location_type"`
}

type UpdateOvertimeStatusRequest struct {
	Status string  `json:"status"`
	Notes  *string `json:"approver_notes"`
}

type OvertimeListParams struct {
	EmployeeID *uint   `query:"employee_id"`
	Status     *string `query:"status"`
	StartDate  *string `query:"start_date"`
	EndDate    *string `query:"end_date"`
}
