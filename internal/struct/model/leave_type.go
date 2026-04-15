package model

import (
	"time"

	"gorm.io/gorm"
)

type (
	LeaveCategoryEnum string
	DurationUnitEnum  string
)

const (
	LeaveCategoryAnnual    LeaveCategoryEnum = "annual"
	LeaveCategorySick      LeaveCategoryEnum = "sick"
	LeaveCategoryMaternity LeaveCategoryEnum = "maternity"
	LeaveCategoryPaternity LeaveCategoryEnum = "paternity"
	LeaveCategoryUnpaid    LeaveCategoryEnum = "unpaid"
	LeaveCategoryOther     LeaveCategoryEnum = "other"
)

const (
	DurationUnitDays  DurationUnitEnum = "days"
	DurationUnitHours DurationUnitEnum = "hours"
)

type LeaveType struct {
	ID                      uint              `gorm:"primaryKey;autoIncrement"        json:"id"`
	Name                    string            `gorm:"type:varchar(100);not null"      json:"name"`
	Category                LeaveCategoryEnum `gorm:"type:leave_category_enum;not null" json:"category"`
	RequiresDocument        bool              `gorm:"not null;default:false"          json:"requires_document"`
	RequiresDocumentType    *string           `gorm:"type:varchar(100)"               json:"requires_document_type"`
	MaxDurationPerRequest   *int              `                                       json:"max_duration_per_request"`
	MaxDurationUnit         *DurationUnitEnum `gorm:"type:duration_unit_enum"         json:"max_duration_unit"`
	MaxOccurrencesPerYear   *int              `                                       json:"max_occurrences_per_year"`
	MaxTotalDurationPerYear *int              `                                       json:"max_total_duration_per_year"`
	MaxTotalDurationUnit    *DurationUnitEnum `gorm:"type:duration_unit_enum"         json:"max_total_duration_unit"`
	CreatedAt               time.Time         `gorm:"not null;default:now()"         json:"created_at"`
	UpdatedAt               *time.Time        `                                       json:"updated_at"`
	DeletedAt               gorm.DeletedAt    `gorm:"index"                           json:"deleted_at"`
}
