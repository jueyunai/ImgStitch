# 字段捷径介绍

「字段捷径」是多维表格字段级开放能力，支持开发者将 AI 能力、垂直场景应用融入用户的业务系统，降低用户使用门槛，提升渗透率和效率。
字段是多维表格作为数据库产品最基础的能力，覆盖的用户非常广。用户使用字段捷径，一次添加，自动运行，无需额外配置自动化工作流，简单方便。
字段捷径有两种实现方式：

- 公式版：将一个多维表格公式封装成字段捷径，使用公式实现功能
	
- FaaS 版：支持编写代码、调用第三方 API，可灵活实现自定义功能
	

![](0.png)![](1.png)

暂时无法在飞书文档外展示此内容

# 开发步骤

## 运行环境

如果项目重度依赖nodejs或者资源消耗巨大，可以选择将复杂逻辑部分部署到你的服务器A，然后仅在字段捷径中放调用服务A的代码。
或者在开发阶段，就使用与线上相同的环境配置，这是线上的运行环境：
Nodejs版本：14.16.0
服务隔离：按插件+租户维度隔离，支持动态伸缩容，最大40个实例
单实例规格配置：1核1G内存
运行超时时间：15 分钟
**一些限制**

1. 请求的并发数不超过400
	
2. 以下三方库无法在沙箱内运行
	1. axios
		
	2. got
		
	3. bcrypt
		
	4. moment
		
	5. jsdom
		
	6. sharp
		
	7. crypto
		

## 初始化项目

在命令行执行以下命令克隆项目模板代码

```JavaScript
git clone https://github.com/Lark-Base-Team/field-demo.git
```

项目目录结构为

```JavaScript
├── config.json // 本地调试授权的配置文件
├── package-lock.json
├── package.json
├── src
│   └── index.ts // 项目入口文件
└── tsconfig.json
```

### 其他功能的代码示例

为了方便你了解如何开发一个字段捷径，我们还提供了其他功能的代码示例

