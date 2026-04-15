package model

import (
	"time"

	"gorm.io/gorm"
)

type Role struct {
	ID          uint           `gorm:"primaryKey;autoIncrement"             json:"id"`
	Name        string         `gorm:"type:varchar(100);not null"           json:"name"`
	Description *string        `gorm:"type:text"                            json:"description"`
	CreatedAt   time.Time      `gorm:"not null;default:now()"              json:"created_at"`
	UpdatedAt   *time.Time     `                                            json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index"                                json:"deleted_at"`
}
