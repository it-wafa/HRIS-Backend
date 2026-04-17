package dto

import "time"

type OvertimeRequestResponse struct {
	ID              uint       `json:"id"`
	EmployeeID      uint       `json:"employee_id"`
	EmployeeName    *string    `json:"employee_name"`
	OvertimeDate    string     `json:"overtime_date"`
	AttendanceLogID *uint      `json:"attendance_log_id"`
	PlannedStart    *string    `json:"planned_start"`
	PlannedEnd      *string    `json:"planned_end"`
	PlannedMinutes  int        `json:"planned_minutes"`
	ActualStart     *string    `json:"actual_start"`
	ActualEnd       *string    `json:"actual_end"`
	ActualMinutes   *int       `json:"actual_minutes"`
	Location        string     `json:"location"` // office/home/outside
	Reason          string     `json:"reason"`
	Status          string     `json:"status"`
	ApproverID      *uint      `json:"approver_id"`
	ApproverName    *string    `json:"approver_name"`
	ApproverNotes   *string    `json:"approver_notes"`
	CreatedAt       time.Time  `json:"created_at"`
	UpdatedAt       *time.Time `json:"updated_at"`
}

type CreateOvertimeRequest struct {
	OvertimeDate    string  `json:"overtime_date"`
	AttendanceLogID *uint   `json:"attendance_log_id"`
	PlannedStart    *string `json:"planned_start"`
	PlannedEnd      *string `json:"planned_end"`
	PlannedMinutes  int     `json:"planned_minutes"`
	ActualStart     *string `json:"actual_start"`
	ActualEnd       *string `json:"actual_end"`
	ActualMinutes   *int    `json:"actual_minutes"`
	Location        string  `json:"location"`
	Reason          string  `json:"reason"`
}

type UpdateOvertimeStatusRequest struct {
	Status string  `json:"status"`
	Notes  *string `json:"notes"`
}

type OvertimeListParams struct {
	EmployeeID *uint   `query:"employee_id"`
	Status     *string `query:"status"`
	StartDate  *string `query:"start_date"`
	EndDate    *string `query:"end_date"`
}
