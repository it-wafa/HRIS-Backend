package repository

import (
	"context"
	"errors"

	"hris-backend/internal/struct/dto"
	"hris-backend/internal/struct/model"

	"gorm.io/gorm"
)

type MutabaahRepository interface {
	GetTodayLog(ctx context.Context, tx Transaction, employeeID uint, date string) (*dto.MutabaahLogResponse, error)
	GetAllLogs(ctx context.Context, tx Transaction, params dto.MutabaahListParams) ([]dto.MutabaahLogResponse, error)
	CreateLog(ctx context.Context, tx Transaction, m model.MutabaahLog) (model.MutabaahLog, error)
	UpdateLog(ctx context.Context, tx Transaction, id uint, updates map[string]interface{}) error
	GetEmployeesWithAttendanceWithoutMutabaah(ctx context.Context, tx Transaction, date string) ([]struct {
		EmployeeID      uint `db:"employee_id"`
		AttendanceLogID uint `db:"attendance_log_id"`
	}, error)
	BulkCreateMissingLogs(ctx context.Context, tx Transaction, logs []model.MutabaahLog) error
}

type mutabaahRepository struct {
	db *gorm.DB
}

func NewMutabaahRepository(db *gorm.DB) MutabaahRepository {
	return &mutabaahRepository{db: db}
}

func (r *mutabaahRepository) getDB(ctx context.Context, tx Transaction) (*gorm.DB, error) {
	if tx != nil {
		gormTx, ok := tx.(*GormTx)
		if !ok {
			return nil, errors.New("invalid transaction type")
		}
		return gormTx.db.WithContext(ctx), nil
	}
	return r.db.WithContext(ctx), nil
}

func (r *mutabaahRepository) GetTodayLog(ctx context.Context, tx Transaction, employeeID uint, date string) (*dto.MutabaahLogResponse, error) {
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return nil, err
	}

	var log dto.MutabaahLogResponse
	err = db.Raw(`
		SELECT
			ml.id,
			ml.employee_id,
			e.full_name    AS employee_name,
			ml.log_date::TEXT AS log_date,
			ml.target_pages,
			ml.is_submitted,
			ml.submitted_at,
			ml.is_auto_generated,
			ml.created_at,
			ml.updated_at
		FROM mutabaah_logs ml
		JOIN employees e ON e.id = ml.employee_id
		WHERE ml.employee_id = ? AND ml.log_date = ?::DATE AND ml.deleted_at IS NULL
	`, employeeID, date).Scan(&log).Error
	if err != nil {
		return nil, err
	}
	if log.ID == 0 {
		return nil, nil
	}
	return &log, nil
}

func (r *mutabaahRepository) GetAllLogs(ctx context.Context, tx Transaction, params dto.MutabaahListParams) ([]dto.MutabaahLogResponse, error) {
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return nil, err
	}

	query := `
		SELECT
			ml.id,
			ml.employee_id,
			e.full_name    AS employee_name,
			ml.log_date::TEXT AS log_date,
			ml.target_pages,
			ml.is_submitted,
			ml.submitted_at,
			ml.is_auto_generated,
			ml.created_at,
			ml.updated_at
		FROM mutabaah_logs ml
		JOIN employees e ON e.id = ml.employee_id
		WHERE ml.deleted_at IS NULL
	`
	args := []interface{}{}

	if params.EmployeeID != nil {
		query += " AND ml.employee_id = ?"
		args = append(args, *params.EmployeeID)
	}
	if params.DateFrom != nil {
		query += " AND ml.log_date >= ?"
		args = append(args, *params.DateFrom)
	}
	if params.DateTo != nil {
		query += " AND ml.log_date <= ?"
		args = append(args, *params.DateTo)
	}
	if params.IsSubmitted != nil {
		query += " AND ml.is_submitted = ?"
		args = append(args, *params.IsSubmitted)
	}
	query += " ORDER BY ml.log_date DESC"

	var logs []dto.MutabaahLogResponse
	if err := db.Raw(query, args...).Scan(&logs).Error; err != nil {
		return nil, err
	}
	return logs, nil
}

func (r *mutabaahRepository) CreateLog(ctx context.Context, tx Transaction, m model.MutabaahLog) (model.MutabaahLog, error) {
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return model.MutabaahLog{}, err
	}
	if err := db.Create(&m).Error; err != nil {
		return model.MutabaahLog{}, err
	}
	return m, nil
}

func (r *mutabaahRepository) UpdateLog(ctx context.Context, tx Transaction, id uint, updates map[string]interface{}) error {
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return err
	}
	return db.Model(&model.MutabaahLog{}).Where("id = ?", id).Updates(updates).Error
}

func (r *mutabaahRepository) GetEmployeesWithAttendanceWithoutMutabaah(ctx context.Context, tx Transaction, date string) ([]struct {
	EmployeeID      uint `db:"employee_id"`
	AttendanceLogID uint `db:"attendance_log_id"`
}, error,
) {
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return nil, err
	}

	var rows []struct {
		EmployeeID      uint `db:"employee_id"`
		AttendanceLogID uint `db:"attendance_log_id"`
	}

	// Hanya untuk pegawai yang present/late di hari ini tapi belum ada mutabaah log
	err = db.Raw(`
		SELECT al.employee_id, al.id AS attendance_log_id
		FROM attendance_logs al
		WHERE al.attendance_date = ?::DATE
		  AND al.status IN ('present', 'late')
		  AND al.deleted_at IS NULL
		  AND NOT EXISTS (
			  SELECT 1 FROM mutabaah_logs ml
			  WHERE ml.employee_id = al.employee_id
			    AND ml.log_date = ?::DATE
			    AND ml.deleted_at IS NULL
		  )
	`, date, date).Scan(&rows).Error
	return rows, err
}

func (r *mutabaahRepository) BulkCreateMissingLogs(ctx context.Context, tx Transaction, logs []model.MutabaahLog) error {
	if len(logs) == 0 {
		return nil
	}
	db, err := r.getDB(ctx, tx)
	if err != nil {
		return err
	}
	return db.Create(&logs).Error
}
