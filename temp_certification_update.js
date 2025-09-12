// 更新认证卡片样式，去掉icon和色块
const updates = `
/* 网格视图 - 去掉认证图标 */
.certification-card .card-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}

.certification-icon {
  display: none;
}

/* 列表视图 - 去掉认证图标 */
.certification-item .item-icon {
  display: none;
}

.certification-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #f8f9ff;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.certification-item .item-content {
  flex: 1;
  margin-left: 0;
}
`
