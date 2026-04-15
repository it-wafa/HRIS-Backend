package model

import (
	"time"

	"gorm.io/gorm"
)

type JobPosition struct {
	ID           uint           `gorm:"primaryKey;autoIncrement"   json:"id"`
	Title        *string        `gorm:"type:varchar(100)"          json:"title"`
	DepartmentID uint           `gorm:"not null;index"             json:"department_id"`
	CreatedAt    time.Time      `gorm:"not null;default:now()"    json:"created_at"`
	UpdatedAt    *time.Time     `                                  json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index"                      json:"deleted_at"`

	// Relations
	Department Department `gorm:"foreignKey:DepartmentID" json:"department,omitempty"`
}
