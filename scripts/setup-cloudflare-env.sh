#!/bin/bash

# Sora2 Video - Cloudflare 环境变量设置脚本
# 使用方法: ./scripts/setup-cloudflare-env.sh

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 检查 Wrangler 是否已安装并登录
check_wrangler() {
    if ! command -v wrangler &> /dev/null; then
        print_error "wrangler 未安装，请运行: npm install -g wrangler"
        exit 1
    fi
    
    if ! wrangler whoami &> /dev/null; then
        print_error "未登录 Cloudflare，请运行: wrangler login"
        exit 1
    fi
    
    print_success "Wrangler 已准备就绪"
}

# 安全地设置密钥
set_secret() {
    local key=$1
    local description=$2
    local required=${3:-true}
    
    print_info "设置 $key"
    echo "描述: $description"
    
    if [[ "$required" == "true" ]]; then
        echo -e "${RED}(必需)${NC}"
    else
        echo -e "${YELLOW}(可选)${NC}"
    fi
    
    read -s -p "请输入 $key 的值 (输入为空跳过): " value
    echo
    
    if [[ -n "$value" ]]; then
        echo "$value" | wrangler secret put "$key"
        print_success "$key 设置成功"
    elif [[ "$required" == "true" ]]; then
        print_warning "$key 是必需的，但已跳过"
    else
        print_info "$key 已跳过"
    fi
    
    echo
}

# 核心必需环境变量
setup_core_secrets() {
    print_info "=== 核心配置 ==="
    
    set_secret "DATABASE_URL" "PostgreSQL 数据库连接字符串 (Neon/Supabase)" true
    set_secret "BETTER_AUTH_SECRET" "身份验证密钥 (使用: openssl rand -base64 32)" true
}

# OAuth 配置
setup_oauth_secrets() {
    print_info "=== OAuth 认证配置 ==="
    
    set_secret "GITHUB_CLIENT_ID" "GitHub OAuth 客户端 ID" false
    set_secret "GITHUB_CLIENT_SECRET" "GitHub OAuth 客户端密钥" false
    set_secret "GOOGLE_CLIENT_ID" "Google OAuth 客户端 ID" false
    set_secret "GOOGLE_CLIENT_SECRET" "Google OAuth 客户端密钥" false
}

# 邮件服务配置
setup_email_secrets() {
    print_info "=== 邮件服务配置 (Resend) ==="
    
    set_secret "RESEND_API_KEY" "Resend API 密钥" true
    set_secret "RESEND_AUDIENCE_ID" "Resend 受众 ID (用于newsletter)" false
}

# 支付服务配置
setup_payment_secrets() {
    print_info "=== 支付服务配置 (Stripe) ==="
    
    set_secret "STRIPE_SECRET_KEY" "Stripe 私钥" true
    set_secret "STRIPE_WEBHOOK_SECRET" "Stripe Webhook 密钥" true
}

# 存储服务配置
setup_storage_secrets() {
    print_info "=== 存储服务配置 (R2/S3) ==="
    
    set_secret "STORAGE_ACCESS_KEY_ID" "存储访问密钥 ID" true
    set_secret "STORAGE_SECRET_ACCESS_KEY" "存储私钥" true
    set_secret "STORAGE_ENDPOINT" "存储端点 URL" true
    set_secret "STORAGE_PUBLIC_URL" "存储公开 URL" true
}

# AI 服务配置
setup_ai_secrets() {
    print_info "=== AI 服务配置 ==="
    
    set_secret "OPENAI_API_KEY" "OpenAI API 密钥" false
    set_secret "REPLICATE_API_TOKEN" "Replicate API 令牌" false
    set_secret "FAL_API_KEY" "Fal AI API 密钥" false
    set_secret "FIREWORKS_API_KEY" "Fireworks AI API 密钥" false
    set_secret "DEEPSEEK_API_KEY" "DeepSeek API 密钥" false
    set_secret "GOOGLE_GENERATIVE_AI_API_KEY" "Google Gemini API 密钥" false
    set_secret "OPENROUTER_API_KEY" "OpenRouter API 密钥" false
}

# 安全配置
setup_security_secrets() {
    print_info "=== 安全配置 (Cloudflare Turnstile) ==="
    
    set_secret "TURNSTILE_SECRET_KEY" "Cloudflare Turnstile 私钥" false
}

# 通知配置
setup_notification_secrets() {
    print_info "=== 通知配置 ==="
    
    set_secret "DISCORD_WEBHOOK_URL" "Discord Webhook URL" false
    set_secret "FEISHU_WEBHOOK_URL" "飞书 Webhook URL" false
}

