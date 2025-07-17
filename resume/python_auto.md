## Python自动化测试代码示例

### API自动化测试框架 (pytest + requests)

```python
# file: test_api_framework.py
import pytest
import requests
import json
import logging
from datetime import datetime

class TestAPIFramework:
    # 测试前置配置
    @pytest.fixture(scope="class")
    def setup_class(self):
        logging.info(f"测试开始执行: {datetime.now()}")
        self.base_url = "https://api.example.com/v1"
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self._get_token()}"
        }
        # 测试数据初始化
        self.test_device = self._create_test_device()
        yield
        # 测试后清理
        self._delete_test_device(self.test_device["id"])
        
    def _get_token(self):
        """获取认证token"""
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={"username": "testuser", "password": "testpassword"}
        )
        assert response.status_code == 200, f"认证失败: {response.text}"
        return response.json()["token"]
    
    def _create_test_device(self):
        """创建测试设备"""
        device_data = {
            "name": f"test_device_{datetime.now().timestamp()}",
            "type": "thermostat",
            "location": "living_room"
        }
        response = requests.post(
            f"{self.base_url}/devices", 
            headers=self.headers,
            json=device_data
        )
        assert response.status_code == 201, f"创建测试设备失败: {response.text}"
        return response.json()
    
    def _delete_test_device(self, device_id):
        """删除测试设备"""
        response = requests.delete(
            f"{self.base_url}/devices/{device_id}",
            headers=self.headers
        )
        assert response.status_code == 204, f"删除测试设备失败: {response.text}"
    
    # 参数化测试：测试不同温度设置
    @pytest.mark.parametrize("temperature", [18, 22, 25, 30])
    def test_set_temperature(self, setup_class, temperature):
        """测试设置设备温度"""
        # 准备测试数据
        payload = {"temperature": temperature}
        
        # 执行API调用
        response = requests.put(
            f"{self.base_url}/devices/{self.test_device['id']}/temperature",
            headers=self.headers,
            json=payload
        )
        
        # 断言结果
        assert response.status_code == 200, f"设置温度失败: {response.text}"
        response_data = response.json()
        assert response_data["temperature"] == temperature, "温度设置不正确"
        assert response_data["status"] == "success", "操作状态不正确"
        
        # 验证设备状态
        self._verify_device_status(self.test_device["id"], {"temperature": temperature})
    
    def _verify_device_status(self, device_id, expected_status):
        """验证设备状态"""
        response = requests.get(
            f"{self.base_url}/devices/{device_id}",
            headers=self.headers
        )
        assert response.status_code == 200, f"获取设备状态失败: {response.text}"
        device_data = response.json()
        
        # 检查期望的状态值
        for key, value in expected_status.items():
            assert device_data[key] == value, f"设备{key}状态不匹配: 期望 {value}, 实际 {device_data[key]}"
        
        logging.info(f"设备状态验证通过: {device_data}")
```

### UI自动化测试示例 (Selenium)

