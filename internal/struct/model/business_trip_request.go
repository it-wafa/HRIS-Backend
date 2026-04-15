package model

import (
	"time"

	"gorm.io/gorm"
)

type BusinessTripRequest struct {
	ID            uint              `gorm:"primaryKey;autoIncrement"                          json:"id"`
	EmployeeID    uint              `gorm:"not null;index"                                    json:"employee_id"`
	Destination   string            `gorm:"type:varchar(255);not null"                        json:"destination"`
	StartDate     time.Time         `gorm:"type:date;not null"                                json:"start_date"`
	EndDate       time.Time         `gorm:"type:date;not null"                                json:"end_date"`
	TotalDays     int               `gorm:"not null"                                          json:"total_days"`
	Purpose       string            `gorm:"type:text;not null"                                json:"purpose"`
	DocumentURL   *string           `gorm:"type:text"                                         json:"document_url"`
	Status        RequestStatusEnum `gorm:"type:request_status_enum;not null;default:pending" json:"status"`
	ApprovedBy    *uint             `gorm:"index"                                             json:"approved_by"`
	ApproverNotes *string           `gorm:"type:text"                                         json:"approver_notes"`
	CreatedAt     time.Time         `gorm:"not null;default:now()"                           json:"created_at"`
	UpdatedAt     *time.Time        `                                                         json:"updated_at"`
	DeletedAt     gorm.DeletedAt    `gorm:"index"                                             json:"deleted_at"`

	// Relations
	Employee Employee  `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
	Approver *Employee `gorm:"foreignKey:ApprovedBy" json:"approver,omitempty"`
}