1. [field-demo](https://github.com/Lark-Base-Team/field-demo)的feat-ocr分支：展示了一个接收附件字段作为输入，发起 mock API然后返回发票Object字段的插件
	
2. [field-demo](https://github.com/Lark-Base-Team/field-demo)的feat-attachment分支：展示了一个接收文本字段作为输入，解析文本的URL然后返回附件字段的插件
	

## 调试表单UI

### 第一步：启动本地服务

在克隆下来的项目根目录中执行以下命令启动本地服务：

```Bash
# 安装依赖
npm install

# 启动本地服务
npm run start
```

### 第二步：创建调试字段

基于[FaaS字段捷径调试模板](https://feishu.feishu.cn/base/DiQXbSLkSaGmwUsHkfJcAscunlh?table=tblwp5TejhYSjeNU&view=vewPbLApNL)复制副本，然后点击右侧边栏的「字段捷径调试助手」，或者直接在侧边栏插件市场中搜索“字段捷径调试助手”，然后运行，pin到侧边栏即可。
![](2.png)
使用模板中的“字段捷径开发助手”
在插件市场中添加“字段捷径开发助手”

<br>

**在确保本地服务已启动的情况下**，点击打开面板按钮，字段的相关配置（表单 UI、关联字段等信息）便会显示在创建字段的面板上。
![](3.png)
以 `feat-ocr` 示例代码为例，选择必填的附件字段后点击保存便能创建一个调试字段：
![](4.png)
![](5.png)
<br>

需要注意的是，通过【字段捷径调试助手】创建的捷径字段，只会自动生成第一行的值，并且要保证【字段捷径调试助手】和【本地服务】处于运行状态。
<br>

### 第三步：模拟 FaaS 请求

选择需要进行调试的 FaaS 字段，点击**「调试字段」****：** 
![](6.png)
调试插件便会模拟请求 FaaS 的行为，将你的`execute`函数执行结果写入多维表格。目前我们仅支持本地模拟请求 FaaS 调试，目前调试模式下的插件只能使用「字段捷径调试助手」触发更新，无法通过自动更新，未来我们还会支持云端调试的方式。

## 发布捷径

在项目目录下执行 `npm run pack`（nodejs版本14.16.0及以上），然后将`output/output.zip`文件上传即可。
上线后则需要将你的项目提交到 Github 上，然后提交[多维表格捷径插件表单](https://feishu.feishu.cn/share/base/form/shrcnwTXnFVAbMPOSeaOFwIAnbf)
<br>

# 捷径插件的结构

捷径主要由`formItems`、`execute`、`resultType`3个主要属性组成，它们描述了插件入参、执行函数和返回结果。

| 捷径属性 | 代码示例 | UI示例 | 说明 |
| --- | --- | --- | --- |
| `formItems` | ```JavaScript | ![](7.png) | `formItems`描述了捷径的UI表单，捷径运行时`formItems`的配置值它会作为`execute`函数的入参 |\
|| basekit.addField({ |\
||   formItems: [ |\
||     { |\
||       key: 'attachments', |\
||       label: t('attachmentLabel'), |\
||       component: FieldComponent.FieldSelect, |\
||       props: { |\
||         supportType: [FieldType.Attachment], |\
||       }, |\
||       validator: { |\
||         required: true, |\
||       } |\
||     }, |\
||   ], |\
||   // ... |\
|| }); |\
|| ``` |
| `resultType` | ```JavaScript | ![](8.png) | `resultType`描述了捷径属性字段和类型 |\
|| basekit.addField({ |||\
||   resultType: { |\
||     type: FieldType.Object, |\
||     extra: { |\
||       icon: { |\
||         light: 'https://example.svg', |\
||       }, |\
||       properties: [ |\
||         { |\
||           key: 'id', |\
||           type: FieldType.Text, |\
||           title: 'id', |\
||           hidden: true, |\
||         }, |\
||         { |\
||           key: 'url', |\
||           type: FieldType.Text, |\
||           title: t('url'), |\
||           primary: true, |\
||         }, |\
||         { |\
||           key: 'name', |\
||           type: FieldType.Text, |\
||           title: t('name'), |\
||         }, |\
||         { |\
||           key: 'size', |\
||           type: FieldType.Number, |\
||           title: t('size'), |\
||           extra: { |\
||             formatter: NumberFormatter.DIGITAL_ROUNDED_1, |\
||           }, |\
||         }, |\
||       ], |\
||     }, |\
||   }, |\
||   // ... |\
|| }); |\
|| ``` |
| `execute` | ```JavaScript |  | 捷径的运行函数 |\
|| basekit.addField({ |\
||   execute: async (formItemParams, context) => { |\
||     const { attachments } = formItemParams; |\
||     const attachment = attachments?.[0]; |\
||     if (attachment) { |\
|||\
||       return { |\
||         code: FieldCode.Success, // 0 表示请求成功 |\
||         // data 类型需与下方 resultType 定义一致 |\
||         data: { |\
||           id: attachment.tmp_url ?? '', //  附件临时 url |\
||           url: attachment.tmp_url ?? '', // 附件临时 url |\
||           name: attachment?.name, // 附件名称 |\
||           size: attachment?.size, // 附件尺寸 |\
||         }, |\
||       }; |\
||     } |\
||     return { |\
||       code: FieldCode.Error, |\
||     }; |\
||   }, |\
||   // .. |\
|| }); |\
|| ``` |

# 表单(formItems)

`formItems`用于定义捷径的表单UI，以及接收用户传入的参数，例如你可以通过 `SingleSelect` 声明单选组件，通过`FieldSelect`声明字段选择组件。目前支持以下组件：

## Input 组件

文本输入组件，用户可手动输入，`props`支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| placeholder | string | 输入框提示文字 |

![](9.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute函数入参 | string | 使用 `Input` 组时，多维表格会传递字符串给`execute`函数 |

```JavaScript
import { basekit, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';
basekit.addField({
  formItems: [
    {
      key: 'str',
      label: '请输入文本',
      component: FieldComponent.Input,
      props: {
        placeholder: 'Input组件占位符',
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { str } = formItemParams;
    return {
      code: FieldCode.Success,
      data: {
        str,
      }
    }
  },
});

export default basekit;
```

## SingleSelect 组件

下拉单选组件，用户手动选择下拉项里的值，`props` 支持以下参数

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| placeholder | string | 输入框提示文字 |
| options | { label, value }\[\] | 选项数据，其中`label`为展示文案，`value`为实际值 |

![](10.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute函数入参 | `{label, value}` | 使用 `SingleSelect` 组件时，多维表格会传递对象给`execute`函数 |

```JavaScript
import { basekit, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'singleSelect',
      label: '选择水果',
      component: FieldComponent.SingleSelect,
      props: {
        options: [
          { label: '苹果', value: 'apple'},
          { label: '香蕉', value: 'banana'},
        ]
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { singleSelect } = formItemParams;
    return {
      code: FieldCode.Success,
      data: {
        label: singleSelect.label,
        value: singleSelect.value,
      }
    }
  },
});

export default basekit;
```

## MultipleSelect 组件

下拉多选组件，用户手动选择下拉项里的值，`props` 支持以下参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| placeholder | string | 否 | 输入框提示文字 |
| options | { label, value }\[\] | 是 | 选项数据，其中`label`为展示文案，`value`为实际值 |

![](11.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute函数入参 | `{label, value}[]` | `MultipleSelect` 组件与 `SingleSelect` 组件类似，区别是用户可以选择多个选项，多维表格会传递包含`{label, value}`对象的数组给`execute`函数 |

```JavaScript
import { basekit, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'multipleSelect',
      label: '选择水果',
      component: FieldComponent.MultipleSelect,
      props: {
        options: [
          { label: '苹果', value: 'apple'},
          { label: '香蕉', value: 'banana'},
        ]
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { multipleSelect } = formItemParams;
    const firstSelect = multipleSelect[0];
    return {
      code: FieldCode.Success,
      data: {
        label: firstSelect?.label,
        value: firstSelect?.value,
      }
    }
  },
});

export default basekit;
```

## Radio 组件

单选框组件，`props` 支持以下参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| placeholder | string | 否 | 提示文字 |
| options | { label, value }\[\] | 是 | 选项数据，其中`label`为展示文案，`value`为实际值 |

![](12.png)

|  | 类型 | 说明 |
| --- | --- | --- |
| execute函数入参 | `{label, value}` | `Radio 组件与 SingleSelect 组件类似，适合在选项少于5个时使用，方便用户直接选择。多维表格会传递{label, value}对象给execute函数` |\
|||

```JavaScript
import { basekit, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'radio',
      label: '选择水果',
      component: FieldComponent.Radio,
      props: {
        options: [
          { label: '苹果', value: 'apple'},
          { label: '香蕉', value: 'banana'},
        ]
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { radio } = formItemParams;
    return {
      code: FieldCode.Success,
      data: {
        label: radio.label,
        value: radio.value,
      }
    }
  },
});

export default basekit;
```

## FieldSelect 组件

字段选择组件，`props` 支持以下参数

| 参数 | 类型 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| placeholder | string | 否 | 提示文字 |
| mode | 'single' | 否 | 单选 |
| supportType | FieldType | 否 | 支持哪些字段类型，比如 \[FieldType.Attachment\]则只能选附件字段，目前只支持**文本、单选、多选、日期、附件、数字、复选框、超链接字段** |

其出参的数据结构，根据用户选择的字段有所不同，目前支持以下几种字段类型：

```TypeScript
type SupportedFieldType = FieldType.Text | FieldType.Number | FieldType.Url | FieldType.SingleSelect | FieldType.MultiSelect | FieldType.Attachment | FieldType.Checkbox | FieldType.DateTime
```

### 附件字段

```TypeScript
type AttachmentFieldValue = {
    name: string;
    size: number;
    type: string; // mime
    tmp_url: string;
}
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 附件名称 |
| size | number | 附件大小 |
| type | string | 附件类型 |
| tmp\_url | string | 附件的临时下载地址，附件二级域名为 `feishu.cn` |

处理附件的捷径示例
![](13.png)

```JavaScript
import { basekit, FieldType, field, FieldComponent, AuthorizationType, FieldCode } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'attachments',
      label: t('attachmentLabel'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      }
    },
    {
      key: 'scene',
      label: t('attachmentLabel'),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.SingleSelect],
      },
      validator: {
        required: true,
      }
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    const { attachments } = formItemParams;
    const attachment = attachments?.[0];
    if (attachment) {
      return {
        code: FieldCode.Success, // 0 表示请求成功
        // data 类型需与下方 resultType 定义一致
        data: {
          id: attachment.tmp_url, // 附件 token
          primaryProperty: attachment.tmp_url,
          name: attachment.name, // 附件名称
          size: attachment.size, // 附件尺寸
        },
      };
    }
    return {
      code: FieldCode.Error,
    };
  },
});

export default basekit;
```

### 文本字段

```TypeScript
type TextFieldValue = (ITextValue | IUrlValue | IMentionValue)[]

type ITextValue = {
    type: 'text';
    text: string;
}

type IUrlValue = {
    type: 'url';
    text: string;
    link: string;
}

type IMentionValue = {
    type: 'mention',
    text: string;
    token: string;
    link: string;
    mentionType: MentionType;
    name: string;
}

enum MentionType {
  User = 0, // 用户
  Doc = 1, // 文档
  Folder = 2, // 文档路径
  Sheet = 3, // sheet
  SheetDoc = 4, // sheet + docs
  Chat = 5, // 群聊
  Bitable = 8,
  Mindnote = 11,
  Box = 12, // 飞书云文档上传的文件类型
  Wiki = 16,
  Slide = 15,
  Docx = 22,
  Slides = 30,
  Bitable_Ind = 108,
}
```

### 数字字段

```TypeScript
type NumFieldValue = number;
```

### 日期字段

```TypeScript
type DateTimeFieldValue = number; // 时间戳
```

### URL 字段

```TypeScript
type URLFieldValue = {
    link: string;
    title: string;
}
```

### 单选字段

```TypeScript
type SingleSelectFieldValue = string; // 选项值
```

<br>

### 多选字段

```TypeScript
type MultiSelectFieldValue = string[]; // 选项值
```

<br>

<br>

### 复选框字段

```TypeScript
type CheckboxFieldValue = boolean;
```

<br>

## 表单公共配置项

以下是formItems的一些公共配置项目

### 表单帮助说明

```JavaScript
  formItems: [
    {
      key: 'k1',
      label: 'key:k1，多选,字段',
      tooltips: [
        {
          type: 'text',
          content: '普通文案'
        },
        {
          type: 'link',
          text: '链接',
          link: 'https://....'
        }
      ],
      props: {
        mode: 'single',
        supportType: [
          FieldType.Text,
        ]
      },
      component: FieldComponent.FieldSelect
    }]
```

表现结果：
![](14.png)

# 返回结果(resultType)

`resultType`用于定义捷径插件返回值的类型，注意：在`resultType`中声明的类型，需要与 `execute` 函数对应的返回值类型一致，否则数据会无法写入到多维表格

## 返回Object 字段

对于 Object 字段，其属性字段也是在此处声明

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType | 是 | 对于Object字段则为FieldType.Object |
| extra | object | 是 | Object字段的相关参数 |
| extra.icon | string | 是 | Object字段主属性的图标 |
| extra.properties | object\[\] | 是 | Object属性字段 |

其中 extra.properties 支持以下配置

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| key | string | 是 | Object属性字段的key。从execute返回值取值用。 |\
|||| 例如：execute返回值为res，则这个字段将显示res\[key\] |
| type | FieldType | 是 | Object属性字段类型 |
| title | string | 是 | Object属性字段的名称 |
| isGroupByKey | boolean | 否 | 标记该属性会作为 Object 字段的筛选、分组依据。⚠️注意： |\
|||||\
|||| 1. `properties`中必须有个属性的 `isGroupByKey` 为 `true`，且type只能为`FieldType.Text`，该属性会作为 Object 字段的筛选、分组依据。如果返回结果中不包含此属性的字段，则不会更新object字段 |\
|||| 	 |\
|||| 2. 该属性在运行时的返回值没有精度要求，只要字符串长度小于128的即可，如果没有适合的值作为筛选和分组依据，则可以使用 `` `${Date.now()}` `` |
| primary | boolean | 否 | 标记该属性为用于排序的主属性。⚠️注意： |\
|||||\
|||| 1. `properties`数组中必须有一个 `primary` 值为 `true` 表示主属性，且主属性type只能为 `FieldType.Text`或 `FieldType.Number`，且不能被隐藏。如果返回结果中不包含此属性的字段，则不会更新object字段 |
| hidden | boolean | 否 | 是否在字段面板中隐藏该字段，隐藏后该属性不可被新建为字段，默认为false |\
|||
| extra.formatter | NumberFormatter | 否 | 对于数字字段，可以指定其数字格式 |
| extra.dateFormat | DateFormatter | 否 | 对于时间字段，可以指定其日期格式 |

与 type 对应的实际返回值类型

| type类型 | 返回值类型 | 说明 | 示例 |
| --- | --- | --- | --- |
| FieldType.Text | `string` |  | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'text', |\
||||                     title: '文本', |\
||||                     type: FieldType.Text, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 text: 'xxx', |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |
| FieldType.Number | `number` |  | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'number', |\
||||                     title:'数字', |\
||||                     type: FieldType.Number, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 number: 1, |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |\
|||||\
|||||
| FieldType.SingleSelect | `string` | 返回单选的文案 | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'singleSelect', |\
||||                     title: '单选', |\
||||                     extra: { |\
||||                         options: [// 预设选项， |\
||||                           { name: 'opt_1' }, |\
||||                           { name: 'opt_2' } |\
||||                         ] |\
||||                       }, |\
||||                     type: FieldType.SingleSelect, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 singleSelect: 'opt_1', |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |\
|||||\
|||||
| FieldType.MultiSelect | `string[]` | 返回多选的文案数组 | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'multiSelect', |\
||||                     title: '多选', |\
||||                     extra: { |\
||||                         options: [// 预设选项， |\
||||                           { name: 'opt_1' }, |\
||||                           { name: 'opt_2' } |\
||||                         ] |\
||||                       }, |\
||||                     type: FieldType.MultiSelect, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 multiSelect: ['opt_1'], |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |\
|||||\
|||||
| FieldType.DateTime | `number` | UNIX 时间戳 | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'date', |\
||||                     title: '日期', |\
||||                     type: FieldType.DateTime, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 date: 7343493434343, |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |
| FieldType.Checkbox | `boolean` |  | ```JavaScript |\
|||| { |\
||||     resultType: { |\
||||         extra: { |\
||||             properties: [ |\
||||                 { |\
||||                     key: 'checkbox', |\
||||                     title: '复选框', |\
||||                     type: FieldType.Checkbox, |\
||||                 } |\
||||             ] |\
||||             // ... |\
||||         } |\
||||         // ... |\
||||     }, |\
||||     execute: async (formItemParams, context) => { |\
||||         return { |\
||||             code: FieldCode.Success, |\
||||             data: { |\
||||                 checkbox: true, |\
||||                 //... |\
||||             } |\
||||         } |\
||||     } |\
|||| } |\
|||| ``` |

## 返回附件字段

```TypeScript
/* execute 函数返回类型*/
type AttachmentResultType = {
    code: FieldCode;
    data: {
        name: string;//附件名称,需要带有文件格式后缀
        content: string;//可通过http.Get 请求直接下载的url
        contentType: "attachment/url";// 固定值
        width?: number;//选填，图片宽度
        height?: number;//选填，图片高度
    }[];
}
```

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| name | string | 附件名称 |
| contentType | string | "attachment/url"// 固定值 |
| content | string | 附件下载地址，必须是公共资源。**数量限制为5个附件，单个附件的大小限制为10M** |

**处理附件的捷径示例**

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'urls',
      label: '选择URL',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Text],
      },
      validator: {
        required: false
      }
    }
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {
    // 一些处理逻辑
    return {
      code: FieldCode.Success, // 0 表示请求成功
      data: [
        {
          "name": "ex.png", // 附件名称,需要带有文件格式后缀
          "content": "https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/jingjing0619/heavenly_stems_year_method.png", // 可通过http.Get 请求直接下载的url.
          "contentType": "attachment/url", // 固定值
          // "width": 800, // 选填，图片宽度
          // "height": 1200, // 选填，图片高度
        }
      ],
    };
  },
  resultType: {
    type: FieldType.Attachment,
  },
});

export default basekit;
```

<br>

## 返回多行文本字段

可以通过resultType创建一个多行文本字段，请参考完整示例：

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'account',
      label: '测试',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },

  ],
  resultType: {
    type: FieldType.Text,// 定义捷径的返回结果类型为多行文本字段
  },
  execute: async (formItemParams: any, context) => {
    return {
      code: FieldCode.Success,
      data: '123',// data必须为字符串，
    }
  },
});
export default basekit;
```

<br>

## 返回单选字段

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.SingleSelect | 是 | 声明返回为单选字段 |
| extra | object | 是 | 单选字段的相关参数 |
| extra.options | {name: string}\[\] | 是 | 单选字段的预设选项 |

可以通过resultType创建一个单选字段，请参考完整示例：

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'account',
      label: '测试',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },

  ],
  resultType: {
    type: FieldType.SingleSelect,// 定义捷径的返回结果类型为单选字段
    extra: {
      // 预设的选项
      options: [
        {
          name: '预设选项1'
        },
        {
          name: '预设选项2'
        }
      ]
    }
  },
  execute: async (formItemParams: any, context) => {
    return {
      code: FieldCode.Success,
      data: '预设选项1',// data必须为字符串，或者null。如果该选项在字段中不存在，则会自动创建一个该选项。在开发调试阶段，字段编辑的时候只显示预设的选项，不会保存自动创建的选项。上线之后，则会保存自动创建的选项
    }
  },
});
export default basekit;
```

