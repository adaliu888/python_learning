package handlers

import (
	"reflect"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/binding"
	"github.com/go-playground/validator/v10"
)

// getValidationErrors converts validation errors to a structured format
func getValidationErrors(err error) []gin.H {
	var errors []gin.H
	
	if validationErrors, ok := err.(validator.ValidationErrors); ok {
		for _, fieldError := range validationErrors {
			field := fieldError.Field()
			tag := fieldError.Tag()
			param := fieldError.Param()
			
			// Convert field name to camelCase for JSON
			field = strings.ToLower(field[:1]) + field[1:]
			
			message := getErrorMessage(tag, param)
			
			errors = append(errors, gin.H{
				"field":   field,
				"message": message,
			})
		}
	}
	
	return errors
}

// getErrorMessage returns a user-friendly error message based on validation tag
func getErrorMessage(tag, param string) string {
	switch tag {
	case "required":
		return "This field is required"
	case "email":
		return "Please enter a valid email address"
	case "min":
		return "Minimum length is " + param + " characters"
	case "max":
		return "Maximum length is " + param + " characters"
	case "alphanum":
		return "Only alphanumeric characters are allowed"
	case "e164":
		return "Please enter a valid phone number"
	case "datetime":
		return "Please enter a valid date"
	default:
		return "Invalid value"
	}
}

// init registers custom validators
func init() {
	if v, ok := binding.Validator.Engine().(*validator.Validate); ok {
		// Register custom validators here if needed
		v.RegisterTagNameFunc(func(fld reflect.StructField) string {
			name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
			if name == "-" {
				return ""
			}
			return name
		})
	}
} 