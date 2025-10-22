// DOM元素获取
console.log('script.js loaded at', new Date().toISOString());
const modeSelect = document.getElementById('mode-select');
const passwordLogin = document.getElementById('password-login');
const verificationLogin = document.getElementById('verification-login');
const passwordLoginBtn = document.getElementById('password-login-btn');
const verificationLoginBtn = document.getElementById('verification-login-btn');
const sendCodeBtn = document.getElementById('send-code-btn');
const responseArea = document.getElementById('response-area');
const cursor = document.querySelector('.cursor');

// 全局变量
let currentVerificationCode = '';
let loginMode = null;

// 已移除重复的init函数定义

// 处理模式选择
function handleModeSelection(event) {
    // 支持键盘事件和直接传递模式参数
    let mode;

    if (event.key === 'Enter') {
        // 键盘输入模式
        mode = document.getElementById('mode-select')?.value;
    } else if (event.key === '1' || event.key === '2') {
        // 直接传递的模式参数（来自按钮点击）
        mode = event.key;
    } else {
        return;
    }

    if (mode === '1') {
        loginMode = 'password';
        switchToLoginMode('password');
        typeText('> 正在切换至邮箱+密码的登录方式...', 'info-text');
    } else if (mode === '2') {
        loginMode = 'verification';
        switchToLoginMode('verification');
        typeText('> 正在切换至邮箱+验证码的登录方式...', 'info-text');
    } else if (mode) {
        typeText('> ERROR: 无效的方式', 'error-text');
        const modeSelectInput = document.getElementById('mode-select');
        if (modeSelectInput) modeSelectInput.value = '';
    }
}

// 复古终端初始化动画
function startRetroInitialization() {
    const initSequence = document.querySelector('.init-sequence');
    if (!initSequence) {
        console.warn('初始化序列元素未找到');
        return;
    }

    const initLines = initSequence.querySelectorAll('div');
    initLines.forEach(line => {
        line.style.opacity = '0';
    });

    initLines.forEach((line, index) => {
        setTimeout(() => {
            line.style.opacity = '1';
            line.style.transition = 'opacity 0.3s ease-in-out';

            // 仅为 .init-text 打字，保留 .cmd-prefix/.highlight 的原始 HTML
            const textSpan = line.querySelector('.init-text');
            if (!textSpan) return;
            const original = textSpan.textContent || '';
            textSpan.textContent = '';
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < original.length) {
                    textSpan.textContent += original.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 30);
        }, 500 * (index + 1));
    });

    setTimeout(() => {
        const asciiLogo = document.querySelector('.ascii-logo');
        const connectionInfo = document.querySelector('.connection-info');
        const modeSelection = document.querySelector('.mode-selection');

        if (asciiLogo) {
            asciiLogo.style.opacity = '0';
            setTimeout(() => {
                asciiLogo.style.transition = 'opacity 1s ease-in-out';
                asciiLogo.style.opacity = '1';
            }, 300);
        }

        if (connectionInfo) {
            connectionInfo.style.opacity = '0';
            setTimeout(() => {
                connectionInfo.style.transition = 'opacity 1s ease-in-out';
                connectionInfo.style.opacity = '1';
            }, 800);
        }

        setTimeout(() => {
            if (modeSelection) {
                modeSelection.style.opacity = '0';
                modeSelection.style.transition = 'opacity 0.5s ease-in-out';
                setTimeout(() => {
                    modeSelection.style.opacity = '1';
                    const firstBtn = modeSelection.querySelector('.terminal-btn');
                    if (firstBtn) firstBtn.focus();
                }, 300);
            }
        }, 1200);
    }, 2500);
}

// 切换到指定的登录模式（password | verification）
function switchToLoginMode(mode) {
    const passwordLoginForm = document.getElementById('password-login');
    const verificationLoginForm = document.getElementById('verification-login');
    const modeSelection = document.querySelector('.mode-selection');

    // 隐藏两个表单，然后显示需要的一个
    if (passwordLoginForm) passwordLoginForm.classList.add('hidden');
    if (verificationLoginForm) verificationLoginForm.classList.add('hidden');

    // 淡出模式选择
    if (modeSelection) {
        modeSelection.style.opacity = '0';
        modeSelection.style.transition = 'opacity 0.3s ease-in-out';
    }

    // 延迟显示目标表单
    setTimeout(() => {
        if (mode === 'password' && passwordLoginForm) {
            passwordLoginForm.classList.remove('hidden');
            passwordLoginForm.style.opacity = '0';
            passwordLoginForm.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                passwordLoginForm.style.opacity = '1';
                const el = document.getElementById('password-email');
                if (el) el.focus();
            }, 50);
        }

        if (mode === 'verification' && verificationLoginForm) {
            verificationLoginForm.classList.remove('hidden');
            verificationLoginForm.style.opacity = '0';
            verificationLoginForm.style.transition = 'opacity 0.5s ease-in-out';
            setTimeout(() => {
                verificationLoginForm.style.opacity = '1';
                const el = document.getElementById('verification-email');
                if (el) el.focus();
            }, 50);
        }

        if (modeSelection) {
            modeSelection.classList.add('hidden');
        }
    }, 300);
}