<br>

## 返回多选字段

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.MultiSelect | 是 | 声明返回为多选字段 |
| extra | object | 是 | 多选字段的相关参数 |
| extra.options | {name: string}\[\] | 是 | 多选字段的预设选项 |

可以通过resultType创建一个多选字段，请参考完整示例：

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'account',
      label: '测试',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },

  ],
  resultType: {
    type: FieldType.MultiSelect,// 定义捷径的返回结果类型为多选字段
    extra: {
      options: [
        // 预设的选项
        {
          name: '预设选项1'
        },
        {
          name: '预设选项2'
        }
      ]
    }
  },
  execute: async (formItemParams: any, context) => {
    return {
      code: FieldCode.Success,
      data: ['预设选项1', '预设选项2'],// data必须为字符串数组，或者null。如果该选项在字段中不存在，则会自动创建一个该选项。在开发调试阶段，字段编辑的时候只显示预设的选项，不会保存自动创建的选项。上线之后，则会保存自动创建的选项
    }
  },
});
export default basekit;
```

<br>

## 返回数字字段

可以通过resultType创建一个数字字段，请参考完整示例：

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'account',
      label: '测试',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },

  ],
  resultType: {
    type: FieldType.Number,// 定义捷径的返回结果类型为数字字段
  },
  execute: async (formItemParams: any, context) => {
    return {
      code: FieldCode.Success,
      data: 123.8882,// data必须为数字，或者null
    }
  },
});
export default basekit;
```

