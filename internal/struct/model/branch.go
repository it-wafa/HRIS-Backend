package model

import (
	"time"

	"gorm.io/gorm"
)

type Branch struct {
	ID           uint           `gorm:"primaryKey;autoIncrement"                json:"id"`
	Code         string         `gorm:"type:varchar(20);not null;uniqueIndex"    json:"code"`
	Name         string         `gorm:"type:varchar(100);not null"               json:"name"`
	Address      *string        `gorm:"type:text"                                json:"address"`
	Latitude     *float64       `gorm:"type:decimal(10,8)"                       json:"latitude"`
	Longitude    *float64       `gorm:"type:decimal(11,8)"                       json:"longitude"`
	RadiusMeters int            `gorm:"not null;default:100"                     json:"radius_meters"`
	AllowWFH     bool           `gorm:"not null;default:false"                   json:"allow_wfh"`
	CreatedAt    time.Time      `gorm:"not null;default:now()"                   json:"created_at"`
	UpdatedAt    *time.Time     `                                                json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index"                                    json:"deleted_at"`
}
