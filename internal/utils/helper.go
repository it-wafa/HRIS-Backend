package utils

import (
	"time"
)

func Ms(d time.Duration) float64 {
	return float64(d.Nanoseconds()) / 1e6
}