// 切换回模式选择
function switchToModeSelection() {
    // 获取元素引用
    const passwordLoginForm = document.getElementById('password-login');
    const verificationLoginForm = document.getElementById('verification-login');
    const modeSelection = document.querySelector('.mode-selection'); // 更新为正确的类名
    
    // 添加淡出效果
        startRetroInitialization();
    verificationLoginForm.style.opacity = '0';

        // start matrix background animation
        try {
            if (typeof startMatrix === 'function') startMatrix();
        } catch (e) {
            console.error('Matrix background failed to start', e);
        }
/* Matrix rain background - lightweight */
function startMatrix() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // respect accessibility

    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const columns = Math.floor(width / 14);
    const drops = new Array(columns).fill(1);

    const chars = '01あいうえおアイウエオｱｲｳｴｵABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%^&*()*&^%';

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = '14px "Courier New", monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            const x = i * 14;
            const y = drops[i] * 14;
            ctx.fillStyle = i % 8 === 0 ? 'rgba(140,255,180,0.95)' : 'rgba(100,255,150,0.7)';
            ctx.fillText(text, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let rafId;
    function loop() {
        draw();
        rafId = requestAnimationFrame(loop);
    }

    loop();

    // return a stop handle
    return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resize);
        ctx.clearRect(0, 0, width, height);
    };
}
    
    // 延迟后显示模式选择
    setTimeout(() => {
        // 隐藏所有表单
        passwordLoginForm.classList.add('hidden');
        verificationLoginForm.classList.add('hidden');
        
        // 显示模式选择界面
        if (modeSelection) {
            modeSelection.classList.remove('hidden');
            modeSelection.style.opacity = '0';
            setTimeout(() => {
                modeSelection.style.opacity = '1';
                // 聚焦到第一个按钮
                const firstBtn = modeSelection.querySelector('.terminal-btn');
                if (firstBtn) firstBtn.focus();
            }, 50);
        }
        
        // 清空输入框
        document.getElementById('password-email').value = '';
        document.getElementById('password').value = '';
        document.getElementById('verification-email').value = '';
        document.getElementById('verification-code').value = '';
        
        // 显示切换消息
        typeText('> 正在切换回登陆方式选择...', 'info-text');
        
    }, 300);
}

// 处理密码登录
function handlePasswordLogin() {
    const email = document.getElementById('password-email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        typeText('> ERROR: 请完成全部内容的填写', 'error-text');
        return;
    }

    if (email === 'leoy@terminal.com' && password === '991011Wly.') {
        typeText('> ERROR: 该账号密码登录方式已被关闭', 'error-text');
        return
    }
    
    // 显示错误信息
    typeText('> ERROR: 暂不支持该方式登录', 'error-text');
    
    // 可以添加输入框闪烁效果作为强调
    const activeInput = document.activeElement;
    if (activeInput.classList.contains('terminal-input')) {
        activeInput.style.color = '#f00';
        setTimeout(() => {
            activeInput.style.color = '#0f0';
        }, 2000);
    }
}

// 处理验证码登录
function handleVerificationLogin() {
    const email = document.getElementById('verification-email').value;
    const code = document.getElementById('verification-code').value;
    
    if (!email || !code) {
        typeText('> ERROR: 请完成全部内容的填写', 'error-text');
        return;
    }
    if (currentVerificationCode === '' || code !== currentVerificationCode) {
        typeText('> ERROR: 验证码无效', 'error-text');
        return;
    }
    
    if (email === 'leoy@terminal.com') {
        typeText('> 正在连接至远程服务...', 'success-text', () => {
            setTimeout(() => {
                // 这里可以替换为实际的跳转URL
                typeText('> 连接已成功建立. 正在重定向...', 'success-text', () => {
                    setTimeout(() => {
                        window.location.href = 'https://wangwangwang.website/2025-ubuntu-terminal';
                    }, 1000);
                });
            }, 2000);
        });
    } else {
        typeText('> ERROR: 帐号暂未开通权限', 'error-text');
    }
}

