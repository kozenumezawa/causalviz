package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func handler(c *gin.Context) {
	c.String(200, "AMAZON")
}

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	r.GET("/", handler)
	r.Run("127.0.0.1:3000")
}