```python
# file: test_ui_automation.py
import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import logging
import time
import allure

class TestDeviceManagementUI:
    @pytest.fixture(scope="class")
    def setup_browser(self):
        # 设置Chrome选项
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument("--headless")  # 无头模式
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--window-size=1920,1080")
        
        # 初始化WebDriver
        driver = webdriver.Chrome(options=chrome_options)
        driver.implicitly_wait(10)
        
        # 返回driver
        yield driver
        
        # 测试完成后关闭浏览器
        driver.quit()
    
    @pytest.fixture(scope="function")
    def login(self, setup_browser):
        """登录系统"""
        driver = setup_browser
        driver.get("https://example.com/login")
        
        # 登录操作
        driver.find_element(By.ID, "username").send_keys("admin")
        driver.find_element(By.ID, "password").send_keys("admin123")
        driver.find_element(By.ID, "login-button").click()
        
        # 等待登录成功
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "dashboard-container"))
            )
            logging.info("登录成功")
        except TimeoutException:
            allure.attach(
                driver.get_screenshot_as_png(),
                name="login_failure",
                attachment_type=allure.attachment_type.PNG
            )
            pytest.fail("登录失败，超时")
        
        yield driver
    
    @allure.feature("设备管理")
    @allure.story("添加新设备")
    def test_add_new_device(self, login):
        """测试添加新设备功能"""
        driver = login
        
        # 导航到设备管理页面
        driver.find_element(By.XPATH, "//nav//a[contains(text(), '设备管理')]").click()
        
        # 点击添加设备按钮
        driver.find_element(By.ID, "add-device-btn").click()
        
        # 等待对话框加载
        WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "device-form"))
        )
        
        # 填写设备信息
        device_name = f"Test Device {time.time()}"
        driver.find_element(By.ID, "device-name").send_keys(device_name)
        driver.find_element(By.ID, "device-type").send_keys("智能温控器")
        driver.find_element(By.ID, "device-location").send_keys("会议室")
        
        # 点击保存按钮
        driver.find_element(By.XPATH, "//button[contains(text(), '保存')]").click()
        
        # 等待成功提示
        WebDriverWait(driver, 5).until(
            EC.visibility_of_element_located((By.CLASS_NAME, "success-message"))
        )
        
        # 验证设备是否出现在列表中
        WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.XPATH, f"//td[contains(text(), '{device_name}')]"))
        )
        
        allure.attach(
            driver.get_screenshot_as_png(),
            name="device_added",
            attachment_type=allure.attachment_type.PNG
        )
        
        logging.info(f"成功添加设备: {device_name}")
```

## Golang/Gin服务端开发示例

### 设备管理API服务

```go
// file: main.go
package main

import (
	"fmt"
	"log"
	"net/http"
	"time"
	
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
	"github.com/dgrijalva/jwt-go"
)

// 设备模型
type Device struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	Name       string    `json:"name" binding:"required"`
	Type       string    `json:"type" binding:"required"`
	Location   string    `json:"location"`
	Status     string    `json:"status" gorm:"default:offline"`
	Temperature float64   `json:"temperature"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

// 认证请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// JWT Claims
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

var db *gorm.DB
var jwtKey = []byte("my_secret_key")

func main() {
	// 初始化数据库连接
	initDB()
	
	// 初始化Gin路由
	r := gin.Default()
	
	// 配置CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	// 认证路由
	r.POST("/v1/auth/login", login)
	
	// API路由组，需要认证
	api := r.Group("/v1")
	api.Use(authMiddleware())
	{
		// 设备管理路由
		api.GET("/devices", getAllDevices)
		api.GET("/devices/:id", getDeviceByID)
		api.POST("/devices", createDevice)
		api.PUT("/devices/:id", updateDevice)
		api.DELETE("/devices/:id", deleteDevice)
		api.PUT("/devices/:id/temperature", setTemperature)
	}
	
	// 启动服务器
	log.Println("Server starting on port 8080...")
	r.Run(":8080")
}

// 初始化数据库
func initDB() {
	dsn := "user:password@tcp(127.0.0.1:3306)/device_management?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	// 自动迁移
	db.AutoMigrate(&Device{})
}

// 登录处理
func login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 简化演示，实际应检查数据库中的凭据
	if req.Username != "testuser" || req.Password != "testpassword" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}
	
	// 生成JWT令牌
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: req.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"expires_at": expirationTime,
	})
}

// 认证中间件
func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			return
		}
		
		// 格式: "Bearer {token}"
		if len(authHeader) < 7 || authHeader[:7] != "Bearer " {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid authorization format"})
			return
		}
		
		tokenString := authHeader[7:]
		claims := &Claims{}
		
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			return
		}
		
		// 将用户名设置到上下文
		c.Set("username", claims.Username)
		c.Next()
	}
}

// 获取所有设备
func getAllDevices(c *gin.Context) {
	var devices []Device
	result := db.Find(&devices)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch devices"})
		return
	}
	
	c.JSON(http.StatusOK, devices)
}

