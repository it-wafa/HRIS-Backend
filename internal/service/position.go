package service

import (
	"context"
	"fmt"

	"hris-backend/internal/repository"
	"hris-backend/internal/struct/dto"
	"hris-backend/internal/struct/model"
)

type PositionService interface {
	GetMetadata(ctx context.Context) (dto.PositionMetadata, error)
	GetAllPositions(ctx context.Context, departmentID *uint) ([]dto.PositionResponse, error)
	CreatePosition(ctx context.Context, req dto.CreatePositionRequest) (dto.PositionResponse, error)
	UpdatePosition(ctx context.Context, id string, req dto.UpdatePositionRequest) (dto.PositionResponse, error)
	DeletePosition(ctx context.Context, id string) error
}

type positionService struct {
	repo repository.PositionRepository
}

func NewPositionService(repo repository.PositionRepository) PositionService {
	return &positionService{repo: repo}
}

func (s *positionService) GetMetadata(ctx context.Context) (dto.PositionMetadata, error) {
	deptMeta, err := s.repo.GetDepartmentMetadata(ctx)
	if err != nil {
		return dto.PositionMetadata{}, fmt.Errorf("get department metadata: %w", err)
	}
	return dto.PositionMetadata{DepartmentMeta: deptMeta}, nil
}

func (s *positionService) GetAllPositions(ctx context.Context, departmentID *uint) ([]dto.PositionResponse, error) {
	positions, err := s.repo.GetAllPositions(ctx, departmentID)
	if err != nil {
		return nil, fmt.Errorf("get all positions: %w", err)
	}
	return positions, nil
}

func (s *positionService) CreatePosition(ctx context.Context, req dto.CreatePositionRequest) (dto.PositionResponse, error) {
	title := req.Title
	pos := model.JobPosition{
		Title:        &title,
		DepartmentID: func() uint { if req.DepartmentID != nil { return *req.DepartmentID }; return 0 }(),
	}

	created, err := s.repo.CreatePosition(ctx, pos)
	if err != nil {
		return dto.PositionResponse{}, fmt.Errorf("create position: %w", err)
	}

	return s.repo.GetPositionByID(ctx, fmt.Sprintf("%d", created.ID))
}

func (s *positionService) UpdatePosition(ctx context.Context, id string, req dto.UpdatePositionRequest) (dto.PositionResponse, error) {
	pos := model.JobPosition{}
	if req.Title != nil {
		pos.Title = req.Title
	}
	if req.DepartmentID != nil {
		pos.DepartmentID = *req.DepartmentID
	}

	_, err := s.repo.UpdatePosition(ctx, id, pos)
	if err != nil {
		return dto.PositionResponse{}, fmt.Errorf("update position: %w", err)
	}

	return s.repo.GetPositionByID(ctx, id)
}

func (s *positionService) DeletePosition(ctx context.Context, id string) error {
	if err := s.repo.DeletePosition(ctx, id); err != nil {
		return fmt.Errorf("delete position: %w", err)
	}
	return nil
}
