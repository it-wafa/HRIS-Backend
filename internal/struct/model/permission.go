package model

import (
	"time"

	"gorm.io/gorm"
)

type Permission struct {
	Code        string         `gorm:"primaryKey;type:varchar(100)"         json:"code"`
	Module      string         `gorm:"type:varchar(100);not null"           json:"module"`
	Action      string         `gorm:"type:varchar(100);not null"           json:"action"`
	Description *string        `gorm:"type:text"                            json:"description"`
	CreatedAt   time.Time      `gorm:"not null;default:now()"              json:"created_at"`
	UpdatedAt   *time.Time     `                                            json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index"                                json:"deleted_at"`
}
