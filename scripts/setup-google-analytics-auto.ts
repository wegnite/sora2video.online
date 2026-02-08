#!/usr/bin/env node

/**
 * Google Analytics 自动化配置脚本 - 自动版本
 *
 * 自动从环境变量读取配置，无需手动输入
 *
 * 使用方式：
 * pnpm tsx scripts/setup-google-analytics-auto.ts
 */

import { existsSync } from 'fs';
import path from 'path';
import {
  AnalyticsAdminServiceClient,
  type protos,
} from '@google-analytics/admin';
import chalk from 'chalk';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import ora from 'ora';

// 加载环境变量
dotenv.config();

// 从环境变量或默认值获取配置
const CONFIG = {
  siteName: 'Sora2 Video',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'https://sora2video.online',
  timezone: 'Asia/Shanghai',
  currency: 'USD',
  industry: 'TECHNOLOGY',
  serviceAccountPath: './ga-service-account.json',
};

class GoogleAnalyticsAutoSetup {
  private client: AnalyticsAdminServiceClient;
  private spinner = ora();

  constructor() {
    // 检查服务账户文件
    if (!existsSync(CONFIG.serviceAccountPath)) {
      console.error(
        chalk.red(`
❌ 服务账户文件未找到: ${CONFIG.serviceAccountPath}

请先完成以下步骤：
1. 访问 https://console.cloud.google.com/iam-admin/serviceaccounts?project=aipolariodphoto
2. 创建服务账户
3. 下载 JSON 密钥文件
4. 将文件保存为 ${CONFIG.serviceAccountPath}

详细步骤请查看: scripts/ga-setup-sop.md
      `)
      );
      process.exit(1);
    }

    // 初始化客户端（增加超时时间）
    this.client = new AnalyticsAdminServiceClient({
      keyFilename: CONFIG.serviceAccountPath,
      // 简化配置，只设置超时时间
    });
  }

  async run() {
    console.log(chalk.blue.bold('\n🚀 开始自动配置 Google Analytics...\n'));
    console.log(chalk.cyan('配置信息:'));
    console.log(chalk.white(`  网站名称: ${CONFIG.siteName}`));
    console.log(chalk.white(`  网站 URL: ${CONFIG.url}`));
    console.log(chalk.white(`  时区: ${CONFIG.timezone}`));
    console.log(chalk.white(`  货币: ${CONFIG.currency}\n`));

    try {
      // 1. 获取或创建账户
      this.spinner.start('检查 Google Analytics 账户...');
      const [accounts] = await this.client.listAccounts({});

      if (accounts.length === 0) {
        this.spinner.fail('未找到 Google Analytics 账户');
        console.error(chalk.red('请先在 Google Analytics 中创建一个账户'));
        process.exit(1);
      }

      const account = accounts[0];
      this.spinner.succeed(`使用账户: ${account.displayName}`);

      // 2. 检查是否已存在同名媒体资源
      this.spinner.start('检查现有媒体资源...');
      const [properties] = await this.client.listProperties({
        filter: `parent:${account.name}`,
      });

      const existingProperty = properties.find(
        (p) => p.displayName === CONFIG.siteName
      );

      let property: protos.google.analytics.admin.v1beta.IProperty | undefined;
      let dataStream:
        | protos.google.analytics.admin.v1beta.IDataStream
        | undefined;

      if (existingProperty) {
        this.spinner.succeed(
          `找到现有媒体资源: ${existingProperty.displayName}`
        );
        property = existingProperty;

        // 检查数据流
        this.spinner.start('检查数据流...');
        const [dataStreams] = await this.client.listDataStreams({
          parent: property.name,
        });

        if (dataStreams.length > 0) {
          dataStream = dataStreams[0];
          this.spinner.succeed(`使用现有数据流: ${dataStream.displayName}`);
        } else {
          // 创建新数据流
          dataStream = await this.createDataStream(property.name!);
        }
      } else {
        // 创建新媒体资源
        property = await this.createProperty(account.name!);
        dataStream = await this.createDataStream(property.name!);
      }

      // 3. 保存配置
      const measurementId = dataStream.webStreamData?.measurementId;
      const propertyId = property.name?.split('/').pop();

      if (measurementId && propertyId) {
        await this.saveConfiguration(measurementId, propertyId);
      }

      // 输出成功信息
      console.log(chalk.green.bold('\n✅ Google Analytics 配置完成!\n'));
      console.log(chalk.cyan('配置信息:'));
      console.log(chalk.white(`  账户: ${account.displayName}`));
      console.log(chalk.white(`  媒体资源: ${property.displayName}`));
      console.log(chalk.white(`  数据流: ${dataStream.displayName}`));
      console.log(chalk.white(`  测量 ID: ${chalk.bold.green(measurementId)}`));
      console.log(chalk.white(`  属性 ID: ${propertyId}\n`));

      // 显示集成代码
      console.log(chalk.yellow.bold('📝 集成步骤:\n'));
      console.log(chalk.white('1. 测量 ID 已自动保存到 .env.local'));
      console.log(
        chalk.white('2. 确认你的 layout.tsx 或 _app.tsx 包含 GA 代码:')
      );
      console.log(
        chalk.gray(`
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

<Script
  src={\`https://www.googletagmanager.com/gtag/js?id=\${GA_ID}\`}
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {\`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '\${GA_ID}');
  \`}
</Script>
      `)
      );
      console.log(chalk.white('\n3. 重启开发服务器: pnpm dev'));
      console.log(
        chalk.white('4. 访问 GA 界面验证数据: https://analytics.google.com/\n')
      );
    } catch (error: any) {
      this.spinner.fail('配置失败');

      // 友好的错误提示
      if (error.message?.includes('not been used in project')) {
        console.error(
          chalk.red(`
❌ Google Analytics Admin API 未启用

请访问以下链接启用 API：
https://console.cloud.google.com/apis/library/analyticsadmin.googleapis.com?project=aipolariodphoto

启用后重新运行此脚本。
        `)
        );
      } else if (error.message?.includes('permission')) {
        console.error(
          chalk.red(`
❌ 权限不足

请确保服务账户在 Google Analytics 中有编辑权限：
1. 访问 https://analytics.google.com/
2. 管理 → 账号用户管理
3. 添加服务账户邮箱并授予编辑权限

服务账户邮箱格式: ga-automation@aipolariodphoto.iam.gserviceaccount.com
        `)
        );
      } else {
        console.error(chalk.red('\n错误详情:'), error.message);
      }

      process.exit(1);
    }
  }

