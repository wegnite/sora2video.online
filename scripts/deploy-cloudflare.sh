#!/bin/bash

# AI Polaroid Photo - Cloudflare 部署脚本
# 使用方法: ./scripts/deploy-cloudflare.sh [环境]
# 环境: dev, staging, production (默认: production)

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 打印带颜色的消息
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

# 检查必需的工具
check_requirements() {
    print_info "检查部署要求..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js 未安装"
        exit 1
    fi
    
    # 检查 pnpm
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm 未安装，请运行: npm install -g pnpm"
        exit 1
    fi
    
    # 检查 wrangler
    if ! command -v wrangler &> /dev/null; then
        print_error "wrangler 未安装，请运行: npm install -g wrangler"
        exit 1
    fi
    
    print_success "所有必需工具已安装"
}

# 检查 Cloudflare 登录状态
check_cloudflare_auth() {
    print_info "检查 Cloudflare 认证状态..."
    
    if ! wrangler whoami &> /dev/null; then
        print_error "未登录 Cloudflare，请运行: wrangler login"
        exit 1
    fi
    
    print_success "Cloudflare 认证正常"
}

# 安装依赖
install_dependencies() {
    print_info "安装项目依赖..."
    pnpm install
    print_success "依赖安装完成"
}

# 生成类型文件
generate_types() {
    print_info "生成 Cloudflare 类型文件..."
    pnpm run cf-typegen
    print_success "类型文件生成完成"
}

# 运行代码检查
run_linting() {
    print_info "运行代码检查..."
    
    if ! pnpm run lint; then
        print_warning "代码检查发现问题，是否继续部署？(y/N)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_error "部署已取消"
            exit 1
        fi
    fi
    
    print_success "代码检查完成"
}

# 构建项目
build_project() {
    print_info "构建项目..."
    
    # 清理之前的构建
    rm -rf .next
    rm -rf .open-next
    
    # 构建项目
    pnpm run build
    
    print_success "项目构建完成"
}

# 检查环境变量
check_environment_variables() {
    print_info "检查环境变量配置..."
    
    # 检查必需的公开变量
    required_public_vars=(
        "NEXT_PUBLIC_BASE_URL"
    )
    
    missing_vars=()
    
    for var in "${required_public_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            missing_vars+=("$var")
        fi
    done
    
    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_warning "缺少以下环境变量："
        for var in "${missing_vars[@]}"; do
            echo "  - $var"
        done
        print_info "这些变量应该在 wrangler.jsonc 的 vars 部分或通过 wrangler secret 设置"
    fi
    
    print_success "环境变量检查完成"
}

# 预览部署
preview_deployment() {
    print_info "启动预览部署..."
    print_warning "预览将在本地运行，按 Ctrl+C 停止预览"
    
    pnpm run preview
}

# 实际部署
deploy_to_cloudflare() {
    local env=${1:-production}
    
    print_info "开始部署到 Cloudflare ($env)..."
    
    # 根据环境选择不同的配置
    case $env in
        "dev"|"development")
            print_info "部署到开发环境..."
            wrangler deploy --env dev
            ;;
        "staging")
            print_info "部署到测试环境..."
            wrangler deploy --env staging
            ;;
        "production"|"prod")
            print_info "部署到生产环境..."
            pnpm run deploy
            ;;
        *)
            print_error "未知环境: $env"
            print_info "支持的环境: dev, staging, production"
            exit 1
            ;;
    esac
    
    print_success "部署完成！"
}

# 部署后检查
post_deploy_check() {
    local base_url="${NEXT_PUBLIC_BASE_URL:-https://sora2video.online}"
    
    print_info "进行部署后检查..."
    
    # 检查网站是否可访问
    if curl -s --head "$base_url" | head -n 1 | grep -q "200 OK"; then
        print_success "网站可以正常访问: $base_url"
    else
        print_warning "网站可能还没有完全部署，请稍后再试"
    fi
    
    print_info "部署后检查项目："
    echo "  - 访问网站: $base_url"
    echo "  - 测试用户注册/登录"
    echo "  - 测试 AI 图像生成功能"
    echo "  - 检查支付流程"
    echo "  - 验证邮件发送功能"
}

# 主函数
main() {
    local env=${1:-production}
    local preview_only=${2:-false}
    
    echo "🚀 AI Polaroid Photo - Cloudflare 部署脚本"
    echo "=============================================="
    
    # 检查要求
    check_requirements
    check_cloudflare_auth
    
    # 准备部署
    install_dependencies
    generate_types
    check_environment_variables
    run_linting
    build_project
    
    # 部署选项
    if [[ "$preview_only" == "preview" ]] || [[ "$2" == "preview" ]]; then
        preview_deployment
    else
        # 确认部署
        print_warning "即将部署到 $env 环境，确认继续？(y/N)"
        read -r response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            deploy_to_cloudflare "$env"
            post_deploy_check
        else
            print_info "部署已取消"
            exit 0
        fi
    fi
}

# 显示帮助信息
show_help() {
    echo "AI Polaroid Photo - Cloudflare 部署脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [环境] [选项]"
    echo ""
    echo "环境:"
    echo "  dev          部署到开发环境"
    echo "  staging      部署到测试环境"
    echo "  production   部署到生产环境 (默认)"
    echo ""
    echo "选项:"
    echo "  preview      只启动预览，不实际部署"
    echo ""
    echo "示例:"
    echo "  $0                     # 部署到生产环境"
    echo "  $0 staging             # 部署到测试环境"
    echo "  $0 production preview  # 预览生产环境部署"
    echo ""
    echo "环境变量配置:"
    echo "  确保已通过 'wrangler secret put' 设置所有必需的密钥"
    echo "  公开变量在 wrangler.jsonc 的 vars 部分配置"
}

# 脚本入口点
if [[ "${1:-}" == "help" ]] || [[ "${1:-}" == "--help" ]] || [[ "${1:-}" == "-h" ]]; then
    show_help
    exit 0
fi

# 运行主函数
main "$@"
