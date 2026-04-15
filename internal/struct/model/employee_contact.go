package model

import (
	"time"

	"gorm.io/gorm"
)

type EmployeeContact struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"   json:"id"`
	EmployeeID  uint           `gorm:"not null;index"             json:"employee_id"`
	Phone       *string        `gorm:"type:varchar(20)"           json:"phone"`
	Email       *string        `gorm:"type:varchar(150)"          json:"email"`
	AddressLine *string        `gorm:"type:text"                  json:"address_line"`
	City        *string        `gorm:"type:varchar(50)"           json:"city"`
	Province    *string        `gorm:"type:varchar(50)"           json:"province"`
	PostalCode  *string        `gorm:"type:varchar(10)"           json:"postal_code"`
	IsPrimary   bool           `gorm:"not null;default:false"     json:"is_primary"`
	CreatedAt   time.Time      `gorm:"not null;default:now()"    json:"created_at"`
	UpdatedAt   *time.Time     `                                  json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index"                      json:"deleted_at"`

	// Relations
	Employee Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
}
