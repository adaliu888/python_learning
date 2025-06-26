package utils

import (
	"crypto/rand"
	"encoding/hex"
)

func GenerateRandomString(length int) string {
	bytes := make([]byte, length/2)
	rand.Read(bytes)
	return hex.EncodeToString(bytes)
} 