<br>

## 返回日期字段

| 属性 | 值 | 是否必填 | 说明 |
| --- | --- | --- | --- |
| type | FieldType.DateTime | 是 | 声明返回为日期字段 |
| extra | object | 否 | 日期字段的相关参数 |
| extra.dateFormat | DateFormatter | 否 | 日期字段的预设格式 |

可以通过resultType创建一个日期字段，请看完整示例：

```JavaScript
import { basekit, FieldType, field, FieldComponent, FieldCode, NumberFormatter, AuthorizationType, DateFormatter } from '@lark-opdev/block-basekit-server-api';

basekit.addField({
  formItems: [
    {
      key: 'account',
      label: '测试',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      }
    },
  ],
  resultType: {
    type: FieldType.DateTime,// 定义捷径的返回结果类型为日期字段
    extra: {
      dateFormat: DateFormatter.DATE_MD_WITH_HYPHEN // 可选的格式
    }
  },
  execute: async (formItemParams: any, context) => {
    return {
      code: FieldCode.Success,
      data: 1234567890123, //data必须为毫秒级时间戳
    }
  },
});
export default basekit;
```

<br>

# 执行函数(execute)

## execute入参

`execute`定义捷径插件的运行逻辑，目前仅支持 `Nodejs`，该函数包含以下入参。

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `formItemParams` | object | 是实际运行时用户传入的参数， |\
||||\
||| - 该对象的`key`会与`formItems`中定义的 key 值保持一致 |\
||| 	 |\
||| - value 与`formItems`中各种组件定义的结构一致 |\
||| 	- 对于FieldSelect组件，如果mode 选择的是multiple，则返回的是一个数组 |\
||| 		 |\
||||\
||| 示例： |\
||||\
||| ```JSON |\
||| { |\
|||     "textKey": "文本值", |\
|||     "numberKey": 1.23, |\
|||     "numbersKey": [1.23, 1.24] // numbersKey配置的mode为multiple |\
||| } |\
||| ``` |
| `context` | Context | 每次调用的上下文，数据结构见下方的`context`定义 |

### context定义

我们通过会 context 对象，向运行中的 FaaS 函数提供上下文环境信息

| 参数 | 类型 | 示例值 | 说明 |
| --- | --- | --- | --- |
| fetch | (url, options, authorizationId) => Promise<Response> |  | 请求外部的数据的API |
| baseSignature | string | eyJzb3V... | 签名数据，与packID配合使用，可以在服务端验证请求是否来自此捷径，详见“捷径流量标识” |
| baseID | string | 7395539782238404612 | 多维表格的id，仅用于区分多维表格，无法通过此id定位到某一具体多维表格。 |
| logID | string | 02172524652697100000000000000000000fffff9bbf0be4d73cd | 可用于报错的时候协助排查错误日志。 |
| tableID | string | tblvoVgvLtYumGeq | 数据表中的表格id |
| packID | string | replit\_3e4ce893726c23e4 | 捷径上线后的唯一标识。可以与baseSignature配合使用，供开发者服务端验证流量来源 |
| tenantKey | string | 11a1b11208c8575e | 租户id，可用于计费 |
| timeZone | string | Asia/Shanghai | 时区 |
| baseOwnerID | string | ou\_e04138c9633dd0d2ea166d79f54abcef | 文档owner用户在捷径字段场景下的唯一标识 |

## execute返回值

`execute`必须要有一个返回值，通过`code`告知多维表格运行结果，`msg` 填写异常信息，通过`data`返回数据

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `code` | `FieldCode` | `execute`执行结果`code`，具体值见下方的`code`定义。 |\
||| 请使用code来向用户抛出错误，而不是msg |
| `data` | `object` | 根据定义的返回结果(resultType)，返回对应的数据结构值，目前只支持Object 字段。 |\
||||\
||| - Object 字段，根据返回结果的定义返回对应的属性值，其中id和主属性是必填值 |
| `msg` | `string` | `execute`执行错误信息，仅用于feishu内部用户查日志debug，不会向使用者暴露，可以一些特殊格式开头以方便查日志debug，比如：'===捷径代码主动返回错误:....' |\
||| 请严格遵循code的规则来向用户抛出错误。 |

```JavaScript
import { basekit, ParamType } from '@lark-opdev/block-basekit-server-api';
basekit.addField({
    // ...
    execute: async function(formItemParams, context) {
        return {
            code: FieldCode.Success,
            data: {
                id:"id1", 
                primaryProperty:"prim1", // 主属性，只能是n umber 或 string
                property1:"value1", // key是返回结果定义的properties中的key
                property2:234  // value 结构要与返回结果定义的properties中的type 对应的返回值类型一致
            },
            msg: '',
        };
    },
});
```

### `code`

| code值 | 含义 |
| --- | --- |
| FieldCode.Success | 运行成功 |
| FieldCode.ConfigError | 配置错误，即用户在配置面板选择的值不合法可以返回该错误码 |
| FieldCode.AuthorizationError | 授权错误 |
| FieldCode.PayError | 付费错误异常 |
| FieldCode.RateLimit | 限流 |
| FieldCode.QuotaExhausted | quota耗尽 |
| FieldCode.InvalidArgument | 参数错误，用户所选配置的内容合法，但是代码中未兼容等情况。 |
| FieldCode.Error | 插件运行失败（如果前面的code值都不符合，才考虑使用通用的报错code） |

<br>

## 请求外部数据

你可以通过`context`中注入的 `fetch` 方法请求外部数据，`fetch`语法见[node-fetch](https://github.com/node-fetch/node-fetch)

```JavaScript
// 声明域名白名单，向不在白名单内的域名请求会被拒绝
basekit.addDomainList(['example.api.com']);

basekit.addField({
    execute: async function(formItemParams, context) {
        const { fetch } = context;
        // 发起带Query的请求文本数据
        const query = new URLSearchParams({
            foo: 'bar',
        });
        // 发起 GET 请求text数据
        fetch(`https://example.api.com?${query.toString()}`).then(res => res.text());
        // 发起 POST 请求json数据
        fetch('https://example.api.com', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                foo: 'bar',
            }),
        }).then(res => res.json());
    },
    ...
});
export default basekit;
```

### 域名白名单

注意：需要在插件调用`basekit.addDomainList`声明所需发起网络请求的域名白名单，向不在白名单内的域名请求会被拒绝！！！

- 所填写域名需包含主机名（如 example.com）.可打开其子域名（如 doc.example.com）
	
- 域名可以使用 IP 地址（支持IPV4和 IPV6）或 localhost
	
- 不支持配置端口
	
- 仅支持填写域名，带上协议、路径会导致匹配失败
	

```JavaScript
basekit.addDomainList(['example.com']); // 可以打开 https://doc.example.com, https://img.example.com

