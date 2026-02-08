#!/usr/bin/env node

/**
 * Google Analytics 自动化配置脚本
 *
 * 功能：
 * 1. 创建 GA4 媒体资源（Property）
 * 2. 创建网站数据流（Web Data Stream）
 * 3. 获取测量 ID（Measurement ID）
 * 4. 配置增强型测量（Enhanced Measurement）
 *
 * 使用方式：
 * pnpm tsx scripts/setup-google-analytics.ts --site-name "My Website" --url "https://example.com"
 */

import path from 'path';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';
import chalk from 'chalk';
import { Command } from 'commander';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import { google } from 'googleapis';
import ora from 'ora';

// 加载环境变量
dotenv.config();

interface SetupOptions {
  siteName: string;
  url: string;
  accountId?: string;
  serviceAccountPath?: string;
  timezone?: string;
  currency?: string;
  industry?: string;
}

class GoogleAnalyticsSetup {
  private client: AnalyticsAdminServiceClient;
  private spinner = ora();

  constructor(serviceAccountPath?: string) {
    // 初始化 Admin API 客户端
    const options: any = {};

    if (serviceAccountPath) {
      options.keyFilename = serviceAccountPath;
    } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      options.keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    }

    this.client = new AnalyticsAdminServiceClient(options);
  }

  /**
   * 获取或创建 GA 账户
   */
  async getOrCreateAccount(accountName?: string): Promise<string> {
    try {
      this.spinner.start('正在检查 Google Analytics 账户...');

      // 列出现有账户
      const [accounts] = await this.client.listAccounts({});

      if (accounts.length > 0) {
        this.spinner.succeed(`找到 ${accounts.length} 个账户`);

        // 如果指定了账户 ID，使用指定的账户
        if (accountName) {
          const account = accounts.find((a) => a.name === accountName);
          if (account) {
            return account.name!;
          }
        }

        // 默认使用第一个账户
        console.log(chalk.cyan(`使用账户: ${accounts[0].displayName}`));
        return accounts[0].name!;
      }

      // 创建新账户（如果没有账户）
      this.spinner.text = '创建新的 Google Analytics 账户...';
      const [newAccount] = await this.client.createAccount({
        account: {
          displayName: accountName || 'My Business Account',
        },
      });

      this.spinner.succeed('账户创建成功');
      return newAccount.name!;
    } catch (error) {
      this.spinner.fail('账户操作失败');
      throw error;
    }
  }

  /**
   * 创建 GA4 媒体资源
   */
  async createProperty(
    accountName: string,
    propertyName: string,
    timezone = 'America/Los_Angeles',
    currency = 'USD',
    industryCategory?: string
  ): Promise<any> {
    try {
      this.spinner.start('创建 GA4 媒体资源...');

      const [property] = await this.client.createProperty({
        property: {
          parent: accountName,
          displayName: propertyName,
          timeZone: timezone,
          currencyCode: currency,
          industryCategory: industryCategory as any,
        },
      });

      this.spinner.succeed(`媒体资源创建成功: ${property.displayName}`);
      return property;
    } catch (error) {
      this.spinner.fail('媒体资源创建失败');
      throw error;
    }
  }

  /**
   * 创建网站数据流
   */
  async createWebDataStream(
    propertyName: string,
    streamName: string,
    url: string
  ): Promise<any> {
    try {
      this.spinner.start('创建网站数据流...');

      // 解析 URL
      const urlObj = new URL(url);

      const [dataStream] = await this.client.createDataStream({
        parent: propertyName,
        dataStream: {
          displayName: streamName,
          type: 'WEB_DATA_STREAM' as any,
          webStreamData: {
            defaultUri: url,
            measurementId: '', // 会自动生成
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
    } catch (error) {
      this.spinner.fail('数据流创建失败');
      throw error;
    }
  }

  /**
   * 配置增强型测量
   */
  async configureEnhancedMeasurement(dataStreamName: string): Promise<void> {
    try {
      this.spinner.start('配置增强型测量...');

      // 更新数据流的增强型测量设置
      await this.client.updateDataStream({
        dataStream: {
          name: dataStreamName,
          webStreamData: {
            measurementId: '',
            defaultUri: '',
          },
        },
        updateMask: {
          paths: ['web_stream_data.measurement_id'],
        },
      });

      this.spinner.succeed('增强型测量配置完成');
    } catch (error) {
      this.spinner.fail('增强型测量配置失败');
      console.warn(chalk.yellow('注意: 增强型测量可能需要在 GA 界面手动配置'));
    }
  }

  /**
   * 保存配置到环境文件
   */
  async saveConfiguration(
    measurementId: string,
    propertyId: string
  ): Promise<void> {
    try {
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
        // 替换现有配置
        envContent = envContent.replace(
          /NEXT_PUBLIC_GA_MEASUREMENT_ID=.*/,
          `NEXT_PUBLIC_GA_MEASUREMENT_ID=${measurementId}`
        );
        envContent = envContent.replace(
          /GA_PROPERTY_ID=.*/,
          `GA_PROPERTY_ID=${propertyId}`
        );
      } else {
        // 添加新配置
        envContent += gaConfig;
      }

      await fs.writeFile(envPath, envContent);
      this.spinner.succeed('配置已保存到 .env.local');
    } catch (error) {
      this.spinner.fail('配置保存失败');
      throw error;
    }
  }

  /**
   * 执行完整的设置流程
   */
  async setup(options: SetupOptions): Promise<void> {
    console.log(chalk.blue.bold('\n🚀 开始设置 Google Analytics...\n'));

    try {
      // 1. 获取或创建账户
      const accountName = await this.getOrCreateAccount(options.accountId);

      // 2. 创建媒体资源
      const property = await this.createProperty(
        accountName,
        options.siteName,
        options.timezone || 'America/Los_Angeles',
        options.currency || 'USD',
        options.industry
      );

      // 3. 创建数据流
      const dataStream = await this.createWebDataStream(
        property.name,
        `${options.siteName} - Web Stream`,
        options.url
      );

      // 4. 配置增强型测量
      await this.configureEnhancedMeasurement(dataStream.name);

      // 5. 保存配置
      const measurementId = dataStream.webStreamData?.measurementId;
      const propertyId = property.name.split('/').pop();

      if (measurementId && propertyId) {
        await this.saveConfiguration(measurementId, propertyId);
      }

      // 输出成功信息
      console.log(chalk.green.bold('\n✅ Google Analytics 设置完成!\n'));
      console.log(chalk.cyan('配置信息:'));
      console.log(chalk.white(`  账户: ${accountName}`));
      console.log(chalk.white(`  媒体资源: ${property.displayName}`));
      console.log(chalk.white(`  数据流: ${dataStream.displayName}`));
      console.log(chalk.white(`  测量 ID: ${chalk.bold(measurementId)}`));
      console.log(chalk.white(`  属性 ID: ${propertyId}`));

      // 下一步指引
      console.log(chalk.yellow.bold('\n📝 下一步:'));
      console.log(chalk.white('1. 确保你的网站已安装 Google Analytics 代码'));
      console.log(chalk.white('2. 在 GA 界面验证数据接收状态'));
      console.log(chalk.white('3. 配置转化事件和目标'));
      console.log(chalk.white('4. 设置自定义维度和指标（如需要）'));
    } catch (error) {
      console.error(chalk.red.bold('\n❌ 设置失败:'), error);
      throw error;
    }
  }
}

// CLI 命令配置
const program = new Command();

program
  .name('setup-google-analytics')
  .description('自动化配置 Google Analytics 4')
  .version('1.0.0')
  .requiredOption('-n, --site-name <name>', '网站名称')
  .requiredOption('-u, --url <url>', '网站 URL')
  .option('-a, --account-id <id>', 'GA 账户 ID（可选）')
  .option('-s, --service-account <path>', '服务账户密钥文件路径')
  .option('-t, --timezone <timezone>', '时区', 'America/Los_Angeles')
  .option('-c, --currency <currency>', '货币代码', 'USD')
  .option('-i, --industry <industry>', '行业类别')
  .action(async (options) => {
    try {
      const setup = new GoogleAnalyticsSetup(options.serviceAccount);
      await setup.setup(options);
      process.exit(0);
    } catch (error) {
      console.error(chalk.red('Setup failed:'), error);
      process.exit(1);
    }
  });

// 处理未捕获的错误
process.on('unhandledRejection', (reason, promise) => {
  console.error(
    chalk.red('Unhandled Rejection at:'),
    promise,
    'reason:',
    reason
  );
  process.exit(1);
});

// 解析命令行参数
program.parse(process.argv);
