package model

import "time"

type AuditActionEnum string

const (
	AuditCreate AuditActionEnum = "create"
	AuditUpdate AuditActionEnum = "update"
	AuditDelete AuditActionEnum = "delete"
)

type AuditLog struct {
	ID         uint            `gorm:"primaryKey;autoIncrement"          json:"id"`
	EmployeeID *uint           `gorm:"index"                             json:"employee_id"`
	TableName  string          `gorm:"type:varchar(100);not null"        json:"table_name"`
	RecordID   int             `gorm:"not null"                          json:"record_id"`
	Action     AuditActionEnum `gorm:"type:audit_action_enum;not null"   json:"action"`
	OldValues  *[]byte         `gorm:"type:jsonb"                        json:"old_values"`
	NewValues  *[]byte         `gorm:"type:jsonb"                        json:"new_values"`
	IPAddress  *string         `gorm:"type:varchar(45)"                  json:"ip_address"`
	UserAgent  *string         `gorm:"type:text"                         json:"user_agent"`
	CreatedAt  time.Time       `gorm:"not null;default:now()"           json:"created_at"`

	// Relations
	Employee *Employee `gorm:"foreignKey:EmployeeID" json:"employee,omitempty"`
}