// 根据ID获取设备
func getDeviceByID(c *gin.Context) {
	id := c.Param("id")
	var device Device
	
	if err := db.First(&device, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	
	c.JSON(http.StatusOK, device)
}

// 创建新设备
func createDevice(c *gin.Context) {
	var device Device
	if err := c.ShouldBindJSON(&device); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	device.CreatedAt = time.Now()
	device.UpdatedAt = time.Now()
	
	if result := db.Create(&device); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create device"})
		return
	}
	
	c.JSON(http.StatusCreated, device)
}

// 更新设备
func updateDevice(c *gin.Context) {
	id := c.Param("id")
	var device Device
	
	if err := db.First(&device, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	
	var updateData Device
	if err := c.ShouldBindJSON(&updateData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	updateData.UpdatedAt = time.Now()
	
	if err := db.Model(&device).Updates(updateData).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update device"})
		return
	}
	
	// 获取更新后的设备
	db.First(&device, id)
	c.JSON(http.StatusOK, device)
}

// 删除设备
func deleteDevice(c *gin.Context) {
	id := c.Param("id")
	var device Device
	
	if err := db.First(&device, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	
	if err := db.Delete(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete device"})
		return
	}
	
	c.Status(http.StatusNoContent)
}

// 设置设备温度
func setTemperature(c *gin.Context) {
	id := c.Param("id")
	var device Device
	
	if err := db.First(&device, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Device not found"})
		return
	}
	
	var tempData struct {
		Temperature float64 `json:"temperature" binding:"required"`
	}
	
	if err := c.ShouldBindJSON(&tempData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	
	// 更新温度
	device.Temperature = tempData.Temperature
	device.Status = "online"
	device.UpdatedAt = time.Now()
	
	if err := db.Save(&device).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update temperature"})
		return
	}
	
	c.JSON(http.StatusOK, gin.H{
		"id": device.ID,
		"name": device.Name,
		"temperature": device.Temperature,
		"status": "success",
	})
}
```

### Go测试数据分析服务

```go
// file: data_analysis_service.go
package main

import (
	"encoding/csv"
	"fmt"
	"log"
	"os"
	"strconv"
	"time"
	
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/robfig/cron/v3"
	"golang.org/x/net/context"
	"gorm.io/gorm"
	"gorm.io/driver/mysql"
)

// 测试结果模型
type TestResult struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	TestID    string    `json:"test_id"`
	Device    string    `json:"device"`
	TestCase  string    `json:"test_case"`
	Status    string    `json:"status"` // passed, failed, blocked
	Duration  float64   `json:"duration"` // 执行时间(秒)
	ErrorMsg  string    `json:"error_msg,omitempty"`
	Timestamp time.Time `json:"timestamp"`
}

// 统计数据
type TestStats struct {
	TotalTests   int     `json:"total_tests"`
	PassedTests  int     `json:"passed_tests"`
	FailedTests  int     `json:"failed_tests"`
	BlockedTests int     `json:"blocked_tests"`
	PassRate     float64 `json:"pass_rate"`
	AvgDuration  float64 `json:"avg_duration"`
}

var (
	db *gorm.DB
	redisClient *redis.Client
	ctx = context.Background()
)

func main() {
	// 初始化数据库
	initDB()
	
	// 初始化Redis
	initRedis()
	
	// 设置定时任务
	initCronJobs()
	
	// 设置Gin路由
	r := gin.Default()
	
	// API路由
	api := r.Group("/api/v1")
	{
		api.POST("/test-results", addTestResult)
		api.GET("/test-results", getTestResults)
		api.GET("/test-stats", getTestStats)
		api.GET("/test-stats/export", exportTestStats)
		api.GET("/test-trends", getTestTrends)
	}
	
	// 启动服务器
	log.Println("Data Analysis Service starting on port 8081...")
	r.Run(":8081")
}

// 初始化数据库
func initDB() {
	dsn := "user:password@tcp(127.0.0.1:3306)/test_analytics?charset=utf8mb4&parseTime=True&loc=Local"
	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	
	// 自动迁移
	db.AutoMigrate(&TestResult{})
}

// 初始化Redis
func initRedis() {
	redisClient = redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
		Password: "",
		DB: 0,
	})
	
	// 测试连接
	_, err := redisClient.Ping(ctx).Result()
	if err != nil {
		log.Fatalf("Failed to connect to Redis: %v", err)
	}
}