# 其他服务配置
setup_other_secrets() {
    print_info "=== 其他服务配置 ==="
    
    set_secret "FIRECRAWL_API_KEY" "Firecrawl API 密钥 (网页内容分析)" false
    set_secret "CRON_JOBS_USERNAME" "定时任务用户名" false
    set_secret "CRON_JOBS_PASSWORD" "定时任务密码" false
}

# 显示公开环境变量配置
show_public_vars() {
    print_info "=== 公开环境变量配置 ==="
    
    echo "以下变量需要在 wrangler.jsonc 的 vars 部分配置："
    echo ""
    echo "必需的公开变量:"
    echo "  NEXT_PUBLIC_BASE_URL: https://your-domain.com"
    echo "  NEXT_URL: https://your-domain.com"
    echo "  VERCEL_URL: your-domain.com"
    echo "  DISABLE_IMAGE_OPTIMIZATION: true"
    echo "  NEXT_PUBLIC_DEMO_WEBSITE: false"
    echo ""
    echo "可选的公开变量:"
    echo "  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: G-XXXXXXXXXX"
    echo "  NEXT_PUBLIC_TURNSTILE_SITE_KEY: 0x4AAAAAAA..."
    echo "  NEXT_PUBLIC_CRISP_WEBSITE_ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    echo "  以及各种 Stripe 价格 ID..."
    echo ""
    print_warning "请手动编辑 wrangler.jsonc 文件来设置这些变量"
}

# 验证设置
verify_secrets() {
    print_info "=== 验证已设置的密钥 ==="
    
    echo "已设置的密钥列表:"
    wrangler secret list
    
    echo ""
    print_success "密钥设置验证完成"
}

# 创建必需的 Cloudflare 资源
create_cloudflare_resources() {
    print_info "=== 创建 Cloudflare 资源 ==="
    
    print_warning "是否创建必需的 Cloudflare 资源？(y/N)"
    read -r response
    
    if [[ "$response" =~ ^[Yy]$ ]]; then
        # 创建 R2 存储桶
        print_info "创建 R2 存储桶..."
        
        if wrangler r2 bucket create sora2video-cache 2>/dev/null; then
            print_success "缓存存储桶创建成功"
        else
            print_warning "缓存存储桶可能已存在"
        fi
        
        if wrangler r2 bucket create sora2video-files 2>/dev/null; then
            print_success "文件存储桶创建成功"
        else
            print_warning "文件存储桶可能已存在"
        fi
        
        # Hyperdrive 配置
        print_info "Hyperdrive 配置需要手动创建"
        echo "请运行以下命令创建 Hyperdrive 配置:"
        echo "wrangler hyperdrive create my-hyperdrive --connection-string=\"your-database-url\""
        echo "然后更新 wrangler.jsonc 中的 hyperdrive id"
    fi
}

# 主菜单
show_menu() {
    echo "🔧 Sora2 Video - Cloudflare 环境配置"
    echo "=============================================="
    echo ""
    echo "请选择要配置的部分:"
    echo "1) 核心配置 (数据库、认证)"
    echo "2) OAuth 认证"
    echo "3) 邮件服务"
    echo "4) 支付服务"
    echo "5) 存储服务"
    echo "6) AI 服务"
    echo "7) 安全配置"
    echo "8) 通知配置"
    echo "9) 其他服务"
    echo "a) 全部配置"
    echo "v) 查看公开变量配置"
    echo "r) 创建 Cloudflare 资源"
    echo "l) 列出已设置的密钥"
    echo "q) 退出"
    echo ""
}

# 主函数
main() {
    check_wrangler
    
    while true; do
        show_menu
        read -p "请选择 (1-9/a/v/r/l/q): " choice
        echo ""
        
        case $choice in
            1) setup_core_secrets ;;
            2) setup_oauth_secrets ;;
            3) setup_email_secrets ;;
            4) setup_payment_secrets ;;
            5) setup_storage_secrets ;;
            6) setup_ai_secrets ;;
            7) setup_security_secrets ;;
            8) setup_notification_secrets ;;
            9) setup_other_secrets ;;
            a|A) 
                setup_core_secrets
                setup_oauth_secrets
                setup_email_secrets
                setup_payment_secrets
                setup_storage_secrets
                setup_ai_secrets
                setup_security_secrets
                setup_notification_secrets
                setup_other_secrets
                ;;
            v|V) show_public_vars ;;
            r|R) create_cloudflare_resources ;;
            l|L) verify_secrets ;;
            q|Q) 
                print_success "配置完成！"
                echo ""
                print_info "下一步："
                echo "1. 编辑 wrangler.jsonc 设置公开环境变量"
                echo "2. 运行 ./scripts/deploy-cloudflare.sh 进行部署"
                exit 0
                ;;
            *)
                print_error "无效选择，请重试"
                ;;
        esac
        
        echo ""
        read -p "按 Enter 继续..."
        echo ""
    done
}

# 运行主函数
main "$@"