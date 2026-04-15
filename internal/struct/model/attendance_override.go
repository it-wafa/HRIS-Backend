package model

import (
	"time"

	"gorm.io/gorm"
)

type OverrideTypeEnum string

const (
	OverrideClockIn  OverrideTypeEnum = "clock_in"
	OverrideClockOut OverrideTypeEnum = "clock_out"
	OverrideBoth     OverrideTypeEnum = "both"
)

type AttendanceOverride struct {
	ID                uint              `gorm:"primaryKey;autoIncrement"               json:"id"`
	AttendanceLogID   uint              `gorm:"not null;index"                         json:"attendance_log_id"`
	RequestedBy       uint              `gorm:"not null;index"                         json:"requested_by"`
	ApprovedBy        *uint             `gorm:"index"                                  json:"approved_by"`
	OverrideType      OverrideTypeEnum  `gorm:"type:override_type_enum;not null"       json:"override_type"`
	OriginalClockIn   *time.Time        `                                              json:"original_clock_in"`
	OriginalClockOut  *time.Time        `                                              json:"original_clock_out"`
	CorrectedClockIn  *time.Time        `                                              json:"corrected_clock_in"`
	CorrectedClockOut *time.Time        `                                              json:"corrected_clock_out"`
	Reason            string            `gorm:"type:text;not null"                     json:"reason"`
	Status            RequestStatusEnum `gorm:"type:request_status_enum;not null;default:pending" json:"status"`
	CreatedAt         time.Time         `gorm:"not null;default:now()"                json:"created_at"`
	UpdatedAt         *time.Time        `                                              json:"updated_at"`
	DeletedAt         gorm.DeletedAt    `gorm:"index"                                  json:"deleted_at"`

	// Relations
	AttendanceLog AttendanceLog `gorm:"foreignKey:AttendanceLogID" json:"attendance_log,omitempty"`
	Requester     Employee      `gorm:"foreignKey:RequestedBy"     json:"requester,omitempty"`
	Approver      *Employee     `gorm:"foreignKey:ApprovedBy"      json:"approver,omitempty"`
}
