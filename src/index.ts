import { 
  basekit, 
  FieldType, 
  FieldComponent, 
  FieldCode 
} from '@lark-opdev/block-basekit-server-api';

// 添加域名白名单
basekit.addDomainList([
  'collage-service-177821-9-1328689937.sh.run.tcloudbase.com',
  '636c-cloud1-9g9prblyc2ea8ed0-1328689937.tcb.qcloud.la'
]);

// AI拼图接口URL
const COLLAGE_API_URL = 'https://collage-service-177821-9-1328689937.sh.run.tcloudbase.com/api/upload/generate-from-urls';

basekit.addField({
  formItems: [
    {
      key: 'attachments',
      label: '选择图片附件',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
        mode: 'multiple'
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'aspectRatio',
      label: '图片尺寸',
      component: FieldComponent.SingleSelect,
      props: {
        placeholder: '请选择图片尺寸',
        options: [
          { label: '3:4', value: '3:4' },
          { label: '2:3', value: '2:3' },
          { label: '9:16', value: '9:16' }
        ]
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'title',
      label: '图片标题',
      component: FieldComponent.Input,
      props: {
        placeholder: '请输入拼图标题（可选）',
      },
      validator: {
        required: false,
      }
    },
    {
      key: 'accessToken',
      label: '访问令牌',
      component: FieldComponent.Input,
      props: {
        placeholder: '请输入访问令牌',
      },
      validator: {
        required: true,
      }
    }
  ],
  
  resultType: {
    type: FieldType.Attachment,
  },

  execute: async (formItemParams: any, context: any) => {
    try {
      const { attachments, aspectRatio, title, accessToken } = formItemParams;
      
      console.log('接收到的参数:', JSON.stringify(formItemParams, null, 2));
      
      // 检查是否有附件
      if (!attachments || attachments.length === 0) {
        return {
          code: FieldCode.ConfigError,
          msg: '===捷径代码主动返回错误: 请选择至少一个图片附件'
        };
      }

      // 检查访问令牌
      if (!accessToken || !accessToken.trim()) {
        return {
          code: FieldCode.ConfigError,
          msg: '===捷径代码主动返回错误: 请输入访问令牌'
        };
      }

      // 获取图片URL列表 - 注意attachments是嵌套数组
      const imageUrls = attachments[0].map((attachment: any) => attachment.tmp_url);
      console.log('提取的图片URL数量:', imageUrls.length);
      console.log('图片URL列表:', imageUrls);
      
      // 准备请求参数
      const requestBody: any = {
        imageUrls: imageUrls,
        aspectRatio: aspectRatio?.value || '3:4', // 默认3:4
      };
      
      // 只有当用户填写了标题时才添加title参数
      if (title && title.trim()) {
        requestBody.title = title.trim();
      }

      console.log('发送拼图请求:', JSON.stringify(requestBody, null, 2));

      // 调用AI拼图接口
      const response = await context.fetch(COLLAGE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.trim()}`,
          'User-Agent': 'FieldShortcut/1.0.0'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error('拼图接口请求失败:', response.status, response.statusText);
        return {
          code: FieldCode.Error,
          msg: `===捷径代码主动返回错误: 拼图接口请求失败 ${response.status}`
        };
      }

      const result = await response.json();
      console.log('拼图接口返回结果:', JSON.stringify(result, null, 2));

      // 检查接口返回结果
      if (result.code !== 0) {
        return {
          code: FieldCode.Error,
          msg: `===捷径代码主动返回错误: ${result.message || '拼图生成失败'}`
        };
      }

      // 处理返回的图片链接
      const collageResults = result.data?.results || [];
      console.log('AI拼图接口返回的拼图数量:', collageResults.length);
      
      if (collageResults.length === 0) {
        console.log('警告: AI拼图接口未返回任何拼图结果');
        return {
          code: FieldCode.Error,
          msg: '===捷径代码主动返回错误: 未生成任何拼图'
        };
      }

      // 限制最多5张图片
      const limitedResults = collageResults.slice(0, 5);
      console.log('限制后的拼图数量:', limitedResults.length);
      
      // 构建附件数据
      const attachmentData = limitedResults.map((item: any, index: number) => ({
        name: `${item.templateName || '拼图'}_${index + 1}.jpg`,
        content: item.downloadURL,
        contentType: 'attachment/url'
      }));

      console.log('生成的附件数据:', JSON.stringify(attachmentData, null, 2));
      console.log('AI拼图字段捷径执行成功，返回', attachmentData.length, '个附件');

      return {
        code: FieldCode.Success,
        data: attachmentData
      };

    } catch (error: any) {
      console.error('执行过程中发生错误:', error);
      return {
        code: FieldCode.Error,
        msg: `===捷径代码主动返回错误: ${error.message || '未知错误'}`
      };
    }
  }
});

export default basekit;