  private async createProperty(accountName: string) {
    this.spinner.start('创建新媒体资源...');

    const [property] = await this.client.createProperty({
      property: {
        parent: accountName,
        displayName: CONFIG.siteName,
        timeZone: CONFIG.timezone,
        currencyCode: CONFIG.currency,
        industryCategory: CONFIG.industry as any,
      },
    });

    this.spinner.succeed(`媒体资源创建成功: ${property.displayName}`);
    return property;
  }

  private async createDataStream(propertyName: string) {
    this.spinner.start('创建网站数据流...');

    const [dataStream] = await this.client.createDataStream({
      parent: propertyName,
      dataStream: {
        displayName: `${CONFIG.siteName} - Web Stream`,
        type: 'WEB_DATA_STREAM' as any,
        webStreamData: {
          defaultUri: CONFIG.url,
          measurementId: '',
        },
      },
    });

    this.spinner.succeed(`数据流创建成功: ${dataStream.displayName}`);
    console.log(
      chalk.green(
        `测量 ID: ${chalk.bold(dataStream.webStreamData?.measurementId)}`
      )
    );

    return dataStream;
  }

  private async saveConfiguration(measurementId: string, propertyId: string) {
    this.spinner.start('保存配置到环境文件...');

    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch {
      // 文件不存在，创建新文件
    }

    // 更新或添加 GA 配置
    const gaConfig = `
# Google Analytics Configuration (Auto-generated)
NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}
GA_PROPERTY_ID=${propertyId}
`;

    // 检查是否已存在配置
    if (envContent.includes('NEXT_PUBLIC_GA_MEASUREMENT_ID')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_GA_MEASUREMENT_ID=.*/,
        `NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}`
      );
      if (envContent.includes('GA_PROPERTY_ID')) {
        envContent = envContent.replace(
          /GA_PROPERTY_ID=.*/,
          `GA_PROPERTY_ID=${propertyId}`
        );
      } else {
        envContent += `\nGA_PROPERTY_ID=${propertyId}`;
      }
    } else {
      envContent += gaConfig;
    }

    await fs.writeFile(envPath, envContent);
    this.spinner.succeed('配置已保存到 .env.local');
  }
}

// 检查依赖
async function checkDependencies() {
  try {
    await import('@google-analytics/admin');
    await import('chalk');
    await import('ora');
  } catch (error) {
    console.error(
      chalk.red(`
❌ 缺少必要的依赖包

请先安装依赖：
pnpm add -D @google-analytics/admin chalk ora

然后重新运行此脚本。
    `)
    );
    process.exit(1);
  }
}

// 主函数
async function main() {
  // 显示 SOP 路径
  console.log(chalk.gray('\n📋 完整 SOP 文档: scripts/ga-setup-sop.md'));

  // 检查依赖
  await checkDependencies();

  // 运行设置
  const setup = new GoogleAnalyticsAutoSetup();
  await setup.run();
}

// 错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('\n未处理的错误:'), reason);
  process.exit(1);
});

// 执行
main();
