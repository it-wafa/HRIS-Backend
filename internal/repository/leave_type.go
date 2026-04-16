package repository

import (
	"context"
	"errors"

	"hris-backend/internal/struct/dto"
	"hris-backend/internal/struct/model"

	"gorm.io/gorm"
)

type LeaveTypeRepository interface {
	GetAllLeaveTypes(ctx context.Context) ([]dto.LeaveTypeResponse, error)
	GetLeaveTypeByID(ctx context.Context, id string) (dto.LeaveTypeResponse, error)
	CreateLeaveType(ctx context.Context, req model.LeaveType) (model.LeaveType, error)
	UpdateLeaveType(ctx context.Context, id string, req model.LeaveType) (model.LeaveType, error)
	DeleteLeaveType(ctx context.Context, id string) error
}

type leaveTypeRepository struct {
	db *gorm.DB
}

func NewLeaveTypeRepository(db *gorm.DB) LeaveTypeRepository {
	return &leaveTypeRepository{db: db}
}

func (r *leaveTypeRepository) GetAllLeaveTypes(ctx context.Context) ([]dto.LeaveTypeResponse, error) {
	var leaveTypes []dto.LeaveTypeResponse
	if err := r.db.WithContext(ctx).Raw(`
		SELECT
			id, name, category, requires_document, requires_document_type,
			max_duration_per_request, max_duration_unit,
			max_occurrences_per_year,
			max_total_duration_per_year, max_total_duration_unit,
			created_at, updated_at
		FROM leave_types
		WHERE deleted_at IS NULL
		ORDER BY name ASC
	`).Scan(&leaveTypes).Error; err != nil {
		return nil, err
	}
	return leaveTypes, nil
}

func (r *leaveTypeRepository) GetLeaveTypeByID(ctx context.Context, id string) (dto.LeaveTypeResponse, error) {
	var lt dto.LeaveTypeResponse
	if err := r.db.WithContext(ctx).Raw(`
		SELECT
			id, name, category, requires_document, requires_document_type,
			max_duration_per_request, max_duration_unit,
			max_occurrences_per_year,
			max_total_duration_per_year, max_total_duration_unit,
			created_at, updated_at
		FROM leave_types
		WHERE deleted_at IS NULL AND id = ?
	`, id).Scan(&lt).Error; err != nil {
		return dto.LeaveTypeResponse{}, err
	}
	if lt.ID == 0 {
		return dto.LeaveTypeResponse{}, errors.New("leave type not found")
	}
	return lt, nil
}

func (r *leaveTypeRepository) CreateLeaveType(ctx context.Context, req model.LeaveType) (model.LeaveType, error) {
	if err := r.db.WithContext(ctx).Create(&req).Error; err != nil {
		return model.LeaveType{}, err
	}
	return req, nil
}

func (r *leaveTypeRepository) UpdateLeaveType(ctx context.Context, id string, req model.LeaveType) (model.LeaveType, error) {
	if err := r.db.WithContext(ctx).Model(&req).Where("id = ?", id).Updates(req).Error; err != nil {
		return model.LeaveType{}, err
	}
	return req, nil
}

func (r *leaveTypeRepository) DeleteLeaveType(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.LeaveType{}).Error; err != nil {
		return err
	}
	return nil
}
