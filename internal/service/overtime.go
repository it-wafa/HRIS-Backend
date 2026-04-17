package service

import (
	"context"
	"fmt"
	"time"

	"hris-backend/internal/repository"
	"hris-backend/internal/struct/dto"
	"hris-backend/internal/struct/model"
)

type OvertimeService interface {
	GetAll(ctx context.Context, params dto.OvertimeListParams) ([]dto.OvertimeRequestResponse, error)
	GetByID(ctx context.Context, id uint) (dto.OvertimeRequestResponse, error)
	Create(ctx context.Context, employeeID uint, req dto.CreateOvertimeRequest) (dto.OvertimeRequestResponse, error)
	UpdateStatus(ctx context.Context, employeeID uint, id uint, req dto.UpdateOvertimeStatusRequest) (dto.OvertimeRequestResponse, error)
	Delete(ctx context.Context, id uint) error
}

type overtimeService struct {
	repo       repository.OvertimeRepository
	attendRepo repository.AttendanceRepository
	txManager  repository.TxManager
}

func NewOvertimeService(
	repo repository.OvertimeRepository,
	attendRepo repository.AttendanceRepository,
	txManager repository.TxManager,
) OvertimeService {
	return &overtimeService{
		repo:       repo,
		attendRepo: attendRepo,
		txManager:  txManager,
	}
}

func (s *overtimeService) GetAll(ctx context.Context, params dto.OvertimeListParams) ([]dto.OvertimeRequestResponse, error) {
	return s.repo.GetAll(ctx, nil, params)
}

func (s *overtimeService) GetByID(ctx context.Context, id uint) (dto.OvertimeRequestResponse, error) {
	res, err := s.repo.GetByID(ctx, nil, id)
	if err != nil {
		return dto.OvertimeRequestResponse{}, err
	}
	return *res, nil
}

func (s *overtimeService) Create(ctx context.Context, employeeID uint, req dto.CreateOvertimeRequest) (dto.OvertimeRequestResponse, error) {
	d, err := time.Parse("2006-01-02", req.OvertimeDate)
	if err != nil {
		return dto.OvertimeRequestResponse{}, fmt.Errorf("invalid date format")
	}

	m := model.OvertimeRequest{
		EmployeeID:     employeeID,
		OvertimeDate:   d,
		PlannedMinutes: req.PlannedMinutes,
		Reason:         req.Reason,
		Status:         "pending",
	}

	created, err := s.repo.Create(ctx, nil, m)
	if err != nil {
		return dto.OvertimeRequestResponse{}, err
	}

	return s.GetByID(ctx, created.ID)
}

func (s *overtimeService) UpdateStatus(ctx context.Context, employeeID uint, id uint, req dto.UpdateOvertimeStatusRequest) (dto.OvertimeRequestResponse, error) {
	reqData, err := s.repo.GetByID(ctx, nil, id)
	if err != nil {
		return dto.OvertimeRequestResponse{}, err
	}
	if reqData.Status != "pending" {
		return dto.OvertimeRequestResponse{}, fmt.Errorf("request is no longer pending")
	}

	tx, err := s.txManager.Begin(ctx)
	if err != nil {
		return dto.OvertimeRequestResponse{}, err
	}
	defer tx.Rollback()

	if err := s.repo.UpdateStatus(ctx, tx, id, req.Status, employeeID, req.Notes); err != nil {
		return dto.OvertimeRequestResponse{}, err
	}

	if req.Status == "approved" {
		// Asosiasikan dengan log attendance (AttendanceRepository LinkOvertimeToLog)
		log, _ := s.attendRepo.GetTodayLog(ctx, tx, reqData.EmployeeID, reqData.OvertimeDate)
		if log != nil {
			_ = s.attendRepo.LinkOvertimeToLog(ctx, tx, reqData.EmployeeID, reqData.OvertimeDate, log.ID)
		}
	}

	if err := tx.Commit(); err != nil {
		return dto.OvertimeRequestResponse{}, err
	}

	return s.GetByID(ctx, id)
}

func (s *overtimeService) Delete(ctx context.Context, id uint) error {
	reqData, err := s.repo.GetByID(ctx, nil, id)
	if err != nil {
		return err
	}
	if reqData.Status != "pending" {
		return fmt.Errorf("cannot delete processed overtime request")
	}
	return s.repo.Delete(ctx, nil, id)
}
