package utils

import (
	"fmt"
	"net"
	"strconv"
)

// FindAvailablePort finds an available port starting from startPort
func FindAvailablePort(startPort int) (int, error) {
	for port := startPort; port < startPort+100; port++ {
		address := fmt.Sprintf(":%d", port)
		listener, err := net.Listen("tcp", address)
		if err == nil {
			listener.Close()
			return port, nil
		}
	}
	return 0, fmt.Errorf("no available port found between %d and %d", startPort, startPort+100)
}

// IsPortAvailable checks if a specific port is available
func IsPortAvailable(port int) bool {
	address := fmt.Sprintf(":%d", port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		return false
	}
	listener.Close()
	return true
}

// GetPortFromString safely converts string to port number
func GetPortFromString(portStr string, defaultPort int) int {
	if portStr == "" {
		return defaultPort
	}
	
	port, err := strconv.Atoi(portStr)
	if err != nil || port <= 0 || port > 65535 {
		return defaultPort
	}
	
	return port
} 