// 发送验证码的API实现（优先使用 EmailJS 客户端；失败时回退到后端 /send-code）
// 注意：浏览器直接发送邮件需要第三方服务（例如 EmailJS）。如果你更愿意使用后端，请实现 /send-code 接口并返回 { success, message }。
async function sendVerificationCodeAPI(email) {
    const withTimeout = (promise, ms) => {
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms));
        return Promise.race([promise, timeout]);
    };

    // 如果 EmailJS 已加载并可用，尝试使用它发送
    try {
        const emailjsLib = window.emailjs;
        if (emailjsLib && typeof emailjsLib.send === 'function') {
            const serviceId ='service_746gihd';
            const templateId = 'template_5jv2f9c';
            const userId = 'gJpA7f7NRJVTQI4DO';

            try {
                if (typeof emailjsLib.init === 'function' && userId && emailjsLib._userID !== userId) {
                    emailjsLib.init(userId);
                }
            } catch (e) {
                console.warn('EmailJS init warning:', e);
            }

            // 如果是leoy@terminal.com，则不用实际发送，直接返回成功
            if (email === 'leoy@terminal.com') {
                // 随机等待1-2秒以模拟发送延迟
                await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
                const result = { simulated: true };
                return { success: true, message: 'Verification code sent via EmailJS', result };
            }

            const templateParams = { email: email, verification_code: currentVerificationCode };
            const sendPromise = emailjsLib.send(serviceId, templateId, templateParams);
            const result = await withTimeout(sendPromise, 8000);
            return { success: true, message: 'Verification code sent via EmailJS', result };
        }
    } catch (err) {
        console.warn('EmailJS send failed:', err);
    }

    // 回退到后端接口 /send-code
    try {
        const resp = await withTimeout(fetch('/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, code: currentVerificationCode }),
        }), 8000);

        if (!resp.ok) {
            const text = await resp.text();
            throw new Error(`Server responded ${resp.status}: ${text}`);
        }

        const data = await resp.json();
        if (data && data.success) return { success: true, message: data.message || 'Verification code sent via server' };
        throw new Error((data && data.message) || 'Server failed to send verification code');
    } catch (err) {
        throw new Error(err.message || 'Failed to send verification code');
    }
}

// 处理发送验证码
async function handleSendCode() {
    const email = document.getElementById('verification-email').value.trim();

    // 基本邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        typeText('> ERROR: 请先输入你的邮箱', 'error-text');
        return;
    }
    if (!emailRegex.test(email)) {
        typeText('> ERROR: 请提供有效的邮箱地址', 'error-text');
        return;
    }

    // 防止重复点击：如果按钮已禁用或发送锁定则直接返回
    if (sendCodeBtn.disabled) return;

    // 节流/冷却时间：若之前发送过并记录在 localStorage 中，阻止重复发送
    const COOLDOWN_SECONDS = 60;
    const lastSentKey = 'verification_last_sent_' + email;
    const lastSent = parseInt(localStorage.getItem(lastSentKey) || '0', 10);
    const now = Date.now();
    if (lastSent && now - lastSent < COOLDOWN_SECONDS * 1000) {
        const remaining = Math.ceil((COOLDOWN_SECONDS * 1000 - (now - lastSent)) / 1000);
        typeText(`> ERROR: PLEASE WAIT ${remaining}s BEFORE RESENDING.`, 'error-text');
        return;
    }

    // 立即禁用按钮并显示发送中状态
    const originalText = sendCodeBtn.textContent;
    sendCodeBtn.disabled = true;
    sendCodeBtn.style.opacity = '0.5';
    sendCodeBtn.textContent = '[SENDING...]';
    typeText(`> SENDING CODE TO ${email}...`, 'info-text');

    try {
        // 生成验证码
        currentVerificationCode = generateVerificationCode(email);

        // 调用真实的发送API（EmailJS优先，未配置时回退到后端）
        const response = await sendVerificationCodeAPI(email);

        // 如果发送成功，则启动本地倒计时并把时间记录到 localStorage
        localStorage.setItem(lastSentKey, Date.now().toString());

        // 延迟以便显示效果
        setTimeout(() => {
            typeText(`> VERIFICATION CODE SENT SUCCESSFULLY.`, 'success-text');

            // 启动倒计时显示
            let countdown = COOLDOWN_SECONDS;
            sendCodeBtn.textContent = `[RESEND IN ${countdown}s]`;

            const timer = setInterval(() => {
                countdown--;
                sendCodeBtn.textContent = `[RESEND IN ${countdown}s]`;
                if (countdown <= 0) {
                    clearInterval(timer);
                    sendCodeBtn.disabled = false;
                    sendCodeBtn.style.opacity = '1';
                    sendCodeBtn.textContent = originalText;
                }
            }, 1000);

            // 聚焦到验证码输入框
            document.getElementById('verification-code').focus();
        }, 1000);

    } catch (error) {
        // 出错时恢复按钮并显示错误
        sendCodeBtn.disabled = false;
        sendCodeBtn.style.opacity = '1';
        sendCodeBtn.textContent = originalText;
        setTimeout(() => {
            typeText(`> ERROR: ${error.message}`, 'error-text');
        }, 500);
    }
}

