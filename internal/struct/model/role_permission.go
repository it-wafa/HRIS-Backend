package model

import "time"

type RolePermission struct {
	ID             uint      `gorm:"primaryKey;autoIncrement"                              json:"id"`
	RoleID         uint      `gorm:"not null;index;uniqueIndex:uq_role_permission"         json:"role_id"`
	PermissionCode string    `gorm:"type:varchar(100);not null;uniqueIndex:uq_role_permission" json:"permission_code"`
	CreatedAt      time.Time `gorm:"not null;default:now()"                               json:"created_at"`

	// Relations
	Role       Role       `gorm:"foreignKey:RoleID"             json:"role,omitempty"`
	Permission Permission `gorm:"foreignKey:PermissionCode;references:Code" json:"permission,omitempty"`
}
