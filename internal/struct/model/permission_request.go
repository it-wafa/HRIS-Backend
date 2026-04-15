package model

import (
	"time"

	"gorm.io/gorm"
)

type (
	PermissionTypeEnum string
	RequestStatusEnum  string
)

const (
	PermissionTypeLate       PermissionTypeEnum = "late"
	PermissionTypeEarlyLeave PermissionTypeEnum = "early_leave"
	PermissionTypeAbsent     PermissionTypeEnum = "absent"
)

const (
	RequestStatusPending  RequestStatusEnum = "pending"
	RequestStatusApproved RequestStatusEnum = "approved"
	RequestStatusRejected RequestStatusEnum = "rejected"
	RequestStatusCanceled RequestStatusEnum = "canceled"
)

type PermissionRequest struct {
	ID             uint               `gorm:"primaryKey;autoIncrement"          json:"id"`
	EmployeeID     uint               `gorm:"not null;index"                    json:"employee_id"`
	PermissionType PermissionTypeEnum `gorm:"type:permission_type_enum;not null" json:"permission_type"`
	Date           time.Time          `gorm:"type:date;not null"                json:"date"`
	LeaveTime      *string            `gorm:"type:time"                         json:"leave_time"`
	ReturnTime     *string            `gorm:"type:time"                         json:"return_time"`
	Reason         string             `gorm:"type:text;not null"                json:"reason"`
	DocumentURL    *string            `gorm:"type:text"                         json:"document_url"`
	Status         RequestStatusEnum  `gorm:"type:request_status_enum;not null;default:pending" json:"status"`
	ApprovedBy     *uint              `gorm:"index"                             json:"approved_by"`
	ApproverNotes  *string            `gorm:"type:text"                         json:"approver_notes"`
	CreatedAt      time.Time          `gorm:"not null;default:now()"           json:"created_at"`
	UpdatedAt      *time.Time         `                                         json:"updated_at"`
	DeletedAt      gorm.DeletedAt     `gorm:"index"                             json:"deleted_at"`

	// Relations
	Employee Employee  `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	Approver *Employee `gorm:"foreignKey:ApprovedBy" json:"approver,omitempty"`
}
