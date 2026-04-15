package model

import (
	"time"

	"gorm.io/gorm"
)

type LeaveBalance struct {
	ID              uint           `gorm:"primaryKey;autoIncrement"                                        json:"id"`
	EmployeeID      uint           `gorm:"not null;index;uniqueIndex:uq_leave_balance"                     json:"employee_id"`
	LeaveTypeID     uint           `gorm:"not null;index;uniqueIndex:uq_leave_balance"                     json:"leave_type_id"`
	Year            int            `gorm:"not null;uniqueIndex:uq_leave_balance"                           json:"year"`
	UsedOccurrences int            `gorm:"not null;default:0"                                              json:"used_occurrences"`
	UsedDuration    int            `gorm:"not null;default:0"                                              json:"used_duration"`
	CreatedAt       time.Time      `gorm:"not null;default:now()"                                         json:"created_at"`
	UpdatedAt       *time.Time     `                                                                        json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index"                                                           json:"deleted_at"`

	// Relations
	Employee  Employee  `gorm:"foreignKey:EmployeeID"  json:"employee,omitempty"`
	LeaveType LeaveType `gorm:"foreignKey:LeaveTypeID" json:"leave_type,omitempty"`
}
