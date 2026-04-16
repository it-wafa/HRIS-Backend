package data

import "hris-backend/internal/struct/dto"

var (
	GenderMeta = []dto.Meta{
		{
			ID:   "male",
			Name: "Laki-laki",
		},
		{
			ID:   "female",
			Name: "Perempuan",
		},
	}

	MaritalStatusMeta = []dto.Meta{
		{
			ID:   "single",
			Name: "Belum Menikah",
		},
		{
			ID:   "married",
			Name: "Menikah",
		},
		{
			ID:   "divorced",
			Name: "Bercerai",
		},
		{
			ID:   "widowed",
			Name: "Duda/Janda",
		},
	}

	ReligionMeta = []dto.Meta{
		{
			ID:   "islam",
			Name: "Islam",
		},
		{
			ID:   "kristen",
			Name: "Kristen",
		},
		{
			ID:   "katolik",
			Name: "Katolik",
		},
		{
			ID:   "hindu",
			Name: "Hindu",
		},
		{
			ID:   "budha",
			Name: "Budha",
		},
		{
			ID:   "lainnya",
			Name: "Lainnya",
		},
	}

	BloodTypeMeta = []dto.Meta{
		{
			ID:   "a",
			Name: "A",
		},
		{
			ID:   "b",
			Name: "B",
		},
		{
			ID:   "ab",
			Name: "AB",
		},
		{
			ID:   "o",
			Name: "O",
		},
		{
			ID:   "unknown",
			Name: "Tidak Diketahui",
		},
	}

	StatusMeta = []dto.Meta{
		{
			ID:   "active",
			Name: "Aktif",
		},
		{
			ID:   "inactive",
			Name: "Tidak Aktif",
		},
	}

	LeaveCategoryMeta = []dto.Meta{
		{ID: "annual", Name: "Cuti Tahunan"},
		{ID: "sick", Name: "Sakit"},
		{ID: "maternity", Name: "Cuti Melahirkan"},
		{ID: "paternity", Name: "Cuti Ayah"},
		{ID: "unpaid", Name: "Tanpa Gaji"},
		{ID: "other", Name: "Lainnya"},
	}

	DurationUnitMeta = []dto.Meta{
		{ID: "days", Name: "Hari"},
		{ID: "hours", Name: "Jam"},
	}
)
