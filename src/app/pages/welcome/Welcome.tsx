import React from "react";
import {
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
} from "@mui/material";

export function Welcome() {
  return (
    <div>
      {/* 主体内容 */}
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "35vh",
          }}
        >
          <Typography variant="h3" gutterBottom>
            Welcome to Dynamic-Thread-Pool
          </Typography>
          <Typography variant="body1" align="center">
            欢迎使用动态线程池管理平台，在这里打个广告，如下列表哦。
          </Typography>
        </Box>

        {/* 卡片内容，使用 Grid 进行响应式布局 */}
        <Grid
          container
          spacing={2}
          sx={{ alignItems: "center", justifyContent: "center" }}
        >
          {/* 第一张卡片 */}
          <Grid item xs={12} sm={3}>
            <Card>
              <CardActionArea
                href="https://ai.kangyaocoding.top"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardMedia
                  component="img"
                  image="https://image.kangyaocoding.top/blog/icon/favicon.ico" // 替换成你的头像链接
                  alt="Avatar 1"
                  sx={{
                    objectFit: "contain",
                    height: "100px",
                    paddingTop: "10px",
                  }} // 修改为 'contain'，图片不裁剪
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    OpenAI 对话
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    OpenAI 对话，点击跳转到 AI 平台。
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>

          {/* 第二张卡片 */}
          <Grid item xs={12} sm={3}>
            <Card>
              <CardActionArea
                href="https://blog.kangyaocoding.top"
                target="_blank"
                rel="noopener noreferrer"
              >
                <CardMedia
                  component="img"
                  image="https://image.kangyaocoding.top/blog/icon/blog.webp" // 替换成你的头像链接
                  alt="Avatar 2"
                  sx={{
                    objectFit: "contain",
                    height: "100px",
                    paddingTop: "10px",
                  }} // 修改为 'contain'，图片不裁剪
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    哈利的小屋
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    哈利的小屋，点击跳转到个人博客。
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
