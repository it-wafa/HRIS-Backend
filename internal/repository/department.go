package repository

import (
	"context"
	"errors"

	"hris-backend/internal/struct/dto"
	"hris-backend/internal/struct/model"

	"gorm.io/gorm"
)

type DepartmentRepository interface {
	GetBranchMetadata(ctx context.Context) ([]dto.Meta, error)
	GetAllDepartments(ctx context.Context, params dto.DepartmentListParams) ([]dto.DepartmentResponse, error)
	GetDepartmentByID(ctx context.Context, id string) (dto.DepartmentResponse, error)
	CreateDepartment(ctx context.Context, req model.Department) (model.Department, error)
	UpdateDepartment(ctx context.Context, id string, req model.Department) (model.Department, error)
	DeleteDepartment(ctx context.Context, id string) error
}

type departmentRepository struct {
	db *gorm.DB
}

func NewDepartmentRepository(db *gorm.DB) DepartmentRepository {
	return &departmentRepository{db: db}
}

func (r *departmentRepository) GetBranchMetadata(ctx context.Context) ([]dto.Meta, error) {
	var meta []dto.Meta
	if err := r.db.WithContext(ctx).Raw(`
		SELECT id::TEXT AS id, name
		FROM branches
		WHERE deleted_at IS NULL
		ORDER BY name ASC
	`).Scan(&meta).Error; err != nil {
		return nil, err
	}
	return meta, nil
}

func (r *departmentRepository) GetAllDepartments(ctx context.Context, params dto.DepartmentListParams) ([]dto.DepartmentResponse, error) {
	query := `
		SELECT
			d.id, d.code, d.name, d.branch_id,
			b.name AS branch_name,
			d.description, d.is_active,
			d.created_at, d.updated_at
		FROM departments d
		LEFT JOIN branches b ON b.id = d.branch_id AND b.deleted_at IS NULL
		WHERE d.deleted_at IS NULL
	`
	args := []interface{}{}

	if params.BranchID != nil {
		query += " AND d.branch_id = ?"
		args = append(args, *params.BranchID)
	}
	if params.IsActive != nil {
		query += " AND d.is_active = ?"
		args = append(args, *params.IsActive)
	}

	query += " ORDER BY d.name ASC"

	var departments []dto.DepartmentResponse
	if err := r.db.WithContext(ctx).Raw(query, args...).Scan(&departments).Error; err != nil {
		return nil, err
	}
	return departments, nil
}

func (r *departmentRepository) GetDepartmentByID(ctx context.Context, id string) (dto.DepartmentResponse, error) {
	var dept dto.DepartmentResponse
	if err := r.db.WithContext(ctx).Raw(`
		SELECT
			d.id, d.code, d.name, d.branch_id,
			b.name AS branch_name,
			d.description, d.is_active,
			d.created_at, d.updated_at
		FROM departments d
		LEFT JOIN branches b ON b.id = d.branch_id AND b.deleted_at IS NULL
		WHERE d.deleted_at IS NULL AND d.id = ?
	`, id).Scan(&dept).Error; err != nil {
		return dto.DepartmentResponse{}, err
	}
	if dept.ID == 0 {
		return dto.DepartmentResponse{}, errors.New("department not found")
	}
	return dept, nil
}

func (r *departmentRepository) CreateDepartment(ctx context.Context, req model.Department) (model.Department, error) {
	if err := r.db.WithContext(ctx).Create(&req).Error; err != nil {
		return model.Department{}, err
	}
	return req, nil
}

func (r *departmentRepository) UpdateDepartment(ctx context.Context, id string, req model.Department) (model.Department, error) {
	if err := r.db.WithContext(ctx).Model(&req).Where("id = ?", id).Updates(req).Error; err != nil {
		return model.Department{}, err
	}
	return req, nil
}

func (r *departmentRepository) DeleteDepartment(ctx context.Context, id string) error {
	if err := r.db.WithContext(ctx).Where("id = ?", id).Delete(&model.Department{}).Error; err != nil {
		return err
	}
	return nil
}