// 初始化定时任务
func initCronJobs() {
	c := cron.New()
	
	// 每天午夜计算统计数据
	c.AddFunc("0 0 * * *", calculateDailyStats)
	
	// 每小时清理缓存
	c.AddFunc("0 * * * *", cleanupCache)
	
	c.Start()
}

// 添加测试结果
func addTestResult(c *gin.Context) {
	var result TestResult
	if err := c.ShouldBindJSON(&result); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}
	
	// 设置时间戳
	if result.Timestamp.IsZero() {
		result.Timestamp = time.Now()
	}
	
	// 保存到数据库
	if err := db.Create(&result).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to save test result"})
		return
	}
	
	// 清除统计缓存以便重新计算
	redisClient.Del(ctx, "test_stats")
	
	c.JSON(201, result)
}

// 获取测试结果
func getTestResults(c *gin.Context) {
	var results []TestResult
	query := db.Order("timestamp desc")
	
	// 过滤参数
	if device := c.Query("device"); device != "" {
		query = query.Where("device = ?", device)
	}
	
	if status := c.Query("status"); status != "" {
		query = query.Where("status = ?", status)
	}
	
	// 分页
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "100"))
	offset, _ := strconv.Atoi(c.DefaultQuery("offset", "0"))
	query = query.Limit(limit).Offset(offset)
	
	// 执行查询
	if err := query.Find(&results).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch test results"})
		return
	}
	
	c.JSON(200, results)
}

// 获取测试统计信息
func getTestStats(c *gin.Context) {
	// 尝试从缓存获取
	cachedStats, err := redisClient.Get(ctx, "test_stats").Result()
	if err == nil {
		// 返回缓存的数据
		c.Header("X-Cache", "HIT")
		c.Data(200, "application/json", []byte(cachedStats))
		return
	}
	
	// 计算统计信息
	stats := calculateStats()
	
	// 缓存结果(10分钟)
	statsJSON, _ := c.GetRawData()
	redisClient.Set(ctx, "test_stats", string(statsJSON), 10*time.Minute)
	
	c.Header("X-Cache", "MISS")
	c.JSON(200, stats)
}

// 计算统计信息
func calculateStats() TestStats {
	var stats TestStats
	
	// 总测试数
	db.Model(&TestResult{}).Count(&stats.TotalTests)
	
	// 通过的测试数
	db.Model(&TestResult{}).Where("status = ?", "passed").Count(&stats.PassedTests)
	
	// 失败的测试数
	db.Model(&TestResult{}).Where("status = ?", "failed").Count(&stats.FailedTests)
	
	// 被阻塞的测试数
	db.Model(&TestResult{}).Where("status = ?", "blocked").Count(&stats.BlockedTests)
	
	// 通过率
	if stats.TotalTests > 0 {
		stats.PassRate = float64(stats.PassedTests) / float64(stats.TotalTests) * 100
	}
	
	// 平均执行时间
	db.Model(&TestResult{}).Select("AVG(duration)").Row().Scan(&stats.AvgDuration)
	
	return stats
}

// 导出测试统计数据
func exportTestStats(c *gin.Context) {
	// 查询数据
	var results []TestResult
	if err := db.Find(&results).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch test results"})
		return
	}
	
	// 创建CSV文件
	fileName := fmt.Sprintf("test_stats_%s.csv", time.Now().Format("20060102_150405"))
	file, err := os.Create(fileName)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create export file"})
		return
	}
	defer file.Close()
	
	// 创建CSV写入器
	writer := csv.NewWriter(file)
	defer writer.Flush()
	
	// 写入标题行
	writer.Write([]string{"ID", "TestID", "Device", "TestCase", "Status", "Duration", "ErrorMsg", "Timestamp"})
	
	// 写入数据行
	for _, result := range results {
		writer.Write([]string{
			strconv.FormatUint(uint64(result.ID), 10),
			result.TestID,
			result.Device,
			result.TestCase,
			result.Status,
			strconv.FormatFloat(result.Duration, 'f', 2, 64),
			result.ErrorMsg,
			result.Timestamp.Format(time.RFC3339),
		})
	}
	
	// 提供下载
	c.FileAttachment(fileName, fileName)
}