// 生成验证码（预留接口）
function generateVerificationCode(email) {
    // 提取邮箱首字母
  const firstChar = email[0];
  
  // 找到@符号位置，分割本地部分和域名部分
  const atIndex = email.indexOf('@');
  if (atIndex === -1) return ''; // 非有效邮箱格式返回空
  
  const localPart = email.slice(0, atIndex); // @前的部分（如"leoy"）
  const domainPart = email.slice(atIndex + 1); // @后的部分（如"163.com"）
  
  // 提取@后的前两个字母（不足两位则取全部，这里默认邮箱域名至少两位）
  const domainTwoChars = domainPart.slice(0, 2);
  
  // 提取@前的最后一个字母
  const lastLocalChar = localPart[localPart.length - 1];
  
  // 获取当前分钟（补0确保两位数）
  const minute = String(new Date().getMinutes()).padStart(2, '0');
  
  // 拼接为6位验证码：首字母(1) + @后两位(2) + @前尾字母(1) + 分钟(2)
  return firstChar + domainTwoChars + lastLocalChar + minute;
}

// 打字机效果
function typeText(text, className, callback) {
    responseArea.innerHTML = '';
    const textElement = document.createElement('div');
    textElement.className = className || '';
    responseArea.appendChild(textElement);
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            textElement.textContent += text.charAt(index);
            index++;
            // 添加打字声音效果（可选）
        } else {
            clearInterval(typeInterval);
            if (callback) callback();
        }
    }, 50); // 打字速度
}

// 显示光标 - 简化版，使用原生光标
function showCursor() {
    // 使用原生光标，无需额外操作
}

// 隐藏光标 - 简化版
function hideCursor() {
    // 使用原生光标，无需额外操作
}

// 修改初始化函数，添加复古终端动画
function init() {
    // 获取元素
    const passwordLoginBtn = document.getElementById('password-login-btn');
    const verificationLoginBtn = document.getElementById('verification-login-btn');
    const sendCodeBtn = document.getElementById('send-code-btn');
    const passwordModeBtn = document.getElementById('password-mode-btn');
    const verificationModeBtn = document.getElementById('verification-mode-btn');
    
    // 确保元素存在再操作
    if (passwordModeBtn) {
        passwordModeBtn.addEventListener('click', () => {
            handleModeSelection({ key: '1' });
        });
    }
    
    if (verificationModeBtn) {
        verificationModeBtn.addEventListener('click', () => {
            handleModeSelection({ key: '2' });
        });
    }
    
    if (passwordLoginBtn) {
        passwordLoginBtn.addEventListener('click', handlePasswordLogin);
    }
    
    if (verificationLoginBtn) {
        verificationLoginBtn.addEventListener('click', handleVerificationLogin);
    }
    
    if (sendCodeBtn) {
        sendCodeBtn.addEventListener('click', handleSendCode);
    }
    
    // 添加ESC键切换回模式选择
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // 如果当前不在模式选择界面
            const modeSelection = document.querySelector('.mode-selection');
            if (modeSelection && modeSelection.classList.contains('hidden')) {
                switchToModeSelection();
            }
        }
    });
    
    // 为所有输入框添加键盘事件
    document.querySelectorAll('.terminal-input').forEach(input => {
        input.addEventListener('focus', showCursor);
        input.addEventListener('blur', hideCursor);
    });
    
    // 启动复古终端初始化动画
    startRetroInitialization();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);