package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
)

func main() {
	gin.SetMode(gin.ReleaseMode)
	r := gin.Default()

	//r.StaticFile("/", "front/dist/index.html")
	r.Static("/", "front/dist")
	r.Run("127.0.0.1:3000")
}