basekit.addDomainList(['localhost']); // 可以打开 http://localhost:{{port}}，其中任意端口号都可以访问

basekit.addDomainList(['192.168.1.1']); // 可以打开 http://192.168.1.1:{{port}}，其中任意端口号都可以访问

basekit.addDomainList(['https://example.com']); // ❌带上了协议会导致无法正确识别域名
basekit.addDomainList(['example.com/'， 'example.com/path']); // ❌带上了路径会导致无法正确识别域名
```

# 授权

凭证不是字段捷径的必选项，取决于字段捷径代码是否依赖其他三方平台的凭证以及是否需要托管到平台侧。

- 对于平台[已接入](https://feishu.feishu.cn/docx/SZFpd9v6EoHMI7xEhWhckLLfnBh#share-WTFzd4z2EoHGalxzI9Ac8e4qnSg)的凭证类型，开发者按照本文指引定义具体的插件接口。
	
- 对于平台未接入的凭证类型，开发者如有需要，可提需求给平台，平台经过评估后决定是否接入。新接入凭证，开发者需要提供如下信息。
	- 凭证类型（ApiKey，Oauth）
		
	- 凭证使用相关文档
		
	- 如果凭证账号展示三方平台的账号信息，还需额外提供用于拉取三方账号信息的API。并指定需要展示的字段
		
	![](15.png)
	

<br>

## 已支持的三方凭证

目前只支持以下三方凭证，如果想要支持更多的凭证，请填写[申请表单](https://bytedance.larkoffice.com/share/base/form/shrcn75JZxOoVsZ9DW9qGPOaNbe)

| 平台唯一标识(platform) | 平台说明 | 凭证类型 | 平台官方链接 |
| --- | --- | --- | --- |
| nolibox | 画宇宙开放平台凭证 | ApiKey | https://creator-nolibox.apifox.cn/endpoint-56289960 |
| feishu\_user | 飞书用户身份凭证user\_access\_token | Oauth2 | https://open.larkoffice.com/document/server-docs/api-call-guide/calling-process/get-access-token#4d916fe0 |
| baidu | 百度智能云 | ApiKey | https://cloud.baidu.com/ |
| qzoffice | 轻竹智能 | ApiKey |  |
| autodocs | autodocs | ApiKey |  |
| juzi | 句子秒回企业级凭证 | ApiKey | [https://api-doc.juzibot.com/](https://api-doc.juzibot.com/) |
| minimax |  | ApiKey |  |
| zhipuAI |  | ApiKey |  |
| zhipu\_bigmodel |  | ApiKey |  |
| volcengine |  | ApiKey |  |
| connect\_ai |  | ApiKey |  |

- 「平台唯一标识」在开发者授权相关模块代码中会被用到，详情可参考下文「ApiKey授权模式」章节
	

## APIKey 授权模式

### 支持的授权模式

目前多维表格支持以下几种 APIKey 授权模式

| 授权类型 | 相关介绍 | 代码示例 | 本地调试授权示例 |\
|||| 本地开发阶段，在src/config.json中设置mock值以进行本地调试 |
| --- | --- | --- | --- |
| HeaderBearerToken | 用户输入 APIKey 后，多维表格框架在请求时会在header中带上请求头 | ```JSON | 本地测试时field-demo/config.json结构与authorizations结构对应如下图所示： |\
||| basekit.addField({ | ![](16.png) |\
|| ```JavaScript |   authorizations: [ | 在execute函数中使用该授权： |\
|| Authorization: Bearer APIKey |     { | ![](17.png) |\
|| ``` |       id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权 | 然后在捷径开发助手中正常调试，即可测试field-demo/config.json中mock的授权信息。框架会自动给请求头带上Authorization: Bearer APIKey，这是服务端接收到的请求数据示例： |\
|||       platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单) ||\
|| 服务端接收到的请求示例： |       type: AuthorizationType.HeaderBearerToken, | ```JSON |\
|||       required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息 | "body": "", |\
|| ```JSON |       instructionsUrl: "https://www.feishu.com",// 帮助链接，告诉使用者如何填写这个apikey | "headers":{ |\
|| "body": "", |       label: '测试授权', |     "user-agent": "node-fetch/1.0 ", |\
|| "headers":{ |       icon: { |     "content-length": "0", |\
||     "user-agent": "node-fetch/1.0 ", |         light: '', |     authorization": "Bearer AAAAAA" |\
||     "content-length": "0", |         dark: '' | }, |\
||     authorization": "Bearer AAAAAA" |       } | "url": "......." |\
|| }, |     } | ``` |\
|| "url": "......." |   ], |\
|| ``` |   execute: async (params, context) => { |\
|||     const url = 'https://0e804556-44f1-444a-912a-2bfdf1053c10-00-slhw95d5te6p.spock.replit.dev/upload';// 已经在addDomainList中添加为白名单的请求 |\
|||     // 通过指定context.fetch第3个参数为授权id： auth_id_1。则会在请求头带上 Authorization: Bearer APIKey |\
|||     const res = await context.fetch(url, { |\
|||       method: 'POST', |\
|||     }, 'auth_id_1');// 第三个参数为某个授权的id |\
||||\
|||   } |\
||| }); |\
||| ``` |\
||||\
||||
| Basic | 用户输入用户名和密码，多维表格框架在请求时在 header 中带上请求头 | ```JavaScript | 本地测试时field-demo/config.json结构与authorizations结构对应如下图所示： |\
||| basekit.addField({ | ![](18.png) |\
|| ```JavaScript |   authorizations: [ | 在execute函数中使用该授权： |\
|| Authorization: Basic <base64 encoded username:password> |     { | ![](19.png) |\
|| ``` |       id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权 | 然后在捷径开发助手中正常调试，即可测试field-demo/config.json中mock的授权信息。框架会自动带上请求头： |\
|||       platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单) | Authorization: Basic <base64 encoded username:password> 这是服务端接收到的请求数据示例： |\
|| 服务端接收到的请求示例： |       type: AuthorizationType.Basic, ||\
|||       required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息 | ```JSON |\
|| ```JSON |       params: { | "body": "", |\
|| "body": "", |         usernamePlaceholder: '请输入用户名', | "headers":{ |\
|| "headers":{ |         passwordPlaceholder: '请输入密码', |     "user-agent": "node-fetch/1.0", |\
||     "user-agent": "node-fetch/1.0", |       }, |     "content-length": "0", |\
||     "content-length": "0", |       instructionsUrl: "https://www.feishu.com",// 帮助链接，告诉使用者如何填写这个apikey |     "authorization": "Basic QUFBQUFBQUFBOKJCQg==" |\
||     "authorization": "Basic QUFBQUFBQUFBOKJCQg==" |       label: '测试授权', | }, |\
|| }, |       icon: { | "url": "....." |\
|| "url": "....." |         light: '', | ``` |\
|| ``` |         dark: '' ||\
|||       } | 该字符串`QUFBQUFBQUFBOKJCQg==`进行Base64解码后： |\
|||     } | ![](20.png) |\
|||   ], ||\
|||   execute: async (params, context) => { |\
|||     // 通过指定context.fetch第3个参数为授权id： auth_id_1。则会在请求头带上 Authorization: Basic <base64 encoded username:password> |\
|||     const res = await context.fetch(url, { |\
|||       method: 'POST', |\
|||     }, 'auth_id_1');// 第三个参数为某个授权的id |\
|||   } |\
||| }); |\
||| ``` |
| MultiHeaderToken | 用户可以输入多个key，多维表格框架会在你请求时带上请求头。 | ```JavaScript | 本地测试时field-demo/config.json结构与authorizations结构对应如下图所示(按照params中的顺序一一对应)： |\
|| 服务端接收到的请求示例： | basekit.addField({ | ![](21.png) |\
|||   authorizations: [ | 在execute函数中使用该授权： |\
|| ```JSON |     { | ![](22.png) |\
|| "body": "", |       id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权 | 然后在捷径开发助手中正常调试，即可测试field-demo/config.json中mock的授权信息。无需手动拼接授权参数，框架会自动将其拼接到请求头中(这是服务端接收到的请求数据示例)： |\
|| "headers":{ |       platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单) ||\
||     "content-length": "0", |       type: AuthorizationType.MultiHeaderToken, | ```JSON |\
||     "id": "AAAAAA", |       required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息 | "body": "", |\
||     "token": "BBBBBBB" |       params: [ | "headers":{ |\
|| }, |         { key: "id", placeholder: "id" }, |     "content-length": "0", |\
|| "url": "....." |         { key: "token", placeholder: "token" }, |     "id": "AAAAAA", |\
|| ``` |       ], |     "token": "BBBBBBB" |\
|||       instructionsUrl: "https://www.feishu.com",// 帮助链接，告诉使用者如何填写这个apikey | }, |\
|||       label: '测试授权', | "url": "....." |\
|||       icon: { | ``` |\
|||         light: '', |\
|||         dark: '  ' |\
|||       } |\
|||     } |\
|||   ], |\
|||   execute: async (params, context) => { |\
|||       // 通过指定 Example，则会在请求头带上 X-PW-AccessToken、X-PW-UserEmail、other等请求头 |\
|||       await context.fetch(url, options, 'auth_id_1');// 第三个参数为某个授权的id |\
|||   } |\
||| }); |\
||| ``` |\
||||\
||||
| MultiQueryParamToken | 用户能输入多个key，多维表格框架会在请求时在url query 带上授权信息 | ```JavaScript | 本地测试时field-demo/config.json结构与authorizations结构对应如下图所示(按照params中的顺序一一对应)： |\
|| 服务端接收到的请求示例： | basekit.addField({ | ![](23.png) |\
|||   authorizations: [ | 在execute函数中使用该授权： |\
|| ```JSON |     { | ![](24.png) |\
|| "body": "", |       id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权 | 然后在捷径开发助手中正常调试， 即可测试field-demo/config.json中mock的授权信息。无需手动拼接授权参数，框架会自动将其拼接到url query中(这是服务端接收到的请求数据示例)： |\
|| "headers":{ |       platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单) ||\
||     "user-agent": "node-fetch/1.0..." |       type: AuthorizationType.MultiQueryParamToken, | ```JSON |\
||     "content-length": "0", |       required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息 | "body": "", |\
|| }, |       params: [ | "headers":{ |\
|| "url": "http://...../upload?id=AAAAAA&token=BBBBBBBB" |         { key: "id", placeholder: "id" }, |     "user-agent": "node-fetch/1.0..." |\
|| ``` |         { key: "token", placeholder: "token" }, |     "content-length": "0", |\
|||       ], | }, |\
|||       instructionsUrl: "https://www.feishu.com",// 帮助链接，告诉使用者如何填写这个apikey | "url": "http://...../upload?id=AAAAAA&token=BBBBBBBB" |\
|||       label: '测试授权', | ``` |\
|||       icon: { |\
|||         light: '', |\
|||         dark: '' |\
|||       } |\
|||     } |\
|||   ], |\
|||   execute: async (params, context) => { |\
|||     const url = 'https://0e804556-44f1-444a-912a-2bfdf1053c10-00-slhw95d5te6p.spock.replit.dev/upload';// 已经在addDomainList中添加为白名单的请求 |\
|||     // 通过指定context.fetch第三个参数为authorizations中的某个id, 比如auth_id_1，则会在query带上 id=xxx&token=xxx |\
|||     const res = await context.fetch(url, { |\
|||       method: 'POST', |\
|||     }, 'auth_id_1');// 某个授权的id |\
|||   } |\
||| }); |\
||| ``` |\
||||\
||||
| Custom | 用户可以输入多个key，由你指定组装到url或body中（不包含headers） | ```JavaScript | 本地测试时field-demo/config.json结构与authorizations结构对应如下图所示(按照params中的顺序一一对应)： |\
|| 服务端接收到的请求示例： | basekit.addField({ | ![](25.png) |\
|||   authorizations: [ | 在execute函数中使用该授权： |\
|| ```JSON |     { | ![](26.png) |\
|| "body":"这是id:AAAAAAAA。这是token:BBBBBBB" |       id: 'auth_id_1',// 授权的id，用于context.fetch第三个参数以区分该请求使用哪个授权 | 然后在捷径开发助手中正常调试，即可测试field-demo/config.json中mock的授权信息。这是服务端接收到的请求数据示例： |\
|| "headers":{ |       platform: 'baidu',// 需要与之授权的平台,比如baidu(必须要是已经支持的三方凭证,不可随便填写,如果想要支持更多的凭证，请填写申请表单) ||\
||     "content-length": "36", |       type: AuthorizationType.Custom, | ```JSON |\
||     "content-type": "text/plain;charset=UTF-8", |       required: false,// 设置为选填，用户如果填了授权信息，请求中则会携带授权信息，否则不带授权信息 | "body":"这是id:AAAAAAAA。这是token:BBBBBBB" |\
|| }, |       params: [ | "headers":{ |\
|| "url": "https://..../upload?id=AAAAAA&token=BBBBBBBB" |         { key: "id", placeholder: "id" }, |     "content-length": "36", |\
|| ``` |         { key: "token", placeholder: "token" }, |     "content-type": "text/plain;charset=UTF-8", |\
|||       ], | }, |\
|||       instructionsUrl: "https://www.feishu.com",// 帮助链接，告诉使用者如何填写这个apikey | "url": "https://..../upload?id=AAAAAA&token=BBBBBBBB" |\
|||       label: '测试授权', | ``` |\
|||       icon: { |\
|||         light: '', |\
|||         dark: '' |\
|||       } |\
|||     } |\
|||   ], |\
|||   execute: async (params, context) => { |\
|||       const url = 'https://api.excample.com/api'; |\
||||\
|||       // 通过指定context.fetch第三个参数为authorizations中的某个id, 比如auth_id_1，则会自动替换url、body中的key |\
|||       const res = await context.fetch(url+'?id={{id}}&token={{token}}', {// 注意{{}}不可被编码，否则将不会进行替换 |\
|||       method: 'POST', |\
|||       body:'这是id:{{id}}。这是token:{{token}}' |\
|||     }, 'auth_id_1');// 某个授权的id |\
|||   } |\
||| }); |\
||| ``` |\
||||\
||||

### 开发阶段本地调试授权

在开发阶段暂不支持直接显示授权ui界面并调试。仅支持通过设置config.json来进行模拟调试：config.json中的配置将模拟用户的授权输入。
如果要调试非必填的授权项，用户未填写授权的情况，则可以在config.json中将对应的授权信息设置为空字符串即可。
根据不同的授权类型，在项目根目录中修改config.json中的`authorizations`为对应的结构即可在捷径调试阶段注入`config.json`中的的模拟授权信息。
每种授权类型的授权mock参数格式详见上方表格中的"本地调试授权示例"一列。
![](27.png)

# 字段配置

支持通过 `basekit.addField`的`options`控制字段的配置，示例代码如下

```TypeScript
basekit.addField({
  options: {
    disableAutoUpdate: true, // 关闭自动更新
  },
  // ...
});
```

目前支持配置如下

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| disableAutoUpdate | boolean | 是否关闭自动更新，默认为false开启自动更新，传递true则为关闭自动更新，字段不再跟随字段配置自动更新，并且字段配置面板不会再展示自动更新按钮 |\
||| ![](28.png) |\
||||

# 捷径流量标识

目前开发者在插件里通常会通过http协议调用自己服务端的api，某些情况下，为了适配捷径插件，api无任何校验，为了防止被其他恶意流量，base侧目前支持三方开发者识别流量来源于base。具体的实现方式是：平台侧通过私钥签名一份数据，开发者通过平台暴漏的公钥对数据进行验签来确保流量来源于base。
具体做法：

1. 在捷径请求中同时将`context.baseSignature`和`context.packID`带上。
	
2. 服务端对`baseSignature`验签后再比较其中的`packID`，如果验签通过且`packID`一致，则表示该请求是来自`packID`的捷径插件。需要注意的是，在本地调试开发阶段，`baseSignature`是一个固定的值，每个开发者拿到的值都是一样的。
	

流量标识数据如下：

```Go
eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9.eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9

