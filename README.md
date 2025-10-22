# Login System — 发送验证码配置说明

本仓库包含一个简单的复古终端风格登录页面（`index.html`, `style.css`, `script.js`）。`script.js` 中的 `sendVerificationCodeAPI` 已实现两种发送验证码的策略：

1. EmailJS 前端发送（优先）
2. 回退到后端接口：POST /send-code（推荐在你的服务器上实现）

如何使用

A. 使用 EmailJS（无需后端）

1. 注册并登录 https://www.emailjs.com/。创建一个 Email 服务（例如 Gmail、SMTP 等）。
2. 在 EmailJS 仪表盘创建一个模板（Template），模板中需要使用变量 `to_email` 和 `verification_code`。
3. 在你的页面中引入 EmailJS SDK（在 `index.html` 的 `<head>` 中添加）：

```html
<script src="https://cdn.jsdelivr.net/npm/emailjs-com@2.6.4/dist/email.min.js"></script>
<script>
  // 将下面的值替换为你的 EmailJS 用户 ID
  emailjs.init('YOUR_USER_ID');
  // 可以选择设置全局配置，用于 script.js 自动读取
  window.EMAILJS_CONFIG = {
    service_id: 'YOUR_SERVICE_ID',
    template_id: 'YOUR_TEMPLATE_ID',
    user_id: 'YOUR_USER_ID'
  };
</script>
```

4. 打开页面并使用“验证码登录”流程。页面会使用 `currentVerificationCode` 变量作为 `verification_code` 传给模板。

注意：为了防止滥用，你应该限制前端发送频率或在生产中改用后端发送。

B. 使用后端（推荐生产环境）

后端接口期望：

- Endpoint: POST /send-code
- Body: { email: string, code: string }
- 返回 JSON: { success: boolean, message?: string }

示例（Node.js + Express + Nodemailer）

```js
// app.js
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

app.post('/send-code', async (req, res) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: 'Missing params' });

  try {
    await transporter.sendMail({
      from: 'no-reply@example.com',
      to: email,
      subject: 'Your verification code',
      text: `Your verification code: ${code}`
    });
    res.json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send' });
  }
});

app.listen(3000, () => console.log('Server on 3000'));
```

C. 调试和常见问题

- 如果前端使用 EmailJS，但你没有替换 `YOUR_SERVICE_ID/TEMPLATE_ID/USER_ID`，代码会回退到后端尝试。
- 如果你在本地打开 `index.html`（file://），fetch 到 `/send-code` 可能会失败（因为没有服务器）。请使用本地服务器（例如 `npx http-server` 或 `python -m http.server`）或部署后端。
- 日志：浏览器 Console 会输出 EmailJS 调用失败信息，便于排查。

安全提示

- 不要在公共仓库中提交真实的 EmailJS user ID 或后端 SMTP 密钥。
- 生产中推荐使用后端发送以保护凭据并防止滥用。

---

如果你想，我可以：

- 帮你把 `index.html` 添加 EmailJS 引入片段并示例配置；
- 在仓库中添加一个简单的 Express 后端示例文件（`server.js`）并提供运行命令说明。

告诉我你想要哪一种，我来继续实现。