// 获取测试趋势数据
func getTestTrends(c *gin.Context) {
	// 获取请求的日期范围
	startDate := c.DefaultQuery("start_date", time.Now().AddDate(0, -1, 0).Format("2006-01-02"))
	endDate := c.DefaultQuery("end_date", time.Now().Format("2006-01-02"))
	
	// 解析日期
	start, _ := time.Parse("2006-01-02", startDate)
	end, _ := time.Parse("2006-01-02", endDate)
	end = end.Add(24 * time.Hour) // 包含结束日期
	
	// 查询数据
	type DailyStats struct {
		Date      string
		Total     int
		Passed    int
		Failed    int
		PassRate  float64
	}
	
	var results []TestResult
	if err := db.Where("timestamp BETWEEN ? AND ?", start, end).Find(&results).Error; err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch trend data"})
		return
	}
	
	// 按日期分组统计
	statsByDate := make(map[string]*DailyStats)
	
	for _, result := range results {
		date := result.Timestamp.Format("2006-01-02")
		
		// 初始化日期统计
		if _, ok := statsByDate[date]; !ok {
			statsByDate[date] = &DailyStats{
				Date:  date,
				Total: 0,
				Passed: 0,
				Failed: 0,
			}
		}
		
		// 更新统计数据
		stats := statsByDate[date]
		stats.Total++
		
		if result.Status == "passed" {
			stats.Passed++
		} else if result.Status == "failed" {
			stats.Failed++
		}
		
		// 计算通过率
		if stats.Total > 0 {
			stats.PassRate = float64(stats.Passed) / float64(stats.Total) * 100
		}
	}
	
	// 转换为数组
	trends := make([]DailyStats, 0, len(statsByDate))
	for _, stats := range statsByDate {
		trends = append(trends, *stats)
	}
	
	c.JSON(200, trends)
}

// 计算每日统计数据
func calculateDailyStats() {
	log.Println("Calculating daily test statistics...")
	
	// 获取昨天的日期
	yesterday := time.Now().AddDate(0, 0, -1)
	startOfDay := time.Date(yesterday.Year(), yesterday.Month(), yesterday.Day(), 0, 0, 0, 0, yesterday.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)
	
	// 查询昨天的测试结果
	var results []TestResult
	if err := db.Where("timestamp BETWEEN ? AND ?", startOfDay, endOfDay).Find(&results).Error; err != nil {
		log.Printf("Failed to fetch daily test results: %v", err)
		return
	}
	
	// 计算统计数据
	var stats TestStats
	stats.TotalTests = len(results)
	
	for _, result := range results {
		if result.Status == "passed" {
			stats.PassedTests++
		} else if result.Status == "failed" {
			stats.FailedTests++
		} else if result.Status == "blocked" {
			stats.BlockedTests++
		}
		
		stats.AvgDuration += result.Duration
	}
	
	// 计算平均时间
	if stats.TotalTests > 0 {
		stats.AvgDuration /= float64(stats.TotalTests)
		stats.PassRate = float64(stats.PassedTests) / float64(stats.TotalTests) * 100
	}
	
	// 保存到数据库或发送报告
	log.Printf("Daily stats: Total=%d, Passed=%d, Failed=%d, Pass Rate=%.2f%%", 
		stats.TotalTests, stats.PassedTests, stats.FailedTests, stats.PassRate)
}

// 清理缓存
func cleanupCache() {
	log.Println("Cleaning up cache...")
	redisClient.Del(ctx, "test_stats")
}
```