//数据生成说明
//平台侧基于如下json数据
{
    "source": "base",   //来源标识，表示流量来源于base
    "version":"v1",     //数据版本，目前站定v1
    "packID":"",        //插件实体id表示，标识流量来源于某个插件
    "exp": 343434       //过期时间，生成规则是now+10min
}

第一步：对上述数据序列化，得到srcData
第二部：对上述数据srcData,先使用sha256 进行hash，然后用rsa私钥，对hash后的数据进行签名，
      签名后的数据为srcSignData
第三步：对第一步的数据srcData进行base64.URLEncoding编码，得到srcBase64Data
第四步：对第二步的数据srcSignData进行base64.URLEncoding编码，得到srcBase64SignData
第五步：对第三步和第四部得到的数据通过[.]进行连接：srcBase64Data.srcBase64SignData
      signData=fmt.Sprintf("%s.%s", srcBase64Data, srcBase64SignData)
```

验签：

```Go
//验签于上述步骤相反，开发者拿到对应的验签数据signData
第一步：对于获取到的数据signData，使用[.]进行分割,得到srcBase64Data和srcBase64SignData
第二部：对于数据srcBase64Data，使用base64.URLEncoding解码，得到srcData
第三步：对于数据srcBase64SignData，使用base64.URLEncoding解码，得到srcSignData
第四步：对数据srcData,通过sha256 进行hash，得到hashSrcData
第五步：使用rsa验签算法，通过公钥（下面给出），对两个数据hashSrcData，srcSignData进行验签，
        验签成功，则标识流量无问题。
        
解签示例：
签名数据：eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9.eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9
第一步：对于获取到的数据signData，使用[.]进行分割
srcBase64Data：eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9
srcBase64SignData：eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNWQwYjU5MGZlZTIzZjMiLCJleHAiOjE3MjQ1OTE3Njk2NDB9
第二部：对于数据srcBase64Data，使用base64.URLEncoding解码，得到:
srcData："{\"source\":\"base\",\"version\":\"v1\",\"packID\":\"replit_3e5d0b590fee23f3\",\"exp\":1722267389789}"
第三步：对于数据srcBase64SignData，使用base64.URLEncoding解码，得到:
srcSignData:${�0g��H        �e����X��j��7{h{9�܁�j������+n�k]�Sh�=O�3P-        ��
��̿�@����^���/�~B���qX�鮂Ͽ���x,qP�c��z�\R7J��k�DA��ZN�p%p�>�L���������8�x5?'ע��y2ߖ�C�"�{�lV��\�S<}��/���j�I��#�K;���9�i$����N�1.��d;�ip��49.��Y�-ە5�@G*}!d�Dw
第四步：使用rsa验签算法，通过公钥（下面给出），对两个数据srcData，srcSignData进行验签，
        验签成功且packID一致，则标识流量无问题。
        
```

示例代码(Nodejs写法)：

```JavaScript
const crypto = require('crypto');

// Base的公钥
const basePublicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxKNV23rheRvtUKDMJPOW
GhUt+W25k63X4Q1QYhztPlobF2VNIDR6eHVFUDP22aytzVguisJ/GaOKZ7FJDKis
9YvMUiCIFnfu1LWB4b4pa4ajmPk/Rr9DMSLz6frKRP0QqirWFe7t+u0K0nzzPe3/
a5ScSmJwYACmayQfLZFTFjyL0Z1SQFZM6pZ1J1w9ETxWI0NrpkMU7eqzVGvhf+OO
dmxsXrHARWa1Ldm3WqPCF3k5jKuPG7s0zB+iuBHamSitZ7ktBf0mzBBjsAjKQll1
kmdjryGbKX5sLXhEgOb5ndakYeA0Oy7vve2Hm78kH5MtaSv6MfNVjm5ForMjPAPQ
BQIDAQAB
-----END PUBLIC KEY-----`

function rsaVerySign(data, signData, publicKey) {
  const verify = crypto.createVerify('RSA-SHA256');
  verify.update(data);
  verify.end();
  const signatureBuffer = Buffer.from(signData, 'base64');
  return verify.verify(publicKey, signatureBuffer);
}

// 要验签的签名数据
const input = 'eyJzb3VyY2UiOiJiYXNlIiwidmVyc2lvbiI6InYxIiwicGFja0lEIjoicmVwbGl0XzNlNzFkZWYyODU2Y2UzZjQiLCJleHAiOjE3MjUzNjUyMjUyNjh9.Q6ixsDOiKg4EzI7L5xg9EfIkajPz1Eu6W4jPYFEx69sVFpqC516l4TBic-C5kLh2uPnSg6EVt5tasXXkjAFG9C7wBLalu1PHr1TmQ_2FkPfhlirQf1y9GL4WudvtLWgGjy2G2yGkw-tqiBaYb6YcbBuEAOTQ4kU6ohkn6SkckI01cl_6qDsUjb_m885Xr8kqoJSgkFDYzLLQB5LIZHI6d7JAOekCyTeuxPn-xxCohamyJUzZSJ9jxtX2aS-8F6UkAh6ta_VmhIDDsSeGN-ZyzEq_iV_Zzz4T3XkFWASdJmfm_l78OQcfoMKhBVhBB8p0G1uJII0lLcvTd01WVb7WUg=='; // 替换为实际的编码后的数据和签名
const data = input.split('.');
// 要签名的原始数据,base64解压缩后会得到原始数据
const encodedData = Buffer.from(data[0], 'base64').toString('utf8');
console.log('msg:', encodedData);
// Base用私钥签名后得到的加密数据
const encodedSign = data[1];
// 验签
const isValid = rsaVerySign(encodedData, encodedSign, basePublicKey);
console.log('isValid:', isValid);
```

<br>

公钥：

```Go
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxKNV23rheRvtUKDMJPOW
GhUt+W25k63X4Q1QYhztPlobF2VNIDR6eHVFUDP22aytzVguisJ/GaOKZ7FJDKis
9YvMUiCIFnfu1LWB4b4pa4ajmPk/Rr9DMSLz6frKRP0QqirWFe7t+u0K0nzzPe3/
a5ScSmJwYACmayQfLZFTFjyL0Z1SQFZM6pZ1J1w9ETxWI0NrpkMU7eqzVGvhf+OO
dmxsXrHARWa1Ldm3WqPCF3k5jKuPG7s0zB+iuBHamSitZ7ktBf0mzBBjsAjKQll1
kmdjryGbKX5sLXhEgOb5ndakYeA0Oy7vve2Hm78kH5MtaSv6MfNVjm5ForMjPAPQ
BQIDAQAB
-----END PUBLIC KEY-----
```

# 同步&异步执行插件

不同类型的插件，实际执行的时间会存在很大差异。比如一般AI生成类的插件，执行时间会比较久，经常出现超过一分钟的情况。目前插件平台侧在等待插件在沙箱执行结果时，有两种方式可选：同步、异步等待。因此插件发布时，可以选择插件的执行方式。两者方式的差异如下：

| 同步 | - 等待沙箱执行，超时时间为58s，超时会导致本次内容生成失败 |\
|| 	 |\
|| - 限流时，限制的是qps(参考限流章节) |
| --- | --- |
| 异步 | - 等待沙箱执行，超时时间为15min，超时会导致本次内容生成失败 |\
|| 	 |\
|| - 限流时，限制的是并发数(参考限流章节) |

# 限流

对于插件，考虑到插件侧能够承受的流量存在一定的限制，因此提供了限流的能力，目前主要提供两个维度（插件、租户），共三个限流值的配置，下面简要说明：

```JSON
{
    "concurrencyLimit": 100,        //插件级别限流
    "concurrencyTenantLimit": 10,  //插件、租户级别限流
    "concurrencyTenantLimitMap": {
        "1": 1000  //指定租户配置限流
    }
}

说明：插件执行时，concurrencyLimit与concurrencyTenantLimit两者需要同时满足，即两者任意一个校验失败
即视为失败。concurrencyTenantLimitMap独立于前两个配置之外，命中该配置的租户，不受前两个配置值的限制。
```

上文解释了限制值的含义，下面说明下限制值的含义，这里限制值的含义受插件执行方式（异步、同步）影响

| 同步 | 限制调度到下游的并发值，同一时间最多只有指定数量的流量到插件测。 |
| --- | --- |
| 异步 | 限制调度到下游的QPS，每s内，最多只有指定数量的流量到插件 |

说明：之所以同步、异步限制存在差异，主要是考虑异步通常执行时间较长，下游通常只能接受固定数量的执行任务。同步因为执行时间较短，因此采用了qps限制。

# 国际化

支持通过 `basekit.addField`声明国际化资源，通过`t`方法使用国际化 key，目前支持中文（`zh-CN`）、英文（`en-US`）、日文（`ja-JP`），如果当前的语言环境不属于其中3种，则会使用默认英文的语言资源。

```JavaScript
import { basekit, ParamType, field } from '@lark-opdev/block-basekit-server-api';
const { t } = field;

basekit.addField({
    i18n: {
        messages: {
            // 指定中文资源
            'zh-CN': {
                  "scene": "场景",
                  "name": "附件名称"
             },
             // 指定英文资源
            'en-US': {
                "scene": "Scene",
                "name": "Attachment Name"
             },
             'ja-JP': {
                 "scene": "シーン",
                 "name": "お名前"
             }
        },
    },
    formItems: [
        {
            ...
            label: t('scene'), // 使用 t(i18n_key) 指定国际化资源
            ...
        },
    ],
    resultType: {
        type: ParamType.Object,
        extra: {
            properties: [
                {
                    key: 'name',
                    type: FieldType.Text,
                    title: t('name'), // 使用 t(i18n_key) 指定国际化资源
                  },
            ]
        }
    }
});

export default basekit;
```

# FAQ

## 调试阶段只会处理第一行

在捷径的调试开发阶段，只会处理第一行记录，其余记录不会生成结果。
<br>

## Error: Cannot find module '@ies/starling\_intl'错误

在项目目录下，执行以下步骤重新安装依赖可解决

```JSON
rm -rf node_modules
npm i
```

## 获取多维表格的附件buffer数据

```JavaScript
import {
  basekit,
  FieldType,
  field,
  FieldComponent,
  FieldCode,
} from '@lark-opdev/block-basekit-server-api';

// 通过addDomainList添加附件的域名
basekit.addDomainList(['feishu.cn']);

basekit.addField({
  formItems: [
    {
      key: 'attachments',
      label: 'OCR 发票来源',
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Attachment],
      },
      validator: {
        required: true,
      },
    },
  ],
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (
    formItemParams: { attachments: { tmp_url: string }[] },
    context
  ) => {
    const { attachments } = formItemParams;
    if (attachments?.[0]?.tmp_url) {
      const response = await context.fetch(attachments[0].tmp_url);
      if (!response.ok) {
        throw new Error(`unexpected response ${response.statusText}`);
      }
      // 获取多维表格附件的buffer数据
      const buffer = response.buffer();
      return {
        code: FieldCode.Success,
      };
    }
    return {
      code: FieldCode.Error,
    };
  },
});
export default basekit;
```

# 交流群

如果在开发过程中遇到任何困难，或有任何反馈，请加入交流群，发起话题，与运营人员及其他开发者一起进行讨论。
暂时无法在飞书文档外展示此内容
<br>

# 捷径开发助手

## 日志查询

为了方便开发展排查插件的异常报错等问题，当前支持捷径开发者查询开发者代码里通过**console.log打印**的日志信息。查询的入口在[字段捷径开发助手](https://bytedance.larkoffice.com/base/extension/replit_3e4a086586ade3e3)：
目前查询日志时，需要提供如下参数：（捷径id，tableID）
![](29.png)

- 获取捷径 ID：在字段捷径中心搜索，进去字段捷径详情页，点击「分享链接」，链接末尾的字符串即为 ID，例如：https://bytedance.larkoffice.com/base/extension/replit\_3e1c110e91bda3e4
	
- TableID：URL 中 table = 后的字符。
	

![](30.png)
对于用户反馈异常的问题，可以让用户提供报错信息，按照如下方式一键复制即可：
![](31.png)
此功能仅供**捷径id对应的管理员**(捷径id请联系@彭骋 获取)查询**已上线**捷径输出的js代码console.log日志。**需要配置插件管理员，可联系PM进行配置。** 
查询能力上，目前限制了**时间跨度（6h）**以及最多返回的**日志条数(最多500条)。** 
<br>

<br>

# 更新日志

| 版本 | 更新时间 | 说明 |
| --- | --- | --- |
| 0 | 2024.7.4 | 初始版本 |
| 1 | 2024.7.9 | 优化执行函数部分 |
| 2 | 2024.7.12 | 增加其他功能的代码示例 |
| 3 | 2024.7.15 | 新增 isGroupByKey，修改 context 注入的内容 |
| 4 | 2024.7.29 | 不建议使用CustomHeaderToken、QueryParamToken |
| 5 | 2024.9.27 | 增加关闭自动更新的配置 |

<br>